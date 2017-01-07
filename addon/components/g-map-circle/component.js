import get from 'ember-metal/get';
import set from 'ember-metal/set';

import GMapChildComponent from '../g-map-child';
import mapPoint from '../../factories/map-point';
import googleMapCircle from './factory';
import isTest from '../../mixins/is-test';
import ENV from '../../configuration';

const GOOGLE_CIRCLE_DEFAULTS = {radius: 100000};

const EVENTS = ENV.googleMapCircle.events;
const BOUND_OPTIONS = ENV.googleMapCircle.boundOptions;
const AUGMENTED_EVENTS = {
  center_changed: 'center',
  radius_changed: 'radius'
};

const googleMapScope = ENV.googleMap.scope;
const googleMapsInstanceScope = ENV.googleMapCircle.scope;

/*
 * Generate an instance of a map point component
 * as the g-map-circle component class
 */
export default GMapChildComponent.extend(isTest, mapPoint({
  bound: BOUND_OPTIONS,
  defaults: GOOGLE_CIRCLE_DEFAULTS,
  events: EVENTS,
  augmentedEvents: AUGMENTED_EVENTS,
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
       * Set circle center to default to map center
       */
      this._mapPointDefaults = get(map, 'center');

      if (!options.center.lat) {
        options.center.lat = this._mapPointDefaults.lat;
      }

      if (!options.center.lng) {
        options.center.lng = this._mapPointDefaults.lng;
      }

      if (!options.radius) {
        options.radius = GOOGLE_CIRCLE_DEFAULTS.radius;
      }

      const circle = set(this, googleMapsInstanceScope, googleMapCircle(map.content, options));

      /*
       * Some test helpers require access to the circle instance
       */
      if (get(this, '_isTest')) {
        const canvas = map.content.getDiv();
        canvas.__GOOGLE_MAP_CIRCLES__ = canvas.__GOOGLE_MAP_CIRCLES__ || [];
        canvas.__GOOGLE_MAP_CIRCLES__.push(circle.content);
      }
    },

    /*
     * Remove any circle instances from Google Map canvas
     */
    willDestroyElement() {
      this._super(...arguments);

      if (get(this, '_isTest')) {
        const canvas = get(this, googleMapScope).content.getDiv();
        const circle = get(this, googleMapsInstanceScope);

        canvas.__GOOGLE_MAP_CIRCLES__.splice(
          canvas.__GOOGLE_MAP_CIRCLES__.indexOf(circle.content), 1
        );
      }
    }
  }
}));
