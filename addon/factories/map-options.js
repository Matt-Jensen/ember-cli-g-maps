import computed from 'ember-computed';
import {assert} from 'ember-metal/utils';
import {assign} from 'ember-platform';
import {default as get, getProperties} from 'ember-metal/get';

const {isArray} = Array;

/**
 * @param  {Array}  bound     Array of strings denoting bound properties
 * @param  {Array}  passive   Array of strings denoting static properties
 * @return {Object} options   Google Map instance options CP's
 *
 * Create the necessary configuration computed properties and methods for all
 * Google maps' components including: maps, markers, ploygons ect.
 */
export default function mapOptions(bound, passive = []) {
  assert('bound options are required', isArray(bound));

  return {
    /**
     * @public
     * @type {Array}
     * List of Google Map Instance bound options
     */
    googleMapsInstanceBoundOptions: bound,

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
    mapOptionsGetBound: getBoundOptions
  };
}

/**
 * @return {Object}
 * Return all defined bound options for the Google map instance
 * NOTE this is designed to be overwritten, by user, if desired
 */
function getMapOptions() {
  return removeUndefinedProperties(
    getProperties(this, ...this.googleMapsInstanceBoundOptions)
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
  assign(options, getProperties(this, ...this.googleMapsInstanceBoundOptions));
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
  const options = assign({}, getProperties(this, ...this.googleMapsInstanceBoundOptions));
  assign(options, get(this, 'options'));
  return removeUndefinedProperties(options);
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
