import Ember from 'ember';
import computed from 'ember-computed';
import { assert } from 'ember-metal/utils';
import { assign } from 'ember-platform';

const MAP_DEFAULTS = {
  minZoom: 0,
  maxZoom: Infinity,
  clickableIcons: true,
  tilt: 0
};

const getStaticMapOption = function(key) {
  return this.content[key];
};

const setStaticMapBooleanOption = function(key, value) {
  assert(`${key} was set without boolean`, typeof value === 'boolean');
  this.content.setOptions({[key]: value});
  return value;
};

const setStaticMapStringOption = function(key, value) {
  assert(`${key} was set without string`, typeof value === 'string');
  this.content.setOptions({[key]: value});
  return value;
};

export const GoogleMapProxy = Ember.ObjectProxy.extend({
  /**
   * @type {Object}
   * Update the center of the Google Map instance via LatLng/LatLngLiterals
   */
  center: computed({
    get() {
      const center = this.content.getCenter();
      return { lat: center.lat(), lng: center.lng() };
    },

    set(key, center) {
      center = (typeof center.toJSON === 'function' ? center.toJSON() : center);
      assert('center is an Object', typeof center === 'object');
      assert('center was set without a lat number', typeof center.lat === 'number');
      assert('center was set without a lng number', typeof center.lng === 'number');
      this.content.setCenter(center);
      return center;
    }
  }),

  /**
   * @type {Number}
   * Map minimum zoom level
   */
  minZoom: computed({
    get() {
      return this.content.minZoom;
    },

    set(key, minZoom) {
      assert('minZoom was set without number', typeof minZoom === 'number');
      assert('minZoom was set above maxZoom', minZoom < this.get('maxZoom'));
      return this.content.minZoom = minZoom;
    }
  }),

  /**
   * @type {Number}
   * Map maximum zoom level
   */
  maxZoom: computed({
    get() {
      return this.content.maxZoom;
    },

    set(key, maxZoom) {
      assert('maxZoom was set without number', typeof maxZoom);
      assert('maxZoom was set below minZoom', maxZoom > this.get('minZoom'));
      return this.content.maxZoom = maxZoom;
    }
  }),

  /**
   * @type {Number}
   * Map zoom level
   */
  zoom: computed({
    get() {
      return this.content.getZoom();
    },

    set(key, zoom) {
      const min = this.get('minZoom');
      const max = this.get('maxZoom');

      assert('zoom was set without a number', typeof zoom === 'number');
      assert('zoom was set above maxZoom', zoom <= max);
      assert('zoom was set below minZoom', zoom >= min);

      this.content.setZoom(zoom);
      return zoom;
    }
  }),

  /**
   * @type {String}
   * Type of map rendered
   */
  mapTypeId: computed({
    get() {
      return this.content.getMapTypeId().toUpperCase();
    },

    set(key, mapTypeId) {
      const mapTypes = Object.keys(google.maps.MapTypeId);

      assert('mapTypeId was set without a string', typeof mapTypeId === 'string');
      assert('mapTypeId is not a valid map type', mapTypes.indexOf(mapTypeId.toUpperCase()) > -1);

      this.content.setMapTypeId(google.maps.MapTypeId[mapTypeId.toUpperCase()]);
      return mapTypeId.toUpperCase();
    }
  }),

  /**
   * @type {Boolean}
   * Point of interest icon clickablity
   */
  clickableIcons: computed({
    get() {
      return this.content.getClickableIcons();
    },

    set(key, clickableIcons) {
      assert('clickableIcons was set without a boolean', typeof clickableIcons === 'boolean');
      this.content.setClickableIcons(clickableIcons);
      return clickableIcons;
    }
  }),

  /**
   * @type {Number}
   * view perspective if availble for map type and zoom
   */
  tilt: computed({
    get() {
      return this.content.getTilt();
    },

    set(key, tilt) {
      assert('tilt was set without a number', typeof tilt === 'number');
      assert('tilt is not `0` or `45`', tilt === 0 || tilt === 45);
      this.content.setTilt(tilt);
      return tilt;
    }
  }),

  /**
   * @type {Number}
   * Heading for aerial imagery
   */
  heading: computed({
    get() {
      return this.content.getHeading();
    },

    set(key, heading) {
      assert('heading was set without a number', typeof heading === 'number');
      this.content.setHeading(heading);
      return heading;
    }
  }),

  /**
   * @type {String|Undefined}
   * Options for the rendering of the fullscreen control
   */
  fullscreenControlOptions: computed({
    get() {
      const {position} = this.content.fullscreenControlOptions;

      if (position) {
        // Return first position key that matches value
        return Object.keys(google.maps.ControlPosition)
        .filter((pos) => google.maps.ControlPosition[pos] === position)[0];
      }
    },

    set(key, fullscreenControlOptions) {
      const positions = Object.keys(google.maps.ControlPosition);

      assert('fullscreenControlOptions was set without a string', typeof fullscreenControlOptions === 'string');
      assert('fullscreenControlOptions is not a valid control position', positions.indexOf(fullscreenControlOptions.toUpperCase()) > -1);

      this.content.setOptions({
        fullscreenControlOptions: {
          position: google.maps.ControlPosition[fullscreenControlOptions.toUpperCase()]
        }
      });

      return fullscreenControlOptions.toUpperCase();
    }
  }),

  /**
   * @type {Boolean}
   * Enables/disables all default UI
   */
  disableDefaultUI: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {Boolean}
   * Enables/disables zoom and center on double click
   */
  disableDoubleClickZoom: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {Boolean}
   * If false, prevents the map from being dragged
   */
  draggable: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {String}
   * The name or url of the cursor to display when mousing over a draggable map
   */
  draggableCursor: computed({
    get: getStaticMapOption,
    set: setStaticMapStringOption
  }),

  /**
   * @type {Boolean}
   * The enabled/disabled state of the Fullscreen control
   */
  fullscreenControl: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {String}
   * Controls how gestures on the map are handled
   */
  gestureHandling: computed({
    get: getStaticMapOption,
    set: setStaticMapStringOption
  }),

  /**
   * @type {Boolean}
   * If false, prevents the map from being controlled by the keyboard
  */
  keyboardShortcuts: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {Boolean}
   * The initial enabled/disabled state of the Map type control
   */
  mapTypeControl: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {Boolean}
   * If true, do not clear the contents of the Map div
   */
  noClear: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {Boolean}
   * The enabled/disabled state of the Pan control
   */
  panControl: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {Boolean}
   * The enabled/disabled state of the Rotate control
   */
  rotateControl: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {Boolean}
   * The initial enabled/disabled state of the Scale control
   */
  scaleControl: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {Boolean}
   * The initial enabled/disabled state of the Scale control
   */
  scrollwheel: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {Boolean}
   * The enabled/disabled state of the sign in control
   */
  signInControl: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {Boolean}
   * The initial enabled/disabled state of the Street View Pegman control
   */
  streetViewControl: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {Boolean}
   * The enabled/disabled state of the Zoom control
   */
  zoomControl: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {Array<Object>}
   * Styles to apply to each of the default map types
   */
  styles: computed({
    get: getStaticMapOption,
    set(key, styles) {
      assert('styles was set without array', styles instanceof Array);
      this.content.setOptions({styles});
      return styles;
    }
  })

  // panControlOptions google.maps.PanControlOptions
  // rotateControlOptions google.maps.RotateControlOptions
  // scaleControlOptions google.maps.ScaleControlOptions
  // streetViewControlOptions google.maps.StreetViewControlOptions
  // zoomControlOption google.maps.ZoomControlOptions
});

/**
 * @param  {HTMLElement} element  Google Map container element
 * @param  {Object}      options  Map instance defaults
 * @return {ObjectProxy}          Ember.ObjectProxy instance
 * Generate a new Google Map proxy instance with given element and defaults
 */
export default function googleMap(element, options = {}) {
  assert('element must an HTMLElement', element instanceof HTMLElement);

  // set: backgroundColor
  let settings = assign({}, MAP_DEFAULTS);
  assign(settings, options);

  const proxy = GoogleMapProxy.create({
    content: new google.maps.Map(element, MAP_DEFAULTS) // instantiate Google Map
  });

  // Set map defaults via proxy API
  Object.keys(settings).forEach((key) =>
    proxy.set(key, settings[key]));

  return proxy;
}
