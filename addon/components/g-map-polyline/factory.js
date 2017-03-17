import Ember from 'ember';
import {assert} from 'ember-metal/utils';
import {assign} from 'ember-platform';
import computed from 'ember-computed';

import configuration from '../../configuration';
import cps from '../../utils/google-maps-properties';
import GoogleMapPolyProxy from '../../google-map-poly-proxy';
import mapIconSequence from '../../factories/map-icon-sequence';

const DEFAULTS = Ember.getProperties(
  configuration.propertyDefaults,
  'clickable',
  'draggable',
  'editable',
  'geodesic',
  'strokeColor',
  'strokeOpacity',
  'strokeWeight',
  'visible'
);

/**
 * Extend the default Google Map Poly Proxy with Polyline options
 *
 * @class GoogleMapPolylineProxy
 * @extends GoogleMapPolyProxy
 * @private
 */
export const GoogleMapPolylineProxy = GoogleMapPolyProxy.extend({
  /**
   * Default property values
   * @type {Object}
   */
  defaults: DEFAULTS,

  /**
   * Defines namespace used for assertions
   * @type {String}
   */
  name: 'g-map-polyline',

  /**
   * The icons to be rendered along the polyline
   * @type {Array}
   */
  icons: computed({
    get() {
      const {icons} = this.content;

      if (icons) {
        return icons.toJSON();
      }
    },

    set(key, value) {
      this.content.setOptions({
        icons: mapIconSequence(value)
      });

      return this.content.icons;
    }
  }).volatile(),

  /**
   * The stroke position
   * @type {String}
   */
  strokePosition: cps.strokePosition
});

/**
 * Render a new Google Map Polyline on a canvas with the given options
 * and return its' Google Map Polyline Proxy instance
 *
 * @param  {Map}     canvas   Google Maps' Map
 * @param  {Object}  options
 * @return {ObjectProxy}  Ember.ObjectProxy instance
 */
export default function googleMapPolyline(map, options = {}) {
  assert('Google Map Polyline requires a Google Map instance', map instanceof google.maps.Map);
  assert('Google Map Polyline requires a path', options.path);

  const proxy = GoogleMapPolylineProxy.create({
    content: new google.maps.Polyline({map})
  });

  const settings = assign({}, DEFAULTS);
  assign(settings, options);

  // Set options via proxy API
  proxy.setProperties(settings);

  return proxy;
}
