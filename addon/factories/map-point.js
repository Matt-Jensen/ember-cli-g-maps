import computed from 'ember-computed';
import {assert} from 'ember-metal/utils';
import {default as get, getProperties} from 'ember-metal/get';
import {assign} from 'ember-platform';
import {isPresent} from 'ember-utils';
import {bind} from 'ember-runloop';
import on from 'ember-evented/on';

import mapOptions from './map-options';
import mapEvents from './map-events';
import loadGoogleMaps from '../utils/load-google-maps';

const {isArray} = Array;
const MAP_POINT_DEFAULTS = {lat: 1, lng: 1};

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
     * @public
     * @type {Array}
     * List of Map Point bound options
     */
    googleMapsInstanceBoundOptions: settings.bound,

    /**
     * @private
     * Allow test stubbing
     */
    _loadGoogleMaps: loadGoogleMaps,

    /**
     * @private
     * @type {Object}
     * Used for Map Point's fallback (lat,lng) behavior
     * NOTE ensures that valid lat & lng is set
     */
    _mapPointDefaults: assign(assign({}, MAP_POINT_DEFAULTS), settings.defaults),

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

    /**
     * @private
     */
    _mapPointDidInsertElement: on('didInsertElement', didInsertGoogleMapInstanceElement),

    /**
     * @private
     */
    _mapPointDidUpdateAttrs: on('didUpdateAttrs', didUpdateOptions),

    /**
     * @private
     */
    _mapPointGetCenter: getCenter
  });
}

/**
 * @return {RSVP.Promise}
 * Invoke Map Points lifecycle hooks once Google Maps libraries
 * have loaded, ensuring they are given the current instance options
 */
function didInsertGoogleMapInstanceElement() {
  /*
   * Expect Google Map instance object is lazily instantiated
   */
  const scope = this.googleMapsInstanceScope;
  assert(`"${scope}" is a reserved namespace`, isPresent(get(this, scope)) === false);

  /*
   * Get all options including passives
   */
  const options = this.mapOptionsGetAll();

  /*
   * Set center in order of strategy priority
   */
  options[this._mapPointCenter] = this._mapPointGetCenter();

  /*
   * Insert google map instance with options
   */
  return this._loadGoogleMaps()
  .then(bind(this, this.insertGoogleMapInstance, options))
  .then(bind(this, this.bindGoogleMapsInstanceEvents));
}

/**
 * @return {undefined}
 * Invoke any updates of Google Map Instance defined at
 * Component's `googleMapsInstanceScope` if change detected
 */
function didUpdateOptions() {
  const mapObjInstance = get(this, this.googleMapsInstanceScope);

  /*
   * Do not handle updates until Google Maps instance
   * has been asyncronously set via: `insertGoogleMapInstance`
   */
  if (!mapObjInstance) { return; }

  /*
   * Set center in order of strategy priority
   */
  const options = this.mapOptionsGetBound();
  options[this._mapPointCenter] = this._mapPointGetCenter();

  /*
   * Check for changes to bound options and apply to instance
   */
  this.googleMapsInstanceBoundOptions
  .filter((option) => options[option] !== undefined)
  .forEach((option) => {
    const value = options[option];
    const current = mapObjInstance.get(option);

    if (isDiff(value, current)) {
      mapObjInstance.set(option, value);
    }
  });
}

/**
 * @return {Object} center
 * Ensure that center is discovered in order of priority:
 * - user override: options.center
 * - user override: options.{lat,lng}
 * - user override: center
 * - top level: lat,lng
 * - fallback
 */
function getCenter() {
  const scope = this._mapPointCenter;
  const optionsCenter = get(this, `options.${scope}`) || {};

  // options.center
  if (optionsCenter && isPresent(optionsCenter.lat) && isPresent(optionsCenter.lng)) {
    return optionsCenter;
  }

  const optionsLatLng = getProperties(this, 'options.lat', 'options.lng');

  // options.{lat,lng}
  if (optionsLatLng && isPresent(optionsLatLng['options.lat']) && isPresent(optionsLatLng['options.lng'])) {
    return {lat: optionsLatLng['options.lat'], lng: optionsLatLng['options.lng']};
  }

  const centerProp = get(this, scope);

  // top-level center... or any top-level {lat,lng}
  if (centerProp && isPresent(centerProp.lat) && isPresent(centerProp.lng)) {
    return centerProp;
  }

  const defaults = this._mapPointDefaults;

  // fallback
  return {
    lat: defaults.lat,
    lng: defaults.lng
  };
}

function isDiff(a, b) {
  if (typeof a === 'object') {
    return JSON.stringify(a).toLowerCase() !== JSON.stringify(b).toLowerCase();
  } else {
    return a !== b;
  }
}
