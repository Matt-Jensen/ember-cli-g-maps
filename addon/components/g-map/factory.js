import Ember from 'ember';
import computed from 'ember-computed';
import {assert} from 'ember-metal/utils';
import {assign} from 'ember-platform';
import {isPresent} from 'ember-utils';

const {isArray} = Array;

const MAP_DEFAULTS = {
  heading: 0,
  minZoom: 0,
  maxZoom: Infinity,
  clickableIcons: true,
  tilt: 0
};

export const GoogleMapProxy = Ember.ObjectProxy.extend({
  /**
   * @required
   * @type {Object}
   * Update the center of the Google Map instance via LatLng literal
   */
  center: computed({
    get() {
      const center = this.content.getCenter();
      return {lat: center.lat(), lng: center.lng()};
    },

    set(key, value) {
      assert('g-map `center` is an Object', typeof value === 'object');
      assert('g-map `center.lat` is a number', typeof value.lat === 'number');
      assert('g-map `center.lng` is a number', typeof value.lng === 'number');
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
      if (!value) { value = false; }
      assert('g-map `clickableIcons` is a Boolean', typeof value === 'boolean');
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
   * @type {String|Undefined}
   * The name or url of the cursor to display when mousing over a draggable map
   */
  draggableCursor: computed({
    get: getStaticMapOption,
    set: setStaticMapStringOption
  }),

  /**
   * @type {String|Undefined}
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
    get() {
      if (this.content.fullscreenControlOptions) {
        return getControlPosition(this.content.fullscreenControlOptions.position);
      }
    },

    set(key, value) {
      if (!value) {
        this.content.setOptions({fullscreenControlOptions: null});
        return;
      }

      assert('g-map `fullscreenControlOptions` is a String', typeof value === 'string');

      const id = getControlPositionId(value);
      assert('g-map `fullscreenControlOptions` is a valid control position', isPresent(id));

      this.content.setOptions({
        fullscreenControlOptions: {position: id}
      });

      return getControlPosition(id);
    }
  }),

  /**
   * @type {String|Undefined}
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

    set(key, value) {
      if (typeof value !== 'number' && !value) { value = MAP_DEFAULTS.heading; }
      assert('g-map `heading` is a Number', typeof value === 'number');
      this.content.setHeading(value);
      return this.get('heading');
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
   * @type {Object|Undefined}
   * Configuration settings for the map type controls
   */
  mapTypeControlOptions: computed({
    get() {
      return userFacingMapTypeControlOptions(
        this.content.mapTypeControlOptions,
        this._enforceMapTypeControlOptionsStyle
      );
    },

    set(key, value) {
      if (!value) {
        this.content.setOptions({mapTypeControlOptions: null});
        return;
      }

      assert('g-map `mapTypeControlOptions` is an Object', typeof value === 'object');

      const mapTypeControlOptions = Object.create(null);

      if (value.mapTypeIds) {
        assert('g-map `mapTypeControlOptions.mapTypeIds` is an Array', isArray(value.mapTypeIds));
        mapTypeControlOptions.mapTypeIds = value.mapTypeIds.map(getMapTypesId);
      }

      if (value.position) {
        assert('g-map `mapTypeControlOptions.position` is a String', typeof value.position === 'string');

        const position = getControlPositionId(value.position);
        assert('g-map `mapTypeControlOptions.position` is a valid control position', isPresent(position));

        mapTypeControlOptions.position = position;
      }

      if (value.style) {
        assert('g-map `mapTypeControlOptions.style` is a String', typeof value.style === 'string');

        const style = getMapTypeControlStyleId(value.style);
        assert('g-map `mapTypeControlOptions.style` is a valid map type control style', isPresent(style));

        mapTypeControlOptions.style = style;
        this._enforceMapTypeControlOptionsStyle = true;
      } else {
        this._enforceMapTypeControlOptionsStyle = false;
      }

      this.content.setOptions({mapTypeControlOptions});

      return userFacingMapTypeControlOptions(
        this.content.mapTypeControlOptions,
        this._enforceMapTypeControlOptionsStyle
      );
    }
  }),

  /**
   * @type {String|Undefined}
   * Type of map rendered, via map type
   */
  mapTypeId: computed({
    get() {
      return getMapType(this.content.getMapTypeId());
    },

    set(key, value) {
      if (!value) { value = ''; }
      assert('g-map `mapTypeId` is a String', typeof value === 'string');

      const mapTypeId = getMapTypesId(value);

      if (value) {
        assert('g-map `mapTypeId` is a valid map type', mapTypeId);
      }

      this.content.setMapTypeId(mapTypeId);
      return this.get('mapTypeId');
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
      if (typeof value !== 'number' && !value) { value = MAP_DEFAULTS.maxZoom; }
      value = (value === Infinity ? value : parseInt(value, 10));
      assert('g-map `maxZoom` is a Number', isNaN(value) === false);
      assert('g-map `maxZoom` is not less than zoom', value >= this.get('zoom'));
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
      if (typeof value !== 'number' && !value) { value = MAP_DEFAULTS.minZoom; }
      value = parseInt(value, 10);
      assert('g-map `minZoom` is a Number', isNaN(value) === false);
      assert('g-map `minZoom` is not greater than zoom', value <= this.get('zoom'));
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
   * @type {String|Undefined}
   * Position to render the pan control
   * NOTE replaced configuration object with string
   */
  panControlOptions: computed({
    get() {
      if (this.content.panControlOptions) {
        return getControlPosition(this.content.panControlOptions.position);
      }
    },

    set(key, value) {
      if (!value) {
        this.content.setOptions({panControlOptions: null});
        return;
      }

      assert('g-map `panControlOptions` is a String', typeof value === 'string');

      const id = getControlPositionId(value);
      assert('g-map `panControlOptions` is a valid control position', isPresent(id));

      this.content.setOptions({
        panControlOptions: {position: id}
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
   * @type {String|Undefined}
   * Position to render the rotate control
   * NOTE replaced configuration object with string
   */
  rotateControlOptions: computed({
    get() {
      if (this.content.rotateControlOptions) {
        return getControlPosition(this.content.rotateControlOptions.position);
      }
    },

    set(key, value) {
      if (!value) {
        this.content.setOptions({rotateControlOptions: null});
        return;
      }

      assert('g-map `rotateControlOptions` is a String', typeof value === 'string');

      const id = getControlPositionId(value);
      assert('g-map `rotateControlOptions` is a valid control position', isPresent(id));

      this.content.setOptions({
        rotateControlOptions: {position: id}
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
   * @type {String|Undefined}
   * Style to render the scale control with
   * NOTE replaced configuration object with string
   */
  scaleControlOptions: computed({
     get() {
       if (this.content.scaleControlOptions) {
         return getScaleControlStyle(this.content.scaleControlOptions.style);
       }
     },

     set(key, value) {
       if (!value) {
         this.content.setOptions({scaleControlOptions: undefined});
         return;
       }

       assert('g-map `scaleControlOptions` is a String', typeof value === 'string');

       const id = getScaleControlStyleId(value);
       assert('g-map `scaleControlOptions` is a valid scale control style', isPresent(id));

       this.content.setOptions({
         scaleControlOptions: {style: id}
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
   * @required
   * @type {google.maps.StreetViewPanorama}
   * Set the street view panorama used by the map
   */
  streetView: computed({
    get() {
      return this.content.streetView;
    },

    set(key, value) {
      assert('g-map `streetView` is a google.maps.StreetViewPanorama instance', value instanceof google.maps.StreetViewPanorama);
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
   * @type {String|Undefined}
   * Position to render the street view control
   * NOTE replaced configuration object with string
   */
  streetViewControlOptions: computed({
    get() {
      if (this.content.streetViewControlOptions) {
        return getControlPosition(this.content.streetViewControlOptions.position);
      }
    },

    set(key, value) {
      if (!value) {
        this.content.setOptions({streetViewControlOptions: null});
        return;
      }

      assert('g-map `streetViewControlOptions` is a String', typeof value === 'string');

      const id = getControlPositionId(value);
      assert('g-map `streetViewControlOptions` is a valid control position', isPresent(id));

      this.content.setOptions({
        streetViewControlOptions: {position: id}
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
      assert('g-map `styles` is an Array', isArray(styles));
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
      if (typeof value !== 'number' && !value) { value = MAP_DEFAULTS.tilt; }
      assert('g-map `tilt` is a Number', typeof value === 'number');
      assert('g-map `tilt` is `0` or `45`', value === 0 || value === 45);
      this.content.setTilt(value);
      return this.get('tilt');
    }
  }).volatile(),

  /**
   * @required
   * @type {Number}
   * Map zoom level
   */
  zoom: computed({
    get() {
      return this.content.getZoom();
    },

    set(key, value) {
      assert('g-map `zoom` is a Number', isNaN(value) === false);
      assert('g-map `zoom` is not greater than maxZoom', value <= this.get('maxZoom'));
      assert('g-map `zoom` is not less than minZoom', value >= this.get('minZoom'));

      this.content.setZoom(Math.round(value));
      return this.get('zoom');
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
   * @type {String|Undefined}
   * Position to render the zoom control
   * NOTE replaced configuration object with string
   */
  zoomControlOptions: computed({
    get() {
      if (this.content.zoomControlOptions) {
        return getControlPosition(this.content.zoomControlOptions.position);
      }
    },

    set(key, value) {
      if (!value) {
        this.content.setOptions({zoomControlOptions: null});
        return;
      }

      assert('g-map `zoomControlOptions` is a String', typeof value === 'string');

      const id = getControlPositionId(value);
      assert('g-map `zoomControlOptions` is a valid control position', isPresent(id));

      this.content.setOptions({
        zoomControlOptions: {position: id}
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
  assert('Google Map requires an HTMLElement', element instanceof HTMLElement);
  assert('Google Map requires a center', options.center);
  assert('Google Map requires zoom', options.zoom);

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

  // Set required options via proxy
  proxy.set('center', settings.center);
  delete settings.center;

  proxy.set('zoom', settings.zoom);
  delete settings.zoom;

  // Set map options via proxy
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
  if (!value) { value = false; }
  assert(`${key} was set without boolean`, typeof value === 'boolean');
  this.content.setOptions({[key]: value});
  return value;
}

/**
 * @param {String} key     Google Map option key
 * @param {String} value   Google Map option value
 * @return {String|Undefined}
 * Set a string option of a proxy's Google Map
 */
function setStaticMapStringOption(key, value) {
  if (!value) { value = ''; }
  assert(`${key} was set without string`, typeof value === 'string');
  this.content.setOptions({[key]: value});
  if (value) { return value; }
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

/**
 * @private
 * @param {Object}
 * @param {Boolean}
 * @return {Object|Undefined}
 * Construct a user facing Map Type Control options configuration
 * from a Google Maps `mapTypeControlOptions` configuration
 */
function userFacingMapTypeControlOptions(mapTypeControlOptions, enforceMapTypeControlOptionsStyle = false) {
  const result = {};

  if (mapTypeControlOptions) {
    if (mapTypeControlOptions.mapTypeIds) {
      result.mapTypeIds = mapTypeControlOptions.mapTypeIds.map(getMapType);
    }

    if (mapTypeControlOptions.position) {
      result.position = getControlPosition(mapTypeControlOptions.position);
    }

    if (mapTypeControlOptions.style) {
      result.style = getMapTypeControlStyle(mapTypeControlOptions.style);
    }

    if (!result.style && enforceMapTypeControlOptionsStyle){
      result.style = 'DEFAULT'; // Enforce style presence
    }

    return result;
  }
}
