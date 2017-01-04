import Ember from 'ember';
import {assert} from 'ember-metal/utils';
import {assign} from 'ember-platform';
import {isPresent} from 'ember-utils';
import {warn} from 'ember-debug';
import computed from 'ember-computed';

const {isArray} = Array;

const MARKER_DEFAULTS = {
  clickable: true,
  crossOnDrag: true,
  draggable: false,
  opacity: 1,
  optimized: true
};

export const GoogleMapMarkerProxy = Ember.ObjectProxy.extend({
  /**
   * @type {Object|Undefined}
   * Offset from the marker's position to the tip of an InfoWindow
   */
  anchorPoint: computed({
    get() {
      const {anchorPoint} = this.content;

      if (anchorPoint) {
        return assign({}, anchorPoint); // convert Point to literal
      }
    },

    set(key, value) {
      if (!value) {
        this.content.setOptions({anchorPoint: null}); // remove anchorPoint
        return undefined;
      }

      assert('g-map-marker `anchorPoint` is a Object', typeof value === 'object');
      assert('g-map-marker `anchorPoint.x` is a number', typeof value.x === 'number');
      assert('g-map-marker `anchorPoint.y` is a number', typeof value.y === 'number');

      this.content.setOptions({
        anchorPoint: new google.maps.Point(value.x, value.y)
      });

      return this.get('anchorPoint');
    }
  }),

  /**
   * @type {String|Undefined}
   * Which animation to play when marker is added to a map
   */
  animation: computed({
    get() {
      return getAnimation(this.content.getAnimation());
    },

    set(key, value) {
      if (!value) {
        this.content.setAnimation(''); // remove animation
        return undefined;
      }

      assert('g-map-marker `animation` is a String', typeof value === 'string');

      const animation = getAnimationId(value);
      assert('g-map-marker `animation` is a valid google maps animation', animation);

      const icon = this.get('icon');
      const optimized = this.get('optimized');

      warn(
        'Setting Google Map Marker to optimized with an animated icon image is not recommended.\nPlease set: {{g-map-marker optimized=false}}',
        (optimized ? (icon === undefined || !icon.url) : true),
        {id: 'ember-cli-g-maps.g-map-marker.factory.animation'}
      );

      this.content.setAnimation(animation);
      return value;
    }
  }).volatile(),

  /**
   * @type {Boolean}
   * The marker receives mouse and touch events
   */
  clickable: computed({
    get() {
      return this.content.getClickable();
    },

    set(key, value) {
      assert('g-map-marker `clickableIcons` is a Boolean', typeof value === 'boolean');
      this.content.setClickable(value);
      return value;
    }
  }).volatile(),

  /**
   * @type {Boolean}
   * Disables cross that appears beneath the marker when dragging
   */
  crossOnDrag: computed({
    get() {
      return this.content.crossOnDrag;
    },

    set(key, value) {
      assert('g-map-marker `crossOnDrag` is a Boolean', typeof value === 'boolean');
      this.content.setOptions({crossOnDrag: value});
      return value;
    }
  }),

  /**
   * @type {String|Undefined}
   * Mouse cursor to show on hover
   */
  cursor: computed({
    get() {
      const cursor = this.content.getCursor();
      if (cursor) { return cursor; }
    },

    set(key, value) {
      if (!value) {
        return this.content.setCursor(''); // remove cursor
      }

      assert('g-map-marker `cursor` is a String', typeof value === 'string');
      this.content.setCursor(value);
      return value;
    }
  }).volatile(),

  /**
   * @type {Boolean}
   * The marker can be dragged
   */
  draggable: computed({
    get() {
      return this.content.getDraggable();
    },

    set(key, value) {
      assert('g-map-marker `draggable` is a Boolean', typeof value === 'boolean');
      this.content.setDraggable(value);
      return value;
    }
  }).volatile(),

  /**
   * @type {String|Object|Undefined}
   * Icon for the foreground
   */
  icon: computed({
    get() {
      const icon = this.content.getIcon();

      if (icon) {
        return (typeof icon === 'string' ? icon : icon.toJSON());
      }
    },

    set(key, value) {
      if (!value) { value = ''; } // setting an icon to '' removes it

      assert('g-map-marker `icon` is a String or Object', typeof value === 'string' || typeof value === 'object' || value === false || value === null);

      if (typeof value === 'string') {
        this.content.setIcon(value); // set as Icon.url or remove if falsey value
      } else if (value.url) {
        this.content.setIcon(markerIcon(value));
      } else if (value.path){
        this.content.setIcon(markerSymbol(value));
      } else {
        assert('g-map-marker `icon` has a usable icon configuration');
      }

      return this.get('icon');
    }
  }).volatile(),

  /**
   * @type {String|Object|Undefined}
   * Adds a label to the marker
   */
  label: computed({
    get() {
      const label = this.content.getLabel();
      if (label) { return label; }
    },

    set(key, value) {
      if (!value) { value = ''; } // setting a label to '' removes it

      assert('g-map-marker `label` is a String or Object', typeof value === 'string' || typeof value === 'object');

      if (typeof value === 'object') {
        assert('g-map-marker `label` object `text` value is a String', typeof value.text === 'string');
      }

      this.content.setLabel(value);
      return value;
    }
  }),

  /**
   * @type {Number}
   * Marker's opacity between 0.0 and 1.0
   */
  opacity: computed({
    get() {
      return this.content.getOpacity();
    },

    set(key, value) {
      if (typeof value !== 'number' && !value) {
        value = MARKER_DEFAULTS.opacity; // reset opacity
      }

      assert('g-map-marker `opacity` is a Number', typeof value === 'number');
      assert('g-map-marker `opacity` is not greater than 1', value <= 1);
      assert('g-map-marker `opacity` is not less than 0', value >= 0);

      this.content.setOpacity(value);
      return value;
    }
  }),

  /**
   * @type {Boolean}
   * Optimization renders many markers as a single static element
   * Enabled by default
   */
  optimized: computed({
    get() {
      return this.content.optimized;
    },

    set(key, value) {
      assert('g-map-marker `optimized` is a Boolean', typeof value === 'boolean');
      this.content.setOptions({optimized: value});
      return value;
    }
  }),

  /**
   * @type {Object}
   * Marker position. Required.
   */
  position: computed({
    get() {
      const position = this.content.getPosition();
      return {lat: position.lat(), lng: position.lng()};
    },

    set(key, value) {
      assert('g-map-marker `position` is an Object', typeof value === 'object');
      assert('g-map-marker `position.lat` is a Number', typeof value.lat === 'number');
      assert('g-map-marker `position.lng` is a Number', typeof value.lng === 'number');

      this.content.setPosition(new google.maps.LatLng(value.lat, value.lng));
      return this.get('position');
    }
  }).volatile(),

  /**
   * @type {Object|Undefined}
   * Image map region definition used for drag/click
   */
  shape: computed({
    get() {
      const shape = this.content.getShape();
      if (shape) { return shape; }
    },

    set(key, value) {
      if (!value) {
        this.content.setShape(false); // remove shape
        return undefined;
      }

      assert('g-map-marker `shape` is an Object', typeof value === 'object');
      assert('g-map-marker `shape.type` is a string', typeof value.type === 'string');
      assert('g-map-marker `shape.coords` is a an Array of Numbers', isArray(value.coords) && typeof value.coords[0] === 'number');

      const type = value.type.toLowerCase();
      assert('g-map-marker `shape.type` is a defined shape', type === 'circle' || type === 'poly' || type === 'rect');

      if (type === 'circle') {
        assert('g-map-marker `shape.coords` for type circle must contain 3 numbers', value.coords.length === 3);
      } else if (type === 'poly') {
        assert('g-map-marker `shape.coords` for type poly must contain a minimum of 4 numbers', value.coords.length >= 4);
        assert('g-map-marker `shape.coords` for type poly must contain an even number of coords', value.coords.length % 2 === 0);
      } else if (type === 'rect') {
        assert('g-map-marker `shape.coords` for type rect must contain only 4 numbers', value.coords.length === 4);
      }

      this.content.setShape(value);
      return value;
    }
  }).volatile(),

  /**
   * @type {String|Undefined}
   * Rollover text
   */
  title: computed({
    get() {
      const title = this.content.getTitle();
      if (title) { return title; }
    },

    set(key, value) {
      if (!value) { value = ''; } // remove title
      assert('g-map-marker `title` is a String', typeof value === 'string');
      this.content.setTitle(value);
      return this.get('title');
    }
  }).volatile(),

  /**
   * @type {Boolean}
   * Marker visiblity
   */
  visible: computed({
    get() {
      return this.content.getVisible();
    },

    set(key, value) {
      assert('g-map-marker `visible` is a Boolean', typeof value === 'boolean');
      this.content.setVisible(value);
      return value;
    }
  }).volatile(),

  /**
   * @type {Number|Undefined}
   * Marker display order
   */
  zIndex: computed({
    get() {
      const zIndex = this.content.getZIndex();
      if (typeof zIndex === 'number') { return zIndex; }
    },

    set(key, value) {
      if (typeof value !== 'number' && !value) {
        this.content.setZIndex(null);
        return undefined;
      }

      assert('g-map-marker `zIndex` is a Number', typeof value === 'number');
      assert('g-map-marker `zIndex` is less than max zIndex', value <= google.maps.Marker.MAX_ZINDEX);

      const zIndex = Math.round(value);

      this.content.setZIndex(zIndex);
      return zIndex;
    }
  }).volatile()
});

