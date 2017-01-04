import get from 'ember-metal/get';
import set from 'ember-metal/set';
import {assert} from 'ember-metal/utils';

import GMapChildComponent from '../g-map-child';
import mapPoint from '../../factories/map-point';
import googleMapMarker from './factory';
import isTest from '../../mixins/is-test';
import ENV from '../../configuration';

const MARKER_EVENTS = ENV.googleMapMarker.events;
const MARKER_BOUND_OPTIONS = ENV.googleMapMarker.boundOptions;
const AUGMENTED_MARKER_EVENTS = {
  animation_changed: 'animation',
  clickable_changed: 'clickable',
  cursor_changed: 'cursor',
  draggable_changed: 'draggable',
  icon_changed: 'icon',
  position_changed: 'position',
  shape_changed: 'shape',
  title_changed: 'title',
  visible_changed: 'visible',
  zindex_changed: 'zIndex'
};

const googleMapScope = ENV.googleMap.scope;
const googleMapsInstanceScope = ENV.googleMapMarker.scope;

/*
 * Generate an instance of a map point component
 * as the g-map-marker component class
 */
export default GMapChildComponent.extend(isTest, mapPoint({
  bound: MARKER_BOUND_OPTIONS,
  defaults: {},
  events: MARKER_EVENTS,
  augmentedEvents: AUGMENTED_MARKER_EVENTS,
  center: 'position',
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
     * @param {google.maps.Map}  Google Map | Street View Panorama instance
     * @param {Object} options
     * Method invoked after Google Maps libraries have loaded
     * and the the Google Map canvas has instantiated
     */
    insertedGoogleMapCanvas(map, options) {
      this._super(...arguments);

      assert(
        'g-map-marker requires a Google Map or Street View Panorama instance',
        map && (map.content instanceof google.maps.Map || map.content instanceof google.maps.StreetViewPanorama)
      );

      /*
       * Set marker position default to map center
       */
      this._mapPointDefaults = get(map, 'center');

      if (!options.position.lat) {
        options.position.lat = this._mapPointDefaults.lat;
      }

      if (!options.position.lng) {
        options.position.lng = this._mapPointDefaults.lng;
      }

      const marker = set(this, googleMapsInstanceScope, googleMapMarker(map.content, options));

      /*
       * Some test helpers require access to the marker instance
       */
      if (get(this, '_isTest')) {
        const canvas = map.content.getDiv();
        canvas.__GOOGLE_MAP_MARKERS__ = canvas.__GOOGLE_MAP_MARKERS__ || [];
        canvas.__GOOGLE_MAP_MARKERS__.push(marker.content);
      }
    },

    /*
     * Remove any marker instances from Google Map canvas
     */
    willDestroyElement() {
      this._super(...arguments);

      if (get(this, '_isTest')) {
        const canvas = get(this, googleMapScope).content.getDiv();
        const marker = get(this, googleMapsInstanceScope);

        canvas.__GOOGLE_MAP_MARKERS__.splice(
          canvas.__GOOGLE_MAP_MARKERS__.indexOf(marker.content), 1
        );
      }
    }
  }
}));
