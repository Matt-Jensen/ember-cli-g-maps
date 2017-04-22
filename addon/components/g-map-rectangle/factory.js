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
  'strokeColor',
  'strokeOpacity',
  'strokePosition',
  'strokeWeight',
  'visible'
);

/**
 * Extend the default Google Map Poly Proxy with Rectangle options
 *
 * @class GoogleMapRectangleProxy
 * @extends ObjectProxy
 * @private
 */
export const GoogleMapRectangleProxy = Ember.ObjectProxy.extend({
  /**
   * Default property values
   * @type {Object}
   */
  defaults: DEFAULTS,

  /**
   * Defines namespace used for assertions
   * @type {String}
   */
  name: 'g-map-rectangle',

  /**
   * Maintain the source of the bounds configuration as reference
   * @type {Array|Object}
   */
  _boundsArgument: null,

  /**
   * bounds of rectangle
   *
   * Accepts:
   * - Array<ArrayLatLngLiterals>
   * - Array<LatLngLiterals>
   * - LatLngBoundsLiteral
   *
   * @required
   * @type {LatLngBoundsLiteral}
   */
  bounds: computed({
    get() {
      const bounds = this.content.getBounds().toJSON();

      /*
       * Copy (non-latLng bounds literal) configured data structure with current bounds
       */
      if (isArray(this._boundsArgument)) {
        return this._boundsArgument.map((coord, i) => {
          if (i === 0) {
            return isArray(coord) ? [bounds.north, bounds.east] : {lat: bounds.north, lng: bounds.east};
          } else {
            return isArray(coord) ? [bounds.south, bounds.west] : {lat: bounds.south, lng: bounds.west};
          }
        });
      }

      return bounds;
    },

    set(key, value) {
      let latLngBounds = {};

      assert(`${this.name} "bounds" is an Array or an Object`, typeof value === 'object');

      if (isArray(value)) {
        assert(`${this.name} "bounds" array has 2 coordinates`, value.length === 2);

        /*
         * Configure latLng bounds literal
         */
        latLngBounds.north = (value[0].lat || value[0][0]);
        latLngBounds.east = (value[0].lng || value[0][1]);
        latLngBounds.south = (value[1].lat || value[1][0]);
        latLngBounds.west = (value[1].lng || value[1][1]);
      } else {
        assert(`${this.name} "bounds" object a LatLngBoundsLiteral`, isLatLngBoundsLiteral(value));

        /*
         * Accept input as latLng bounds literal
         */
        latLngBounds = value;
      }

      /*
       * Convert and test all coordinates as numeric input
       */
      Object.keys(latLngBounds).forEach((k) => {
        latLngBounds[k] = parseFloat(latLngBounds[k]);
        assert(`${this.name} "bounds" ${k} coordinate is a valid number`, latLngBounds[k] === latLngBounds[k]);
      });

      this.content.setBounds(latLngBounds);

      return this._boundsArgument = value;
    }
  }).volatile(),

  /**
   * Indicates whether this Rectangle handles mouse events
   * @type {Boolean}
   */
  clickable: cps.clickable,

  /**
   * Indicates if the user can drag this rectangle over the map
   * @type {Boolean}
   */
  draggable: cps.draggable,

  /**
   * Indicates if the user can edit this rectangle by dragging the control points
   * @type {Boolean}
   */
  editable: cps.editable,

  /**
   * Fill color of rectangle
   * @type {String}
   */
  fillColor: cps.fillColor,

  /**
   * Fill color opacity of rectangle
   * @type {Number}
   */
  fillOpacity: cps.fillOpacity,

  /**
   * Color of rectangle's stroke
   * @type {String}
   */
  strokeColor: cps.strokeColor,

  /**
   * Stroke color opacity of rectangle
   * @type {Number}
   */
  strokeOpacity: cps.strokeOpacity,

  /**
   * The stroke position
   * @type {String}
   */
  strokePosition: cps.strokePosition,

  /**
   * Width of the rectangle's stroke
   * @type {Number}
   */
  strokeWeight: cps.strokeWeight,

  /**
   * Whether this rectangle is visible on the map
   * @type {Boolean}
   */
   visible: cps.visible,

   /**
    * The zIndex compared to other polys
    * @type {Number}
    */
   zIndex: cps.zIndex
});

/**
 * Render a new Google Map Rectangle on a canvas with the given options
 * and return its' Google Map Rectangle Proxy instance
 *
 * @param  {Map}     canvas   Google Maps' Map
 * @param  {Object}  options
 * @return {ObjectProxy}  Ember.ObjectProxy instance
 */
export default function googleMapRectangle(map, options = {}) {
  assert('Google Map Rectangle requires a Google Map instance', map instanceof google.maps.Map);
  assert('Google Map Rectangle requires bounds', options.bounds);

  const proxy = GoogleMapRectangleProxy.create({
    content: new google.maps.Rectangle({map})
  });

  const settings = assign({}, DEFAULTS);
  assign(settings, options);

  // Set options via proxy API
  proxy.setProperties(settings);

  return proxy;
}

/**
 * Determine if an object is a LatLngBoundsLiteral
 * https://developers.google.com/maps/documentation/javascript/3.exp/reference#LatLngBoundsLiteral
 * @param  {Object}  obj
 * @return {Boolean}
 */
function isLatLngBoundsLiteral(obj) {
  const required = ['east', 'north', 'west', 'south'];
  const keys = Object.keys(obj).filter((k) => required.indexOf(k) > -1);
  return keys.length === 4;
}
