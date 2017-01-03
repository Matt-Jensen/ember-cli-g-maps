import RSVP from 'rsvp';
import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import {assert} from 'ember-metal/utils';
import run from 'ember-runloop';
import Evented from 'ember-evented';

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
const GMapMarker = Component.extend(isTest, Evented, mapPoint({
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
     * @param {Object} options   Current Map options
     * @return {RSVP.Promise}    Wait for Marker's map to instantiate
     * Method invoked when Google Maps libraries have loaded
     * and the `didInsertElement` lifecycle hook has fired
     */
    insertGoogleMapInstance(options) {
      return new RSVP.Promise((resolve) => {
        run.later(() => {
          const map = get(this, googleMapScope);

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

          /*
           * Allow event event binding to occur before `didUpdateAttrs`
           */
          run.later(() => this.trigger('didUpdateAttrs'));
          resolve();
        });
      });
    },

    /*
     * Remove any marker instances from Google Map canvas
     */
    willDestroyElement() {
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

GMapMarker.reopenClass({
  positionalParams: [googleMapScope]
});

export default GMapMarker;
