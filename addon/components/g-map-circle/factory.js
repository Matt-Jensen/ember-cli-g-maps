import Ember from 'ember';
import {assert} from 'ember-metal/utils';
import {assign} from 'ember-platform';
import computed from 'ember-computed';

import configuration from '../../configuration';
import cps from '../../utils/google-maps-properties';

const DEFAULTS = Ember.getProperties(
  configuration.propertyDefaults,
  'clickable',
  'draggable',
  'editable',
  'fillColor',
  'fillOpacity',
  'strokeColor',
  'strokeOpacity',
  'strokePosition',
  'strokeWeight'
);

export const GoogleMapCircleProxy = Ember.ObjectProxy.extend({
  /**
   * @type {Object}
   * Default property values
   */
  defaults: DEFAULTS,

  /**
   * @type {String}
   * Defines namespace used for assertions
   */
  name: 'g-map-circle',

  /**
   * @required
   * @type {Object}
   * Circle center
   */
  center: cps.center,

  /**
  * @type {Boolean}
  * Indicates whether this Circle handles mouse events.
  */
  clickable: cps.clickable,

  /**
   * @type {Boolean}
   * If set to true, the user can drag this circle over the map.
   */
  draggable: cps.draggable,

  /**
   * @type {Boolean}
   * If set to true, the user can edit this circle by dragging the
   * control points shown at the center and around the circumference
   * of the circle.
   */
  editable: cps.editable,

  /**
   * @type {String|Undefined}
   * The fill color. All CSS3 colors are supported except for extended
   * named colors.
   */
  fillColor: cps.fillColor,

  /**
   * @type {Number}
   * The fill opacity between 0.0 and 1.0
   */
  fillOpacity: cps.fillOpacity,

  /**
   * @required
   * @type {Number}
   * The radius in meters on the Earth's surface
   */
  radius: computed({
    get() {
      return this.content.getRadius();
    },

    set(key, value) {
      if (!value) { value = 0; } // remove

      assert(`${this.name} "radius" is a Number`, typeof value === 'number' && value === value);

      this.content.setRadius(value);
      return value;
    }
  }).volatile(),

  /**
   * @type {String|Undefined}
   * The stroke color. All CSS3 colors are supported except for extended
   * named colors.
   */
  strokeColor: cps.strokeColor,

  /**
   * @type {Number}
   * The stroke opacity between 0.0 and 1.0
   */
  strokeOpacity: cps.strokeOpacity,

  /**
   * @type {String}
   * The stroke position.
   */
  strokePosition: cps.strokePosition,

  /**
   * @type {Number|Undefined}
   * The stroke width in pixels.
   */
  strokeWeight: cps.strokeWeight,

  /**
   * @type {Boolean}
   * Whether this circle is visible on the map.
   */
  visible: cps.visible,

  /**
  * @type {Number|Undefined}
  * The zIndex compared to other polys.
  */
  zIndex: cps.zIndex
});

/**
 * @param  {Map}    canvas   Google Maps' Map
 * @param  {Object} options  Circle instance defaults (requires center, radius)
 * @return {ObjectProxy}  Ember.ObjectProxy instance
 * Render a new Google Map Circle on a canvas with the given options
 * and return its' Google Map Center Proxy instance
 */
export default function googleMapCircle(map, options = {}) {
  assert('Google Map Circle requires a Google Map instance', map instanceof google.maps.Map);
  assert('Google Map Circle requires a center', options.center);
  assert('Google Map Circle requires a radius', options.radius);

  const proxy = GoogleMapCircleProxy.create({
    content: new google.maps.Circle({map})
  });

  const settings = assign({}, DEFAULTS);
  assign(settings, options);

  // Set defaults via proxy API
  Object.keys(settings).forEach((key) =>
    proxy.set(key, settings[key]));

  return proxy;
}
