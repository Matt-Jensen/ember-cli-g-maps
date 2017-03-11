import Ember from 'ember';
import {assert} from 'ember-metal/utils';
import computed from 'ember-computed';
import {getProperties} from 'ember-metal/get';

import configuration from './configuration';
import cps from './utils/google-maps-properties';

const {isArray} = Array;

const DEFAULTS = getProperties(
  configuration.propertyDefaults,
  'clickable',
  'draggable',
  'editable',
  'geodesic',
  'strokeColor',
  'strokeOpacity',
  'strokeWeight',
  'visible',
  'zIndex'
);

/**
 * Wrap the options of all poly map instances into
 * Ember's Object model
 *
 * @class GoogleMapPolyProxy
 * @extends ObjectProxy
 * @private
 */
export default Ember.ObjectProxy.extend({
  /**
   * Default property values
   * @type {Object}
   */
  defaults: DEFAULTS,

  /**
   * Defines namespace used for assertions
   * @type {String}
   */
  name: 'google-map-poly-proxy',

  /**
   * Indicates whether this instance handles mouse events.
   * @type {Boolean}
   */
  clickable: cps.clickable,

  /**
   * If set to true, the user can drag this shape over the map.
   * The geodesic property defines the mode of dragging.
   * @type {Boolean}
   */
  draggable: cps.draggable,

  /**
   * If set to true, the user can edit this shape by dragging the
   * control points shown at the vertices and on each segment.
   * @type {Boolean}
   */
  editable: cps.editable,

  /**
   * When true, edges of the instance are interpreted as geodesic and will follow
   * the curvature of the Earth. When false, edges of the path are rendered as
   * straight lines in screen space. Note that the shape of a geodesic path may
   * appear to change when dragged, as the dimensions are maintained relative to
   * the surface of the earth.
   * @type {Boolean}
  */
  geodesic: cps.geodesic,

  /**
   * The ordered sequence of coordinates.
   * @required
   * @type {Array<LatLngLiteral>}
   */
  path: computed({
    get() {
      return (this.content.getPath().getArray())
      .map((ll) => ({
        lat: ll.lat(),
        lng: ll.lng()
      }));
    },

    set(key, value) {
      assert(`${this.name} "path" is an Array`, isArray(value));
      assert(`${this.name} "path" contains only valid LatLng literals`, value.filter(isLatLng).length === value.length);

     /*
      * NOTE: Avoid `setPath(s)` methods, as that will replace the paths'
      * google.maps.MVCArray instance and it's associated event listeners
      */
      const pathMVC = this.content.getPath();

     /*
      * Update pathMVC's existing LatLng
      * instances to match the source path
      */
      value.forEach((val, i) => {
        const coord = pathMVC.getAt(i);

        if (!coord || coord.lat() !== val.lat || coord.lng() !== val.lng) {
          pathMVC.setAt(i, new google.maps.LatLng(val.lat, val.lng));
        }
      });

     /*
      * Remove any extra LatLng instances from pathMVC
      */
      while (pathMVC.getLength() > value.length) { pathMVC.pop(); }

      return value;
    }
  }).volatile(),

  /**
   * The stroke color. All CSS3 colors are supported except for extended
   * named colors.
   * @type {String|Undefined}
   */
  strokeColor: cps.strokeColor,

  /**
   * The stroke opacity between 0.0 and 1.0
   * @type {Number}
   */
  strokeOpacity: cps.strokeOpacity,

  /**
   * The stroke width in pixels.
   * @type {Number|Undefined}
   */
  strokeWeight: cps.strokeWeight,

  /**
   * Whether this circle is visible on the map.
   * @type {Boolean}
   */
  visible: cps.visible,

  /**
   * The zIndex compared to other polys.
   * @type {Number|Undefined}
  */
  zIndex: cps.zIndex
});

/**
 * Determine if an object is a latLng literal
 * @param  {Object} {lat, lng} latLng literal
 * @return {Boolean}
 */
function isLatLng({lat, lng}) {
  return (
    typeof lat === 'number' && lat === lat &&
    typeof lng === 'number' && lng === lng
  );
}