/**
 * @param  {Map|StreetViewPanorama} canvas   Google Maps' Map or Street View Panorama
 * @param  {Object}                 options  Marker instance defaults (requires position)
 * @return {ObjectProxy}  Ember.ObjectProxy instance
 * Render a new Google Map Marker on a canvas with the given options
 * and return its' Google Map Marker Proxy instance
 */
export default function googleMapMarker(canvas, options = {}) {
  assert(
    'Google Map Marker requires a Google Map or Street View Panorama instance',
    canvas instanceof google.maps.Map || canvas instanceof google.maps.StreetViewPanorama
  );

  assert('Google Map Marker requires a position', options.position);

  const proxy = GoogleMapMarkerProxy.create({
    content: new google.maps.Marker({map: canvas})
  });

  const settings = assign({}, MARKER_DEFAULTS);
  assign(settings, options);

  // Set defaults via proxy API
  Object.keys(settings).forEach((key) =>
    proxy.set(key, settings[key]));

  return proxy;
}

const markerIconPrototype = {
  constructor: markerIcon,

  toJSON() {
    const result = Object.create(null);

    Object.keys(this)
    .forEach((property) => {
      const value = this[property];

      if (value instanceof google.maps.Point) {
        result[property] = {x: value.x, y: value.y};
      } else if (value instanceof google.maps.Size) {
        result[property] = {width: value.width, height: value.height};

        if (value._hasWidthUnit) {
          // j === width unit
          result[property].widthUnit = value.j;
        }

        if (value._hasHeightUnit) {
          // f === height unit
          result[property].heightUnit = value.f;
        }
      } else if (typeof value !== 'function'){
        result[property] = value;
      }
    });

    return result;
  }
};

