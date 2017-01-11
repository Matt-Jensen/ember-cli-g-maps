import {assert} from 'ember-metal/utils';
import get from 'ember-metal/get';
import {assign} from 'ember-platform';
import {isPresent} from 'ember-utils';
import {bind} from 'ember-runloop';
import on from 'ember-evented/on';

import mapOptions from './map-options';
import mapEvents from './map-events';
import loadGoogleMaps from '../utils/load-google-maps';

const {isArray} = Array;

/**
 * Generate boilerplate for Component of Google map instances
 * that are focused around a series of latLng literals.
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

  assert('Map Poly requires `component` Object in settings', component);
  assert('Map Poly requires `bound` Array in settings', isArray(settings.bound));
  assert('Map Poly requires `googleMapsInstanceScope` String in settings', typeof settings.googleMapsInstanceScope === 'string');
  assert('Map Poly requires `component.insertGoogleMapInstance` method in settings', Boolean(component.insertGoogleMapInstance));

  if (!settings.path) {
    settings.path = 'path';
  }

  const componentConfig = assign({}, component);
  assign(componentConfig, mapOptions(
    settings.googleMapsInstanceScope,
    settings.bound.filter((opt) => opt !== settings.path), // path managed here
    settings.passive)
  );
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
     * @type {String}
     * Name of the Google Maps instance path
     */
    _mapPolyPath: settings.path,

    /**
     * @private
     */
    _mapPolyDidInsertElement: on('didInsertElement', didInsertGoogleMapInstanceElement),

    /**
     * @private
     */
    _mapPolyDidUpdateAttrs: on('didUpdateAttrs', updateMapInstancePath),

    /**
     * @return {Array<latLngLiteral>}
     * Resolve path in order of priority
     * NOTE top-level properties will overwrite `options.path`
     */
    _mapPolyGetPath() {
      const path = this._mapPolyPath;
      return get(this, path) || get(this, `options.${path}`);
    },

    /*
     * Add path observers to invoke path updates
     */
    _mapPolyAddPathObservers: on('didInsertElement', function() {
      this.addObserver(`${this._mapPolyPath}.[]`, this, this._mapPolyDidUpdateAttrs);
      this.addObserver(`options.${this._mapPolyPath}.[]`, this, this._mapPolyDidUpdateAttrs);
    }),

    /*
     * Remove path observers
     */
    _mapPolyremovePathObservers: on('willDestroyElement', function() {
      this.removeObserver(`${this._mapPolyPath}.[]`, this, this._mapPolyDidUpdateAttrs);
      this.removeObserver(`options.${this._mapPolyPath}.[]`, this, this._mapPolyDidUpdateAttrs);
    })
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
   * Insert google map instance with options
   */
  return this._loadGoogleMaps()
  .then(bind(this, this.insertGoogleMapInstance, options))
  .then(bind(this, this.bindGoogleMapsInstanceEvents));
}

/**
 * @return {undefined}
 * Invoke any updates of Google Map Instance's path defined at
 * Component's `googleMapsInstanceScope`
 */
function updateMapInstancePath() {
  const mapObjInstance = get(this, this.googleMapsInstanceScope);

  /*
   * Do not handle updates until Google Maps instance
   * has been asyncronously set via: `insertGoogleMapInstance`
   */
  if (!mapObjInstance) { return; }

  /*
   * Set center in order of strategy priority
   */
  const path = this._mapPolyPath;
  const update = this._mapPolyGetPath();
  const current = mapObjInstance.get(path);

  if (update && pathDiff(update, current)) {
    mapObjInstance.set(path, update);
  }
}

/**
 * @param  {Array} a
 * @param  {Array} b
 * @return {Boolean}
 * Determine if two path arrays differ
 */
export function pathDiff(a = [], b = []) {
  if (a.length !== b.length) { return true; }

  for (let i = 0; i < a.length; i++) {
    if (a[i].lat !== b[i].lat || a[i].lng !== b[i].lng) {
      return true;
    }
  }

  return false;
}
