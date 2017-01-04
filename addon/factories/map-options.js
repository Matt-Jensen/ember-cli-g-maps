import computed from 'ember-computed';
import {assert} from 'ember-metal/utils';
import {assign} from 'ember-platform';
import {default as get, getProperties} from 'ember-metal/get';
import on from 'ember-evented/on';

const {isArray} = Array;

/**
 * @param  {Array}  bound     Array of strings denoting bound properties
 * @param  {Array}  passive   Array of strings denoting static properties
 * @return {Object} options   Google Map instance options CP's
 *
 * Create the necessary configuration computed properties and methods for all
 * Google maps' components including: maps, markers, ploygons ect.
 */
export default function mapOptions(googleMapsInstanceScope, bound, passive = []) {
  assert('Map Options expects `googleMapsInstanceScope` argument is a String', typeof googleMapsInstanceScope === 'string');
  assert('Map Options expects `bound` argument is an Array', isArray(bound));

  return {
    /**
     * @public
     * @type {String}
     * Location of Google Maps instance object
     */
    googleMapsInstanceScope,

    /**
     * @private
     * @type {Array}
     * List of Google Map Instance bound options
     */
    _mapOptionsBoundProperties: bound,

    /**
     * @public
     * @type {Array}
     * List of Google Map Instance static options
     */
    googleMapsInstancePassiveOptions: passive,

    /**
     * @public
     * @type {Object}
     * Return all defined bound options for the Google map instance
     * NOTE this is designed to be overwritten, by user, if desired
     */
    options: computed(...bound, getMapOptions),

    /**
     * @public
     * @type {Object}
     */
    passives: computed(getMapPassives),

    /**
     * @public
     * @type {Function}
     */
    mapOptionsGetAll: getAllOptions,

    /**
     * @public
     * @type {Function}
     */
    mapOptionsGetBound: getBoundOptions,

    /**
     * @private
     */
    _mapOptionsDidUpdateAttrs: on('didUpdateAttrs', updateBoundOptions),
  };
}

/**
 * @return {Object}
 * Return all defined bound options for the Google map instance
 * NOTE this is designed to be overwritten, by user, if desired
 */
function getMapOptions() {
  return removeUndefinedProperties(
    getProperties(this, ...this._mapOptionsBoundProperties)
  );
}

/**
 * @return {Object}
 * Return all *top-level* static options for the Google map instance
 */
function getMapPassives() {
  return removeUndefinedProperties(
    getProperties(this, ...this.googleMapsInstancePassiveOptions)
  );
}

/**
 * @return {Object}
 * Return a hash of all defined, passive & bound, options
 * Set as either top-level properties or within `options` hash
 * NOTE overrides top-level values with anything defined within `options`
 */
function getAllOptions() {
  const options = assign({}, get(this, 'passives'));
  assign(options, getProperties(this, ...this._mapOptionsBoundProperties));
  assign(options, get(this, 'options'));
  return removeUndefinedProperties(options);
}

/**
 * @return {Object}
 * Return a hash of all defined, bound, options
 * Set as either top-level properties or within `options` hash
 * NOTE overrides top-level values with anything defined within `options`
 */
function getBoundOptions() {
  const options = assign({}, getProperties(this, ...this._mapOptionsBoundProperties));
  assign(options, get(this, 'options'));
  return removeUndefinedProperties(options);
}

/**
 * @return {undefined}
 * Invoke any updates of Google Map Instance defined at
 * Component's `googleMapsInstanceScope` if change detected
 */
function updateBoundOptions() {
  const mapObjInstance = get(this, this.googleMapsInstanceScope);

  /*
   * Do not handle updates until Google Maps instance
   * has been asyncronously set via: `insertGoogleMapInstance`
   */
  if (!mapObjInstance) { return; }

  const options = this.mapOptionsGetBound();

  /*
   * Check for changes to bound options and apply to instance
   */
  this._mapOptionsBoundProperties
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
 * @param  {Object} obj
 * @return {Object} result
 * Create a new object instance without undefined properties
 */
function removeUndefinedProperties(obj) {
  const result = Object.create(null);

  Object.keys(obj)
  .forEach((property) => {
    if (obj[property] !== undefined) {
      result[property] = obj[property];
    }
  });

  return result;
}

function isDiff(a, b) {
  if (typeof a === 'object') {
    a = JSON.stringify(a).toLowerCase();
  }

  if (typeof b === 'object') {
    b = JSON.stringify(b).toLowerCase();
  }

  return a !== b;
}
