import Ember from 'ember';
import {assert} from 'ember-metal/utils';
import {assign} from 'ember-platform';
import computed from 'ember-computed';

import configuration from '../../configuration';
import cps from '../../utils/google-maps-properties';

const {isArray} = Array;

const DEFAULTS = Ember.getProperties(
  configuration.propertyDefaults,
  'clickable',
  'draggable',
  'editable',
  'fillColor',
  'fillOpacity',
  'geodesic',
  'strokeColor',
  'strokeOpacity',
  'strokePosition',
  'strokeWeight',
  'visible', // TODO strokeWeight = 3??
  'zIndex'
);

export const GoogleMapPolygonProxy = Ember.ObjectProxy.extend({
  /**
   * @type {Object}
   * Default property values
   */
  defaults: DEFAULTS,

  /**
   * @type {String}
   * Defines namespace used for assertions
   */
  name: 'g-map-polygon',

  /**
   * @type {Boolean}
   * Indicates whether this Polygon handles mouse events.
   */
  clickable: cps.clickable,

   /**
    * @type {Boolean}
    * If set to true, the user can drag this shape over the map.
    * The geodesic property defines the mode of dragging.
    */
   draggable: cps.draggable,

  /**
   * @type {Boolean}
   * If set to true, the user can edit this shape by dragging the
   * control points shown at the vertices and on each segment.
   */
  editable: cps.editable,

  /**
   * @type {String}
   * The fill color. All CSS3 colors are supported except for extended named colors.
   */
  fillColor: cps.fillColor,

   /**
    * @type {Number}
    * The fill opacity between 0.0 and 1.0
    */
    fillOpacity: cps.fillOpacity,

   /**
    * @required
    * @type {Array<LatLngLiteral>}
    * The ordered sequence of coordinates that designates a closed loop.
    * Unlike polylines, a polygon may consist of one or more paths.
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
         * NOTE: Avoid `setPath(s)` Polygon methods, as that will replace the paths'
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
    * @type {Boolean}
    * When true, edges of the polygon are interpreted as geodesic and will follow
    * the curvature of the Earth. When false, edges of the polygon are rendered as
    * straight lines in screen space. Note that the shape of a geodesic polygon may
    * appear to change when dragged, as the dimensions are maintained relative to
    * the surface of the earth.
    */
    geodesic: cps.geodesic,

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
 * @param  {Map}     canvas   Google Maps' Map
 * @param  {Object}  options
 * @return {ObjectProxy}  Ember.ObjectProxy instance
 * Render a new Google Map Polygon on a canvas with the given options
 * and return its' Google Map Polygon Proxy instance
 */
export default function googleMapPolygon(map, options = {}) {
  assert('Google Map Polygon requires a Google Map instance', map instanceof google.maps.Map);
  assert('Google Map Polygon requires a path', options.path);

  const proxy = GoogleMapPolygonProxy.create({
    content: new google.maps.Polygon({map})
  });

  const settings = assign({}, DEFAULTS);
  assign(settings, options);

  // Set options via proxy API
  proxy.setProperties(settings);

  return proxy;
}

/**
 * @param  {Object} {lat, lng} latLng literal
 * @return {Boolean}
 * Determine if an object is a latLng literal
 */
function isLatLng({lat, lng}) {
  return (
    typeof lat === 'number' && lat === lat &&
    typeof lng === 'number' && lng === lng
  );
}
