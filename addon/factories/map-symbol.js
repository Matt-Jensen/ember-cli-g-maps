import {assign} from 'ember-platform';
import {assert} from 'ember-metal/utils';
import {isPresent} from 'ember-utils';

import {getSymbolPath, getSymbolPathId} from '../utils/map-constant-helpers';

const prototype = {
  constructor: mapSymbol,

  /**
   * Convert the `google.maps.Symbol` object specification
   * into its' user facing configuration object
   * @return {Object}
   */
  toJSON() {
    const result = Object.create(null);

    Object.keys(this)
    .forEach((property) => {
      const value = this[property];

      if (value instanceof google.maps.Point) {
        result[property] = assign({}, value);
      } else if (property === 'path') {

        /*
         * Return SymbolPath name or SVG notation as path
         */
        result[property] = (typeof value === 'number' ? getSymbolPath(value) : value);
      } else if (typeof value !== 'function'){
        result[property] = value;
      }
    });

    return result;
  }
};

/**
 * Factory to generate objects matching `google.maps.Symbol`
 * object specification with utility methods for converting
 * factory instance constants' values back into its' original
 * user facing configuration
 *
 * https://developers.google.com/maps/documentation/javascript/3.exp/reference#Symbol
 *
 * @param  {Object} config
 * @return {Object} instance
 */
export default function mapSymbol(config) {
  const instance = assign({}, config);

  assert('mapSymbol `config.path` must be a String', typeof config.path === 'string');

  /*
   * Use any existing google maps Symbol path constant or SVG path notation
   */
  const symbolConst = getSymbolPathId(instance.path);
  instance.path = (isPresent(symbolConst) ? symbolConst : instance.path);

  /*
   * Convert any point literals in config to
   * `google.maps.Point` instances
   */
  ['anchor', 'labelOrigin'].forEach((property) => {
    const literal = instance[property];

    if (literal) {
      assert(
        `mapSymbol requires valid Point literal at "${property}"`,
        typeof literal.x === 'number' && typeof literal.y === 'number'
      );

      instance[property] = new google.maps.Point(literal.x, literal.y);
    }
  });

  return assign(Object.create(prototype), instance);
}