/**
 * @param  {Object} config
 * @return {Object}
 * Create a marker icon instance that is consumable by
 * the google maps API and convertable back to it's original
 * configuration object via `toJSON` method
 */
export function markerIcon(config) {
  const icon = assign({}, config);

  assert('Marker Icon requires a `url` String', typeof config.url === 'string');

  ['anchor', 'labelOrigin', 'origin'].forEach((property) => {
    const literal = icon[property];

    if (literal) {
      assert(`Marker Icon requires valid Point literal at "${property}"`, literal.x && literal.y);
      icon[property] = new google.maps.Point(literal.x, literal.y);
    }
  });

  ['scaledSize', 'size'].forEach((property) => {
    const literal = icon[property];

    if (literal) {
      assert(`Marker Icon requires valid Size literal at "${property}"`, literal.width && literal.height);
      assert(`Marker Icon requires any widthUnit for "${property}" to be valid`, literal.hasOwnProperty('widthUnit') ? literal.widthUnit.length : true);
      assert(`Marker Icon requires any heightUnit for "${property}" to be valid`, literal.hasOwnProperty('heightUnit') ? literal.heightUnit.length : true);
      icon[property] = new google.maps.Size(literal.width, literal.height, literal.widthUnit, literal.heightUnit);
      icon[property]._hasWidthUnit = Boolean(literal.widthUnit);
      icon[property]._hasHeightUnit = Boolean(literal.heightUnit);
    }
  });

  return assign(Object.create(markerIconPrototype), icon);
}

