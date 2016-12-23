import computed from 'ember-computed';
import {assert} from 'ember-metal/utils';
import {getProperties} from 'ember-metal/get';

const {isArray} = Array;

/**
 * @param  {Array}  bound     Array of strings denoting bound properties
 * @param  {Array}  passive   Array of strings denoting static properties
 * @return {Object} options   Google Map instance options CP's
 *
 * Create the necessary configuration computed properties for all
 * Google maps' components including: maps, markers, ploygons ect.
 */
export default function mapOptions(bound, passive) {
  assert('bound options are required', isArray(bound));

  const options = Object.create(null);

  /**
   * @type {Object}
   * Return all defined bound options for the Google map instance
   * NOTE this is designed to be overwritten, by user, if desired
   */
  options.options = computed(...bound, function getMapOptions() {
    return removeUndefinedProperties(
      getProperties(this, ...bound)
    );
  });

  if (isArray(passive)) {
    /**
     * @type {Object}
     * Return all *top-level* static options for the Google map instance
     */
    options.passives = computed(function getMapPssives() {
      return removeUndefinedProperties(
        getProperties(this, ...passive)
      );
    });
  }

  return options;
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
