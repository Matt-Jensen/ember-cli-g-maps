import computed from 'ember-computed';
import {assert} from 'ember-metal/utils';
import {default as get, getProperties} from 'ember-metal/get';
import {assign} from 'ember-platform';
import {bind} from 'ember-runloop';
import {isPresent} from 'ember-utils';

import mapOptions from './map-options';
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
export default function mapPointComponent(settings) {
  const {component} = settings;

  assert('component configuration is required', component);
  assert('bound options are required', isArray(settings.bound));
  assert('component configuration requires `insertGoogleMapInstance` method', Boolean(component.insertGoogleMapInstance));
  assert('component configuration requires `updateGoogleMapInstance` method', Boolean(component.updateGoogleMapInstance));
  assert('component configuration requires `getGoogleMapInstanceValue` method', Boolean(component.getGoogleMapInstanceValue));

  if (!settings.center) {
    settings.center = 'center';
  }

  const configuration = mapOptions(settings.bound, settings.passive);
  const componentConfig = assign(component, configuration);

  return assign(componentConfig, {
    /**
     * @private
     * Allow test stubbing
     */
    _loadGoogleMaps: loadGoogleMaps,

    /**
     * @type {Object}
     * LatLngLiteral combination of lat lng
     * NOTE this is designed to be overwritten, by user, if desired
     */
    [settings.center]: computed('lat', 'lng', `options.{lat,lng,${settings.center}}`, function() {
      return getProperties(this, 'lat', 'lng');
    }),

    didInsertElement() {
      this._super(...arguments);

      /*
       * Add any passive settings to options
       * override top level passive properties with overrided options
       */
      const passives = assign({}, get(this, 'passives'));
      const options = assign(passives, get(this, 'options')); // clone options

      /*
       * Set center in order of strategy priority
       */
      options.center = getCenter(options, get(this, 'center'), settings.defaults);

      /*
       * Insert google map instance with options
       */
      return this._loadGoogleMaps()
      .then(bind(this, this.insertGoogleMapInstance, options));
    },

    didUpdateAttrs() {
      this._super(...arguments);

      /*
       * Set center in order of strategy priority
       */
      const options = assign({}, get(this, 'options'));
      options.center = getCenter(options, get(this, 'center'), settings.defaults);

      /*
       * Check for changes to bound options and apply to instance
       */
      settings.bound
      .filter((option) => options[option] !== undefined)
      .forEach((option) => {
        const value = options[option];
        const current = this.getGoogleMapInstanceValue(option);

        if (isDiff(value, current)) {
          this.updateGoogleMapInstance(option, value);
        }
      });
    }
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
export function getCenter(options, centerProp, fallback = {}) {
  const optionsCenter = options.center || {};

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
