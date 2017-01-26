import get from 'ember-metal/get';
import set from 'ember-metal/set';

import GMapChildComponent from '../g-map-child';
import mapPoly from '../../factories/map-poly';
import googleMapPolygon from './factory';
import isTest from '../../mixins/is-test';
import ENV from '../../configuration';

const EVENTS = ENV.googleMapPolygon.events;
const BOUND_OPTIONS = ENV.googleMapPolygon.boundOptions;
const AUGMENTED_EVENTS = {
  drag: 'path',
  insert_at: 'path',
  set_at: 'path'
};

const googleMapScope = ENV.googleMap.scope;
const googleMapsInstanceScope = ENV.googleMapPolygon.scope;

/*
 * Generate an instance of a map point component
 * as the g-map-polygon component class
 */
export default GMapChildComponent.extend(isTest, mapPoly({
  bound: BOUND_OPTIONS,
  events: EVENTS,
  augmentedEvents: AUGMENTED_EVENTS,
  path: 'path',
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
       * Set path to a triangle in map center
       */
      if (!options.path) {
        options.path = makeTrianglePath(get(map, 'center'));
      }

      const polygon = set(this, googleMapsInstanceScope, googleMapPolygon(map.content, options));

      /*
       * Some test helpers require access to the polygon instance
       */
      if (get(this, '_isTest')) {
        const canvas = map.content.getDiv();
        canvas.__GOOGLE_MAP_POLYGONS__ = canvas.__GOOGLE_MAP_POLYGONS__ || [];
        canvas.__GOOGLE_MAP_POLYGONS__.push(polygon.content);
      }
    },

    /*
     * Remove any polygon instances from Google Map canvas
     */
    willDestroyElement() {
      this._super(...arguments);

      if (get(this, '_isTest')) {
        const canvas = get(this, googleMapScope).content.getDiv();
        const polygon = get(this, googleMapsInstanceScope);

        canvas.__GOOGLE_MAP_POLYGONS__.splice(
          canvas.__GOOGLE_MAP_POLYGONS__.indexOf(polygon.content), 1
        );
      }
    }
  }
}));

/**
 * @param  {Object} latLng  Starting point
 * @param  {Number} offset  Path offset
 * @return {Array}          Polygon path
 * Draw a triangle around a given lat, lng coordinate
 */
export function makeTrianglePath({lat, lng}, offset = 0.5) {
  return [
    {lat: (lat + offset), lng},
    {lat: (lat - offset), lng: (lng - offset)},
    {lat: (lat - offset), lng: (lng + offset)}
  ];
}
