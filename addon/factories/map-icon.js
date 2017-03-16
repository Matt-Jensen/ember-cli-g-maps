import {assign} from 'ember-platform';
import {assert} from 'ember-metal/utils';

const prototype = {
  constructor: mapIcon,

  /**
   * Convert the `google.maps.Icon` object specification
   * into its' user facing configuration object
   * @return {Object}
   */
  toJSON() {
    const result = Object.create(null);

    Object.keys(this).forEach((property) => {
      const value = this[property];

      if (value instanceof google.maps.Point) {
        result[property] = assign({}, value);
      } else if (value instanceof google.maps.Size) {
        const sizeLiteral = Object.create(null);

        sizeLiteral.width = value.width;
        sizeLiteral.height = value.height;

        if (value._hasConfigWidthUnit) {
          sizeLiteral.widthUnit = value.j; // j === width unit
        }

        if (value._hasConfigHeightUnit) {
          sizeLiteral.heightUnit = value.f; // f === height unit
        }

        result[property] = sizeLiteral;
     } else if (typeof value !== 'function'){
        result[property] = value;
      }
    });

    return result;
  }
};

/**
 * Factory to generate objects matching `google.maps.Icon`
 * object specification with utility methods for converting
 * factory instance constants' values back into its' original
 * user facing configuration
 *
 * https://developers.google.com/maps/documentation/javascript/3.exp/reference#Icon
 *
 * @param  {Object} config
 * @return {Object}
 */
export default function mapIcon(config) {
  const instance = assign({}, config);

  assert('mapIcon requires a `url` String', typeof config.url === 'string');

  /*
   * Convert any point literals in config to
   * `google.maps.Point` instances
   */
  ['anchor', 'labelOrigin', 'origin'].forEach((property) => {
    const literal = instance[property];

    if (literal) {
      assert(
        `mapIcon requires valid Point literal at "${property}"`,
        typeof literal.x === 'number' && typeof literal.y === 'number'
      );
      instance[property] = new google.maps.Point(literal.x, literal.y);
    }
  });

  /*
   * Convert any size literals in config to
   * `google.maps.Size` instances
   */
  ['scaledSize', 'size'].forEach((property) => {
    const literal = instance[property];

    if (literal) {
      assert(
        `mapIcon requires valid Size literal at "${property}"`,
        typeof literal.width === 'number' && typeof literal.height === 'number'
      );
      instance[property] = new google.maps.Size(literal.width, literal.height, literal.widthUnit, literal.heightUnit);
      instance[property]._hasConfigWidthUnit = Boolean(literal.widthUnit);
      instance[property]._hasConfigHeightUnit = Boolean(literal.heightUnit);
    }
  });

  return assign(Object.create(prototype), instance);
}
