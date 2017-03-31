import {assign} from 'ember-platform';
import {assert} from 'ember-metal/utils';

import mapSymbol from './map-symbol';

const DEFAULTS = {
  fixedRotation: false,
  offset: '100%',
  repeat: '0'
};

/**
 * Factory to generate objects matching `google.maps.IconSequence`
 * object specification with utility methods for converting
 * factory instance constants' values back into its' original
 * user facing configuration
 *
 * https://developers.google.com/maps/documentation/javascript/3.exp/reference#IconSequence
 *
 * @param  {Array} config
 * @return {Object}
 */
export default function mapIconSequence(config = []) {
  assert('Map Icon Sequence configuraton is an array', Array.isArray(config));

  return config.map(icon => {
    const instance = assign(DEFAULTS, icon);

    assert('Map Icon Sequence item `icon` is an object', typeof instance.icon === 'object');
    assert('Map Icon Sequence item `fixedRotation` is a boolean', typeof instance.fixedRotation === 'boolean');
    assert('Map Icon Sequence item `offset` is a string', typeof instance.offset === 'string');
    assert('Map Icon Sequence item `repeat` is a string', typeof instance.repeat === 'string');

    instance.icon = mapSymbol(instance.icon);
    return assign(Object.create(mapIconSequence.prototype), instance);
  });
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
