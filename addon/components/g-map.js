import $ from 'jquery';
import Component from 'ember-component';
import set from 'ember-metal/set';
import {default as get, getProperties} from 'ember-metal/get';
import {assert} from 'ember-metal/utils';
import computed from 'ember-computed';
import run from 'ember-runloop';
import getOwner from 'ember-owner/get';

import googleMap from 'ember-cli-g-maps/google-map';
import loadGoogleMaps from 'ember-cli-g-maps/utils/load-google-maps';
import layout from 'ember-cli-g-maps/templates/components/g-map';

const GMAP_DEFAULTS = {
  lat: 30.2672,
  lng: 97.7431
};

const MAP_EVENTS = [
  'bounds_changed',
  'center_changed',
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'heading_changed',
  'idle',
  'loaded',
  'maptypeid_changed',
  'mousemove',
  'mouseout',
  'mouseover',
  'projection_changed',
  'resize',
  'rightclick',
  'tilesloaded',
  'tilt_changed',
  'zoom_changed'
];

const AUGMENTED_MAP_EVENTS = {
  center_changed: 'center',
  heading_changed: 'heading',
  maptypeid_changed: 'mapTypeId',
  tilt_changed: 'tilt',
  zoom_changed: 'zoom'
};

const MAP_STATIC_OPTIONS = [
  'backgroundColor',
  'styles'
];

const MAP_BOUND_OPTIONS = [
  'center',
  'clickableIcons',
  'disableDefaultUI',
  'disableDoubleClickZoom',
  'draggable',
  'draggableCursor',
  'draggingCursor',
  'fullscreenControl',
  'fullscreenControlOptions',
  'gestureHandling',
  'heading',
  'keyboardShortcuts',
  'mapTypeControl',
  'mapTypeControlOptions',
  'mapTypeId',
  'maxZoom',
  'minZoom',
  'noClear',
  'panControl',
  'panControlOptions',
  'rotateControl',
  'rotateControlOptions',
  'scaleControl',
  'scaleControlOptions',
  'scrollwheel',
  'signInControl',
  'streetView',
  'streetViewControl',
  'streetViewControlOptions',
  'tilt',
  'zoom',
  'zoomControl',
  'zoomControlOptions'
];

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
  center: computed('lat', 'lng', function() {
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
    const options = get(this, 'options') || {};

    // Add static options if undefined
    MAP_STATIC_OPTIONS.forEach((staticOpt) => {
      const option = get(this, staticOpt);

      if (options[staticOpt] === undefined) {
        set(options, staticOpt, option);
      }
    });

    if (!options.center) {
      options.center = get(this, 'center');
    }

    if (!options.center.lat) {
      options.center.lat = GMAP_DEFAULTS.lat;
    }

    if (!options.center.lng) {
      options.center.lng = GMAP_DEFAULTS.lng;
    }

    /*
     * Render Google Map to canvas data element
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
    const options = get(this, 'options');

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
  }
});

function isDiff(a, b) {
  if (typeof a === 'object') {
    return JSON.stringify(a).toLowerCase() !== JSON.stringify(b).toLowerCase();
  } else {
    return a !== b;
  }
}
