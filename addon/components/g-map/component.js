import $ from 'jquery';
import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import {assign} from 'ember-platform';
import run from 'ember-runloop';

import googleMap from './factory';
import mapPoint from '../../factories/map-point';
import layout from '../../templates/components/g-map';
import isTest from '../../mixins/is-test';
import ENV from '../../configuration';

const GOOGLE_MAP_DEFAULTS = {
  lat: 30.2672,
  lng: -97.7431,
  zoom: 4
};

const MAP_EVENTS = ENV.googleMap.events;
const MAP_STATIC_OPTIONS = ENV.googleMap.staticOptions;
const MAP_BOUND_OPTIONS = ENV.googleMap.boundOptions;
const AUGMENTED_MAP_EVENTS = {
  center_changed: 'center',
  heading_changed: 'heading',
  maptypeid_changed: 'mapTypeId',
  tilt_changed: 'tilt',
  zoom_changed: 'zoom'
};

const googleMapsInstanceScope = ENV.googleMap.scope;

const resizeSubscribers = [];
let didSetupListener = false;

function setupResizeListener() {
  didSetupListener = true;
  $(window).on('resize.ember-cli-g-maps', () => {
    resizeSubscribers.forEach(c => c._windowDidResize());
  });
}

/*
 * Generate an instance of a map point component
 * as the g-map component class
 */
export default Component.extend(isTest, mapPoint({
  bound: MAP_BOUND_OPTIONS,
  passive: MAP_STATIC_OPTIONS,
  defaults: GOOGLE_MAP_DEFAULTS,
  events: MAP_EVENTS,
  augmentedEvents: AUGMENTED_MAP_EVENTS,
  googleMapsInstanceScope,
  component: {
    layout,

    /**
     * @type {Ember.ObjectProxy}
     * Proxy wrapper for the Google Map instance
     */
    [googleMapsInstanceScope]: null,

    /**
     * @private
     * @type {Number}
     * Width of maps' parent element in pixels
     */
    _containerWidth: 0,

    /**
     * @param {Object} options   Current Map options
     * Method invoked when Google Maps libraries have loaded
     * and the `didInsertElement` lifecycle hook has fired
     */
    insertGoogleMapInstance(options) {
      if (!didSetupListener) { setupResizeListener(); }
      resizeSubscribers.push(this);
      this._containerWidth = this.element.clientWidth;

     /*
      * Render Google Map to canvas element
      */
      const canvas = this.element.querySelector('[data-g-map="canvas"]');
      const mapConfig = assign({}, GOOGLE_MAP_DEFAULTS);
      assign(mapConfig, options);

      // Instantiate Google Map
      const map = set(this, googleMapsInstanceScope, googleMap(canvas, mapConfig));

      /*
       * Mock `loaded` event w/ first idle
       */
      const {loaded} = this.attrs;

      if (loaded) {
        const loadedAction = (typeof loaded  === 'function' ? loaded : run.bind(this, 'sendAction', 'loaded'));
        google.maps.event.addListenerOnce(map.content, 'idle', loadedAction);
      }

     /*
      * Some test helpers require access to the map instance
      */
      if (get(this, '_isTest')) {
        canvas.__GOOGLE_MAP__ = map.content;
      }
    },

    willDestroyElement() {
      this._super(...arguments);

      for (let i = 0; i < resizeSubscribers.length; i++) {
        if (resizeSubscribers[i] === this) {
          resizeSubscribers.splice(i, 1);
          break;
        }
      }
    },

    /**
     * @private
     * Determine if map resize is necessary and queue resize event
     */
    _windowDidResize() {
      if (this._containerWidth === this.element.clientWidth) { return; }
      this._containerWidth = this.element.clientWidth;
      run.debounce(this, this._resizeMap, 150);
    },

    /**
     * @private
     * Triggers a resize of the map
     */
    _resizeMap() {
      google.maps.event.trigger(get(this, `${googleMapsInstanceScope}.content`), 'resize');
    }
  }
}));
