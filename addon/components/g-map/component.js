import $ from 'jquery';
import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import {assert} from 'ember-metal/utils';
import {assign} from 'ember-platform';
import computed from 'ember-computed';
import run from 'ember-runloop';
import getOwner from 'ember-owner/get';

import googleMap from './factory';
import mapPoint from '../../factories/map-point';
import layout from '../../templates/components/g-map';
import ENV from '../../configuration';

const GOOGLE_MAP_DEFAULTS = {
  lat: 30.2672,
  lng: 97.7431,
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
export default Component.extend(mapPoint({
  bound: MAP_BOUND_OPTIONS,
  passive: MAP_STATIC_OPTIONS,
  defaults: GOOGLE_MAP_DEFAULTS,
  component: {
    layout,

    /**
     * @type {Ember.ObjectProxy}
     * Proxy wrapper for the Google Map instance
     */
    map: null,

    /**
     * @private
     * @type {Number}
     * Width of maps' parent element in pixels
     */
    _containerWidth: 0,

    /**
     * @private
     * @type {Boolean}
     */
    _isTest: computed(function() {
      return (getOwner(this).resolveRegistration('config:environment').environment === 'test');
    }),

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
      const map = set(this, 'map', googleMap(canvas, mapConfig));

     /*
      * Bind any events to google map
      */
      MAP_EVENTS.forEach((event) => {
        const action = this.attrs[event];
        if (!action) { return; }

        const closureAction = (typeof action === 'function' ? action : run.bind(this, 'sendAction', event));
        const eventHandler = (...args) => {
          // Append optional argument
          args.push(AUGMENTED_MAP_EVENTS[event] ? get(this, `map.${AUGMENTED_MAP_EVENTS[event]}`) : undefined);

          // Invoke with any arguments
          return closureAction(...args);
        };

        if (event === 'loaded') {
          // Loaded is faked /w first idle event
          return google.maps.event.addListenerOnce(map.content, 'idle', eventHandler);
        }

        if (action) {
          map.content.addListener(event, eventHandler);
        }
      });

      /*
      * Some test helpers require access to the map instance
      */
      if (this.get('_isTest')) {
        canvas.__GOOGLE_MAP__ = map.content;
      }
    },

    getGoogleMapInstanceValue(option) {
      return get(this, `map.${option}`);
    },

    /*
     * Invoked during `didUpdateAttrs` with any updated option
     */
    updateGoogleMapInstance(option, value) {
      return set(this, `map.${option}`, value);
    },

    didInsertElement() {
      this._super(...arguments);
      assert('map is a reserved namespace', get(this, 'map') === null);
    },

    willDestroyElement() {
      this._super(...arguments);

      google.maps.event.clearInstanceListeners(get(this, 'map.content'));

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
      google.maps.event.trigger(get(this, 'map.content'), 'resize');
    }
  }
}));