const markerSymbolPrototype = {
  constructor: markerSymbol,

  toJSON() {
    const result = Object.create(null);

    Object.keys(this)
    .forEach((property) => {
      const value = this[property];

      if (value instanceof google.maps.Point) {
        result[property] = assign({}, value);
      } else if (property === 'path') {

        /*
         * Return google maps Symbol Path name or SVG notation as path
         */
        result[property] = (typeof value === 'number' ? getSymbolPath(value) : value);
      } else if (typeof value !== 'function'){
        result[property] = value;
      }
    });

    return result;
  }
};

/**
 * @param  {Object} config
 * @return {Object}
 * Create a marker symbol instance that is consumable by
 * the google maps API and convertable back to it's original
 * configuration object via `toJSON` method
 */
export function markerSymbol(config) {
  const sym = assign({}, config);

  assert('Marker Symbol `path` is a String', typeof config.path === 'string');

  /*
   * Use any existing google maps Symbol path constant or SVG path notation
   */
  const symbolConst = getSymbolPathId(sym.path);
  sym.path = (isPresent(symbolConst) ? symbolConst : sym.path);

  ['anchor', 'labelOrigin'].forEach((property) => {
    const literal = sym[property];

    if (literal) {
      assert(`Marker Symbol requires valid Point literal at "${property}"`, literal.x && literal.y);
      sym[property] = new google.maps.Point(literal.x, literal.y);
    }
  });

  return assign(Object.create(markerSymbolPrototype), sym);
}

/**
 * @param  {String} animation  Animation
 * @return {Number}            Animation id
 * Get the id of an animation by name
 */
export function getAnimationId(animation) {
  animation = `${animation}`.toUpperCase();
  return google.maps.Animation[animation];
}

/**
 * @param  {Number} id Animation id
 * @return {String}    Animation
 * Get a name of an animation from its' id value
 */
export function getAnimation(id) {
  id = parseInt(id, 10);
  return Object.keys(google.maps.Animation).filter((path) =>
    google.maps.Animation[path] === id)[0];
}

/**
 * @param  {String} path   Symbol path
 * @return {Number}        Symbol path id
 * Get the id of a preconfigured symbol path by name
 */
export function getSymbolPathId(path) {
  path = `${path}`.toUpperCase();
  return google.maps.SymbolPath[path];
}

/**
 * @param  {Number} id Symbol path id
 * @return {String}    Symbol path
 * Get a name of a preconfigured symbol path from its' id value
 */
export function getSymbolPath(id) {
  id = parseInt(id, 10);
  return Object.keys(google.maps.SymbolPath).filter((path) =>
    google.maps.SymbolPath[path] === id)[0];
}
