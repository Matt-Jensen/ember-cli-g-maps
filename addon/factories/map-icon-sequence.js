import {assign} from 'ember-platform';
import {assert} from 'ember-metal/utils';

import mapSymbol from './map-symbol';

/**
 * Factory to generate objects matching `google.maps.IconSequence`
 * object specification with utility methods for converting
 * factory instance constants' values back into its' original
 * user facing configuration
 *
 * https://developers.google.com/maps/documentation/javascript/3.exp/reference#IconSequence
 *
 * @param  {Object} config
 * @return {Object}
 */
export default function mapIconSequence(config = {}) {
  const defaults = {
    fixedRotation: false,
    offset: '100%',
    repeat: '0'
  };

  const instance = assign(defaults, config);

  assert('mapIconSequence configuration icon is an object', typeof instance.icon === 'object');
  assert('mapIconSequence configuration fixedRotation is a boolean', typeof instance.fixedRotation === 'boolean');
  assert('mapIconSequence configuration offset is a string', typeof instance.offset === 'string');
  assert('mapIconSequence configuration repeat is a string', typeof instance.repeat === 'string');

  instance.icon = mapSymbol(instance.icon);

  return assign(Object.create(mapIconSequence.prototype), instance);
}

mapIconSequence.prototype = {
  constructor: mapIconSequence,

  /**
   * Convert the `google.maps.IconSequence` object
   * specification into its' user facing configuration object
   * @return {Object}
   */
  toJSON() {
    const result = Object.create(null);

    Object.keys(this).forEach((key) => {
      if (this[key].toJSON) {
        result[key] = this[key].toJSON();
      } else {
        result[key] = this[key];
      }
    });

    return result;
  }
};
