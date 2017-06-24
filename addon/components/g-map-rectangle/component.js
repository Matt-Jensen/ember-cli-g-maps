import get from 'ember-metal/get';
import set from 'ember-metal/set';

import GMapChildComponent from '../g-map-child';
import mapPoly from '../../factories/map-poly';
import googleMapRectangle from './factory';
import isTest from '../../mixins/is-test';
import ENV from '../../configuration';

const EVENTS = ENV.googleMapRectangle.events;
const BOUND_OPTIONS = ENV.googleMapRectangle.boundOptions;
const AUGMENTED_EVENTS = {bounds_changed: 'bounds'};

const googleMapScope = ENV.googleMap.scope;
const googleMapsInstanceScope = ENV.googleMapRectangle.scope;

/**
 * Generate an instance of map poly
 * as the g-map-rectangle component configuration
 *
 * @class GMapRectangle
 * @extends GMapChildComponent
 */
export default GMapChildComponent.extend(isTest, mapPoly({
  bound: BOUND_OPTIONS,
  events: EVENTS,
  augmentedEvents: AUGMENTED_EVENTS,
  path: 'bounds',
  googleMapsInstanceScope,
  component: {
    /**
     * @type {Ember.ObjectProxy}
     * Proxy wrapper for the Google Map Marker instance
     */
    [googleMapsInstanceScope]: null,

    /**
     * Required for g-map-child Component
     */
    insertGoogleMapInstance() {
      return this._super(...arguments);
    },

    /**
     * @param {google.maps.Map}  Google Map
     * @param {Object} options
     * Method invoked after Google Maps libraries have loaded
     * and the the Google Map canvas has instantiated
     */
    insertedGoogleMapCanvas(map, options) {
      this._super(...arguments);

      /*
       * Set undefined bounds to a square in map center
       */
      if (!options.bounds) {
        options.bounds = makeSquareBounds(get(map, 'center'));
      }

      const rectangle = set(this, googleMapsInstanceScope, googleMapRectangle(map.content, options));

      /*
       * Some test helpers require access to the rectangle instance
       */
      if (get(this, '_isTest')) {
        const canvas = map.content.getDiv();
        canvas.__GOOGLE_MAP_RECTANGLES__ = canvas.__GOOGLE_MAP_RECTANGLES__ || [];
        canvas.__GOOGLE_MAP_RECTANGLES__.push(rectangle.content);
      }
    },

    /*
     * Remove any rectangle instances from Google Map canvas
     */
    willDestroyElement() {
      this._super(...arguments);

      if (get(this, '_isTest')) {
        const canvas = get(this, googleMapScope).content.getDiv();
        const rectangle = get(this, googleMapsInstanceScope);

        canvas.__GOOGLE_MAP_RECTANGLES__.splice(
          canvas.__GOOGLE_MAP_RECTANGLES__.indexOf(rectangle.content), 1
        );
      }
    }
  }
}));

/**
 * @param  {Object} latLng  center point
 * @param  {Number} offset  bounds offset
 * @return {Array}          bounds
 * Draw a square around a given lat, lng coordinate
 */
export function makeSquareBounds({lat, lng}/*, offset = 0.5*/) {
  return [
    {lat: (lat + 0.5), lng: (lng + 0.5)},
    {lat: (lat - 0.5), lng: (lng - 0.5)}
  ];
}
