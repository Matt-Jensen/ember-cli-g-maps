import Ember from 'ember';
import computed from 'ember-computed';
import {assert} from 'ember-metal/utils';
import {assign} from 'ember-platform';
import {isPresent} from 'ember-utils';

const MAP_DEFAULTS = {
  minZoom: 0,
  maxZoom: Infinity,
  clickableIcons: true,
  tilt: 0
};

export const GoogleMapProxy = Ember.ObjectProxy.extend({
  /**
   * @type {Object|Undefined}
   * Update the center of the Google Map instance via LatLng/LatLngLiterals
   */
  center: computed({
    get() {
      const center = this.content.getCenter();

      if (center) {
        return { lat: center.lat(), lng: center.lng() };
      }
    },

    set(key, value) {
      value = (typeof value.toJSON === 'function' ? value.toJSON() : value);
      assert('center is an Object', typeof value === 'object');
      assert('center was set without a lat number', typeof value.lat === 'number');
      assert('center was set without a lng number', typeof value.lng === 'number');
      this.content.setCenter(value);
      return value;
    }
  }).volatile(),

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
   * @type {String}
   * The name or url of the cursor to display when the map is being dragged
   */
  draggingCursor: computed({
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
   * @type {String|Undefined}
   * Position to render the fullscreen control
   * NOTE replaced configuration object with string
   */
  fullscreenControlOptions: computed({
    get() {}, // Undefined by default
    set(key, value) {
      assert('fullscreenControlOptions was set without a string', typeof value === 'string');

      const id = getControlPositionId(value);
      assert('fullscreenControlOptions is not a valid control position', isPresent(id));

      this.content.setOptions({
        fullscreenControlOptions: { position: id }
      });

      return getControlPosition(id);
    }
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
   * @type {Number}
   * Heading for aerial imagery
   * NOTE headings are snapped to nearest usable value
   * NOTE A single set can fire multiple change events
   */
  heading: computed({
    get() {
      return this.content.getHeading();
    },

    set(key, heading) {
      assert('heading was set without a number', typeof heading === 'number');
      this.content.setHeading(heading);
      return this.content.getHeading();
    }
  }).volatile(),

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
   * @private
   * @type {Boolean}
   * Google maps does not return a style if its set to default
   * This indicates if a user has set any map type control option style
   */
  _enforceMapTypeControlOptionsStyle: false,

  /**
   * @type {Object}
   * Configuration settings for the map type controls
   */
  mapTypeControlOptions: computed({
    get() {
      const {mapTypeControlOptions} = this.content;

      const result = {};

      if (mapTypeControlOptions.mapTypeIds) {
        result.mapTypeIds = mapTypeControlOptions.mapTypeIds.map(getMapType);
      }

      if (mapTypeControlOptions.position) {
        result.position = getControlPosition(mapTypeControlOptions.position);
      }

      if (mapTypeControlOptions.style) {
        result.style = getMapTypeControlStyle(mapTypeControlOptions.style);
      }

      if (!result.style && this._enforceMapTypeControlOptionsStyle){
        result.style = 'DEFAULT'; // Enforce style presence
      }

      return result;
    },

    set(key, value) {
      assert('mapTypeControlOptions was set without an object', typeof value === 'object');

      const mapTypeControlOptions = Object.create(null);

      if (value.mapTypeIds) {
        assert('mapTypeControlOptions.mapTypeIds was set without an array', value.mapTypeIds instanceof Array);
        mapTypeControlOptions.mapTypeIds = value.mapTypeIds.map(getMapTypesId);
      }

      if (value.position) {
        assert('mapTypeControlOptions.position was set without a string', typeof value.position === 'string');

        const position = getControlPositionId(value.position);
        assert('mapTypeControlOptions.position is not a valid control position', isPresent(position));

        mapTypeControlOptions.position = position;
      }

      if (value.style) {
        assert('mapTypeControlOptions.style was set without a string', typeof value.style === 'string');

        const style = getMapTypeControlStyleId(value.style);
        assert('mapTypeControlOptions.style is not a valid map type control style', isPresent(style));

        mapTypeControlOptions.style = style;
        this._enforceMapTypeControlOptionsStyle = true;
      } else {
        this._enforceMapTypeControlOptionsStyle = false;
      }

      this.content.setOptions({mapTypeControlOptions});
      return this.get('mapTypeControlOptions');
    }
  }).volatile(),

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
  }).volatile(),

  /**
   * @type {Number}
   * Map maximum zoom level
   */
  maxZoom: computed({
    get() {
      return this.content.maxZoom;
    },

    set(key, value) {
      value = (value === Infinity ? value : parseInt(value, 10));
      assert('maxZoom was set without a valid number', isNaN(value) === false);
      assert('maxZoom was set below minZoom', value > this.get('minZoom'));
      return this.content.maxZoom = value;
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
      value = parseInt(value, 10);
      assert('minZoom was set without a valid number', isNaN(value) === false);
      assert('minZoom was set above maxZoom', value < this.get('maxZoom'));
      return this.content.minZoom = value;
    }
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
   * @type {String}
   * Position to render the pan control
   * NOTE replaced configuration object with string
   */
  panControlOptions: computed({
    get() {}, // Undefined by default
    set(key, value) {
      assert('panControlOptions was set without a string', typeof value === 'string');

      const id = getControlPositionId(value);
      assert('panControlOptions is not a valid control position', isPresent(id));

      this.content.setOptions({
        panControlOptions: { position: id }
      });

      return getControlPosition(id);
    }
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
   * @type {String}
   * Position to render the rotate control
   * NOTE replaced configuration object with string
   */
  rotateControlOptions: computed({
    get() {}, // Undefined by default
    set(key, value) {
      assert('rotateControlOptions was set without a string', typeof value === 'string');

      const id = getControlPositionId(value);
      assert('rotateControlOptions is not a valid control position', isPresent(id));

      this.content.setOptions({
        rotateControlOptions: { position: id }
      });

      return getControlPosition(id);
    }
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
   * @type {String}
   * Style to render the scale control with
   * NOTE replaced configuration object with string
   */
  scaleControlOptions: computed({
     get() {}, // Undefined by default
     set(key, value) {
      assert('scaleControlOptions was set without a string', typeof value === 'string');

      const id = getScaleControlStyleId(value);
      assert('scaleControlOptions is not a valid scale control style', isPresent(id));

      this.content.setOptions({
        scaleControlOptions: { style: id }
      });

      return getScaleControlStyle(id);
    }
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
   * @type {google.maps.StreetViewPanorama}
   * Set the street view panorama used by the map
   */
  streetView: computed({
    get() {
      return this.content.streetView;
    },

    set(key, value) {
      assert('streetView was set without a StreetViewPanorama instance', value instanceof google.maps.StreetViewPanorama);
      this.content.setOptions({streetView: value});
      return value;
    }
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
   * @type {String}
   * Position to render the street view control
   * NOTE replaced configuration object with string
   */
  streetViewControlOptions: computed({
    get() {}, // Undefined by default
    set(key, value) {
      assert('streetViewControlOptions was set without a string', typeof value === 'string');

      const id = getControlPositionId(value);
      assert('streetViewControlOptions is not a valid control position', isPresent(id));

      this.content.setOptions({
        streetViewControlOptions: { position: id }
      });

      return getControlPosition(id);
    }
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
  }),

  /**
   * @type {Number}
   * view perspective if availble for map type and zoom
   * NOTE many factors can affect the map's tilt so this property is volatile
   */
  tilt: computed({
    get() {
      return this.content.getTilt();
    },

    set(key, value) {
      assert('tilt was set without a number', typeof value === 'number');
      assert('tilt is not `0` or `45`', value === 0 || value === 45);
      this.content.setTilt(value);
      return this.content.getTilt();
    }
  }).volatile(),

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
      value = parseInt(value, 10);

      assert('zoom was set without a valid number', isNaN(value) === false);
      assert('zoom was set above maxZoom', value <= max);
      assert('zoom was set below minZoom', value >= min);

      this.content.setZoom(value);
      return value;
    }
  }).volatile(),

  /**
   * @type {Boolean}
   * The enabled/disabled state of the Zoom control
   */
  zoomControl: computed({
    get: getStaticMapOption,
    set: setStaticMapBooleanOption
  }),

  /**
   * @type {String}
   * Position to render the zoom control
   * NOTE replaced configuration object with string
   */
  zoomControlOptions: computed({
    get() {}, // Undefined by default
    set(key, value) {
      assert('zoomControlOptions was set without a string', typeof value === 'string');

      const id = getControlPositionId(value);
      assert('zoomControlOptions is not a valid control position', isPresent(id));

      this.content.setOptions({
        zoomControlOptions: { position: id }
      });

      return getControlPosition(id);
    }
  })
});

/**
 * @param  {HTMLElement} element  Google Map container element
 * @param  {Object}      options  Map instance defaults
 * @return {ObjectProxy}          Ember.ObjectProxy instance
 * Generate a new Google Map proxy instance with given element and defaults
 */
export default function googleMap(element, options = {}) {
  assert('element must an HTMLElement', element instanceof HTMLElement);

  /*
   * Background color will only take effect if set on inital options
   */
  const initalDefaults = Object.create(null);
  if (options.backgroundColor) {
    initalDefaults.backgroundColor = options.backgroundColor;
  }

  const proxy = GoogleMapProxy.create({
    //  Google Map instance
    content: new google.maps.Map(element, assign(initalDefaults, MAP_DEFAULTS))
  });

  let settings = assign({}, MAP_DEFAULTS);
  assign(settings, options);

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
}

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
}

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
}

/**
 * @param  {String} type Map type
 * @return {String}      Map type id
 * Get the id of a map type
 */
export function getMapTypesId(type) {
  type = `${type}`.toUpperCase();
  return google.maps.MapTypeId[type];
}

/**
 * @param  {String} id Map type id
 * @return {String}    Map type
 * Get a map type from its' id value
 */
export function getMapType(id) {
  id = `${id}`.toLowerCase();
  return Object.keys(google.maps.MapTypeId).filter((type) =>
    google.maps.MapTypeId[type] === id)[0];
}

/**
 * @param  {String} position Control position
 * @return {Number}          Control position id
 * Get the id of a control position
 */
export function getControlPositionId(position) {
  position = `${position}`.toUpperCase();
  return google.maps.ControlPosition[position];
}

/**
 * @param  {Number} id Control position id
 * @return {String}    Control position
 * Get a control position from its' id value
 */
export function getControlPosition(id) {
  id = parseInt(id, 10);
  return Object.keys(google.maps.ControlPosition).filter((position) =>
    google.maps.ControlPosition[position] === id)[0];
}

/**
 * @param  {String} style  Map type control style
 * @return {Number}        Map type control style id
 * Get the id of a map type control style
 */
export function getMapTypeControlStyleId(style) {
  style = `${style}`.toUpperCase();
  return google.maps.MapTypeControlStyle[style];
}

/**
 * @param  {Number} id Map type control style id
 * @return {String}    Map type control style
 * Get a map type control style from its' id value
 */
export function getMapTypeControlStyle(id) {
  id = parseInt(id, 10);
  return Object.keys(google.maps.MapTypeControlStyle).filter((style) =>
    google.maps.MapTypeControlStyle[style] === id)[0];
}

/**
 * @param  {String} style  Scale control style
 * @return {Number}        Scale control style id
 * Get the id of a scale control style
 */
export function getScaleControlStyleId(style) {
  style = `${style}`.toUpperCase();
  return google.maps.ScaleControlStyle[style];
}

/**
 * @param  {Number} id Control position id
 * @return {String}    Control position
 * Get a scale control style its' id value
 */
export function getScaleControlStyle(id) {
  id = parseInt(id, 10);
  return Object.keys(google.maps.ScaleControlStyle).filter((style) =>
    google.maps.ScaleControlStyle[style] === id)[0];
}
