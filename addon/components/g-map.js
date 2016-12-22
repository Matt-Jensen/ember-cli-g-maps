import $ from 'jquery';
import Component from 'ember-component';
import set from 'ember-metal/set';
import {default as get, getProperties} from 'ember-metal/get';
import {assert} from 'ember-metal/utils';
import computed from 'ember-computed';
import run from 'ember-runloop';
import getOwner from 'ember-owner/get';
import {isPresent} from 'ember-utils';
import {assign} from 'ember-platform';

import googleMap from 'ember-cli-g-maps/google-map';
import loadGoogleMaps from 'ember-cli-g-maps/utils/load-google-maps';
import layout from 'ember-cli-g-maps/templates/components/g-map';
import ENV from '../configuration';

const GMAP_DEFAULTS = {
  lat: 30.2672,
  lng: 97.7431
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

export default Component.extend({
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
   * @type {Object}
   * LatLngLiteral combination of lat lng
   * NOTE this is designed to be overwritten, by user, if desired
   */
  center: computed('lat', 'lng', 'options.{lat,lng,center}', function() {
    return getProperties(this, 'lat', 'lng');
  }),

  /**
   * @type {Object}
   * Google MapOptions object
   * NOTE this is designed to be overwritten, by user, if desired
   */
  options: computed(...MAP_BOUND_OPTIONS, function() {
    const opts = getProperties(this, ...MAP_BOUND_OPTIONS);

    Object.keys(opts).forEach((option) => {
      if (opts[option] === undefined) {
        delete opts[option];
      }
    });

    return opts;
  }),

  didInsertElement() {
    assert('map is a reserved namespace', get(this, 'map') === null);
    const options = assign({}, get(this, 'options')); // clone options

    /*
     * Add any static options if not defined in `options`
     */
    MAP_STATIC_OPTIONS.forEach((staticOpt) => {
      const option = get(this, staticOpt);

      if (option !== undefined && options[staticOpt] === undefined) {
        set(options, staticOpt, option);
      }
    });

    assign(options, this._assignableCenter());

    /*
     * Render Google Map to canvas element
     */
    const canvas = this.element.querySelector('[data-g-map="canvas"]');

    loadGoogleMaps().then(() => {
      if (!didSetupListener) { setupResizeListener(); }
      resizeSubscribers.push(this);
      this._containerWidth = this.element.clientWidth;

      // Instantiate Google Map
      const map = set(this, 'map', googleMap(canvas, options));

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
    });
  },

  willDestroyElement() {
    google.maps.event.clearInstanceListeners(get(this, 'map.content'));

    for (let i = 0; i < resizeSubscribers.length; i++) {
      if (resizeSubscribers[i] === this) {
        resizeSubscribers.splice(i, 1);
        break;
      }
    }
  },

  didUpdateAttrs() {
    const options = assign({}, get(this, 'options'));
    assign(options, this._assignableCenter());

    /*
     * Check for any changes to bound options and apply to map
     */
    MAP_BOUND_OPTIONS
    .filter((option) => options[option] !== undefined)
    .forEach((option) => {
      const value = options[option];
      const current = get(this, `map.${option}`);

      if (isDiff(value, current)) {
        set(this, `map.${option}`, value);
      }
    });
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
  },

  /**
   * @return {Object|Undefind} updates
   * Ensure that center is configured in order of priority:
   * - user override: options.center
   * - user override: center
   * - top level: lat,lng
   * - user override: options.{lat,lng}
   * - fallback gmap defaults
   */
  _assignableCenter() {
    const options = get(this, 'options');
    const center = options.center || {};

    // Use user configuration
    if (isPresent(center.lat) && isPresent(center.lng)) { return; }

    const updates = get(this, 'center');

    if (isPresent(updates.lat) && isPresent(updates.lng)) {
      return {center: updates};
    }

    return {
      center: {
        lat: options.lat || GMAP_DEFAULTS.lat,
        lng: options.lng || GMAP_DEFAULTS.lng
      }
    };
  }
});

function isDiff(a, b) {
  if (typeof a === 'object') {
    return JSON.stringify(a).toLowerCase() !== JSON.stringify(b).toLowerCase();
  } else {
    return a !== b;
  }
}
