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

    set(key, value) {
      value = (typeof value.toJSON === 'function' ? value.toJSON() : value);
      assert('center is an Object', typeof value === 'object');
      assert('center was set without a lat number', typeof value.lat === 'number');
      assert('center was set without a lng number', typeof value.lng === 'number');
      this.content.setCenter(value);
      return value;
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

    set(key, value) {
      assert('minZoom was set without number', typeof value === 'number');
      assert('minZoom was set above maxZoom', value < this.get('maxZoom'));
      return this.content.minZoom = value;
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

    set(key, value) {
      assert('maxZoom was set without number', typeof value);
      assert('maxZoom was set below minZoom', value > this.get('minZoom'));
      return this.content.maxZoom = value;
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

    set(key, value) {
      const min = this.get('minZoom');
      const max = this.get('maxZoom');

      assert('zoom was set without a number', typeof value === 'number');
      assert('zoom was set above maxZoom', value <= max);
      assert('zoom was set below minZoom', value >= min);

      this.content.setZoom(value);
      return value;
    }
  }),

  /**
   * @type {String}
   * Type of map rendered, via map type
   */
  mapTypeId: computed({
    get() {
      return getMapType(this.content.getMapTypeId());
    },

    set(key, value) {
      assert('mapTypeId was set without a string', typeof value === 'string');

      const mapTypeId = getMapTypesId(value);
      assert('mapTypeId is not a valid map type', mapTypeId);

      this.content.setMapTypeId(mapTypeId);
      return getMapType(mapTypeId);
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

    set(key, value) {
      assert('clickableIcons was set without a boolean', typeof value === 'boolean');
      this.content.setClickableIcons(value);
      return value;
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

    set(key, value) {
      assert('tilt was set without a number', typeof value === 'number');
      assert('tilt is not `0` or `45`', value === 0 || value === 45);
      this.content.setTilt(value);
      return value;
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
        return getControlPosition(position);
      }
    },

    set(key, value) {
      assert('fullscreenControlOptions was set without a string', typeof value === 'string');

      const id = getControlPositionId(value);
      assert('fullscreenControlOptions is not a valid control position', id);

      this.content.setOptions({
        fullscreenControlOptions: {
          position: id
        }
      });

      return getControlPosition(id);
    }
  }),

  // TODO
  // mapTypeControlOptions google.maps.MapTypeControlOptions

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

/**
 * @param  {String} key   Google Map option key
 * @return {Any}
 * Return the option value of a proxy's Google Map
 */
function getStaticMapOption(key) {
  return this.content[key];
};

/**
 * @param {String} key     Google Map option key
 * @param {Boolean} value  Google Map option value
 * @return {Boolean}
 * Set a boolean option of a proxy's Google Map
 */
function setStaticMapBooleanOption(key, value) {
  assert(`${key} was set without boolean`, typeof value === 'boolean');
  this.content.setOptions({[key]: value});
  return value;
};

/**
 * @param {String} key     Google Map option key
 * @param {String} value   Google Map option value
 * @return {Boolean}
 * Set a string option of a proxy's Google Map
 */
function setStaticMapStringOption(key, value) {
  assert(`${key} was set without string`, typeof value === 'string');
  this.content.setOptions({[key]: value});
  return value;
};

/**
 * @param  {String} type Map type
 * @return {String}      Map type id
 * Get the id of a map type
 */
function getMapTypesId(type) {
  type = `${type}`.toUpperCase();
  return google.maps.MapTypeId[type];
}

/**
 * @param  {String} id Map type id
 * @return {String}    Map type
 * Get a map type from its' id value
 */
function getMapType(id) {
  id = `${id}`.toLowerCase();
  return Object.keys(google.maps.MapTypeId).filter((type) =>
    google.maps.MapTypeId[type] === id)[0];
}

/**
 * @param  {String} position Control position
 * @return {Number}          Control position id
 * Get the id of a control position
 */
function getControlPositionId(position) {
  position = `${position}`.toUpperCase();
  return google.maps.ControlPosition[position];
}

/**
 * @param  {Number} id Control position id
 * @return {String}    Control position
 * Get a control position from its' id value
 */
function getControlPosition(id) {
  id = parseInt(id, 10);
  return Object.keys(google.maps.ControlPosition).filter((position) =>
    google.maps.ControlPosition[position] === id)[0];
}
