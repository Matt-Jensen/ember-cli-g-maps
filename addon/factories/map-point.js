import computed from 'ember-computed';
import {assert} from 'ember-metal/utils';
import {default as get, getProperties} from 'ember-metal/get';
import {assign} from 'ember-platform';
import {isPresent} from 'ember-utils';
import on from 'ember-evented/on';

import mapOptions from './map-options';
import mapEvents from './map-events';
import loadGoogleMaps from '../utils/load-google-maps';

const {isArray} = Array;

/**
 * Generate boilerplate for Google map instances that
 * are focused around a single point including Map instances
 * themselves.
 *
 * This factory creates configuration for components that accept both top-level
 * properties or options object configurations, as well as a prioritized
 * list of instance centering strategies.
 *
 * @param {Object} settings
 * @return {Object}
 */
 // TODO dont require: updateGoogleMapInstance or getGoogleMapInstanceValue
export default function mapPointComponent(settings) {
  const {component} = settings;

  assert('Map Point requires `component` Object in settings', component);
  assert('Map Point requires `bound` Array in settings', isArray(settings.bound));
  assert('Map Point requires `googleMapsInstanceScope` String in settings', typeof settings.googleMapsInstanceScope === 'string');
  assert('Map Point requires `component.insertGoogleMapInstance` method in settings', Boolean(component.insertGoogleMapInstance));

  if (!settings.center) {
    settings.center = 'center';
  }

  const componentConfig = assign({}, component);
  assign(componentConfig, mapOptions(settings.bound, settings.passive));
  assign(componentConfig, mapEvents(settings));

  return assign(componentConfig, {
    /**
     * @public
     * @type {String}
     * Location of Google Maps instance object
     */
    googleMapsInstanceScope: settings.googleMapsInstanceScope,

    /**
     * @private
     * Allow test stubbing
     */
    _loadGoogleMaps: loadGoogleMaps,

    /**
     * @private
     * @type {Object}
     * Used for Map Point's fallback behavior
     */
    _mapPointDefaults: settings.defaults,

    /**
     * @private
     * @type {String}
     * Location of the Google Maps instance center point
     */
    _mapPointCenter: settings.center,

    /**
     * @type {Object}
     * LatLngLiteral combination of lat lng
     * NOTE this is designed to be overwritten, by user, if desired
     */
    [settings.center]: computed('lat', 'lng', `options.{lat,lng,${settings.center}}`, function() {
      return getProperties(this, 'lat', 'lng');
    }),

    _mapPointDidInsertElement: on('didInsertElement', function() {
      this._super(...arguments);

      /*
       * Expect Google Map instance object is lazily instantiated
       */
      const scope = this.googleMapsInstanceScope;
      assert(`${scope} is a reserved namespace`, isPresent(get(this, scope)) === false);

      /*
       * Add any passive settings to options
       * override top level passive properties with overrided options
       */
      const passives = assign({}, get(this, 'passives'));
      const options = assign(passives, get(this, 'options')); // clone options

      /*
       * Set center in order of strategy priority
       */
      options[this._mapPointCenter] = getCenter(options, get(this, 'center'), this._mapPointDefaults, this._mapPointCenter);

      /*
       * Insert google map instance with options
       */
      return this._loadGoogleMaps()
      .then(() => {
        this.insertGoogleMapInstance(options);
        this.bindGoogleMapsInstanceEvents();
      });
    }),

    _mapPointDidUpdateAttrs: on('didUpdateAttrs', function() {
      this._super(...arguments);

      /*
       * Expect Google Map instance object to of been
       * set during the `insertGoogleMapInstance` hook
       */
      const mapObjInstance = get(this, this.googleMapsInstanceScope);
      assert(`Map Point requires a Google Map instance object at: ${this.googleMapsInstanceScope}`, mapObjInstance);

      /*
       * Set center in order of strategy priority
       */
      const options = assign({}, get(this, 'options'));
      options[this._mapPointCenter] = getCenter(options, get(this, 'center'), this._mapPointDefaults, this._mapPointCenter);

      /*
       * Check for changes to bound options and apply to instance
       */
      settings.bound
      .filter((option) => options[option] !== undefined)
      .forEach((option) => {
        const value = options[option];
        const current = mapObjInstance.get(option);

        if (isDiff(value, current)) {
          mapObjInstance.set(option, value);
        }
      });
    })
  });
}

/**
 * @return {Object} center
 * Ensure that center is configured in order of priority:
 * - user override: options.center
 * - user override: options.{lat,lng}
 * - user override: center
 * - top level: lat,lng
 * - fallback
 */
export function getCenter(options, centerProp, fallback = {}, point = 'center') {
  const optionsCenter = options[point] || {};

  // options.center
  if (isPresent(optionsCenter.lat) && isPresent(optionsCenter.lng)) {
    return optionsCenter;
  }

  // options.{lat,lng}
  if (isPresent(options.lat) && isPresent(options.lng)) {
    return {
      lat: options.lat,
      lng: options.lng
    };
  }

  // top-level center... or any top-level {lat,lng}
  if (isPresent(centerProp.lat) && isPresent(centerProp.lng)) {
    return centerProp;
  }

  // fallback
  return {
    lat: fallback.lat,
    lng: fallback.lng
  };
}

function isDiff(a, b) {
  if (typeof a === 'object') {
    return JSON.stringify(a).toLowerCase() !== JSON.stringify(b).toLowerCase();
  } else {
    return a !== b;
  }
}
