import Ember from 'ember';
import {assert} from 'ember-metal/utils';
import {assign} from 'ember-platform';

import configuration from '../../configuration';
import cps from '../../utils/google-maps-properties';
import GoogleMapPolyProxy from '../../google-map-poly-proxy';

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
  'visible',
  'zIndex'
);

/**
 * Extend the default Google Map Poly Proxy with Polygon options
 *
 * @class GoogleMapPolygonProxy
 * @extends GoogleMapPolyProxy
 * @private
 */
export const GoogleMapPolygonProxy = GoogleMapPolyProxy.extend({
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
   * @type {String}
   * The stroke position.
   */
  strokePosition: cps.strokePosition
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
