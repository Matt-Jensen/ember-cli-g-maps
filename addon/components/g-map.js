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

const GOOGLE_MAP_EVENTS = [
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

const EVENTS_ARGUMENT = {
  center_changed: 'center',
  heading_changed: 'heading',
  maptypeid_changed: 'mapTypeId',
  tilt_changed: 'tilt',
  zoom_changed: 'zoom'
};

const GOOGLE_MAP_OPTIONS = [
  'backgroundColor',
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
  'styles',
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
  options: computed(...GOOGLE_MAP_OPTIONS, function() {
    const opts = getProperties(this, ...GOOGLE_MAP_OPTIONS);

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
      GOOGLE_MAP_EVENTS.forEach((event) => {
        const action = this.attrs[event];
        if (!action) { return; }

        const closureAction = (typeof action === 'function' ? action : run.bind(this, 'sendAction', event));
        const eventHandler = () => {
          const arg = EVENTS_ARGUMENT[event];
          return closureAction(arg ? get(this, `map.${arg}`) : undefined); // Call /w optional arguments
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
