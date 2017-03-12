import Ember from 'ember';
import {assert} from 'ember-metal/utils';
import {assign} from 'ember-platform';
import {warn} from 'ember-debug';
import computed from 'ember-computed';

import configuration from '../../configuration';
import cps from '../../utils/google-maps-properties';
import mapIcon from '../../factories/map-icon';
import mapSymbol from '../../factories/map-symbol';
import {getAnimation, getAnimationId} from '../../utils/map-constant-helpers';

const {isArray} = Array;

const DEFAULTS = assign(Ember.getProperties(
  configuration.propertyDefaults,
  'clickable',
  'draggable',
  'opacity'
), {
  crossOnDrag: true,
  optimized: true
});

export const GoogleMapMarkerProxy = Ember.ObjectProxy.extend({
  /**
   * Default property values
   * @type {Object}
   */
  defaults: DEFAULTS,

  /**
   * Defines namespace used for assertions
   * @type {String}
   */
  name: 'g-map-marker',

  /**
   * Offset from the marker's position to the tip of an InfoWindow
   * @type {Object|Undefined}
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
        return;
      }

      const {x, y} = value;

      assert(`${this.name} "anchorPoint" is a Object`, typeof value === 'object');
      assert(`${this.name} "anchorPoint.x" is a number`, typeof x === 'number' && x === x);
      assert(`${this.name} "anchorPoint.y" is a number`, typeof y === 'number' && y === y);

      const anchorPoint = new google.maps.Point(x, y);

      this.content.setOptions({anchorPoint});

      return assign({}, anchorPoint);
    }
  }),

  /**
   * Which animation to play when marker is added to a map
   * @type {String|Undefined}
   */
  animation: computed({
    get() {
      return getAnimation(this.content.getAnimation());
    },

    set(key, value) {
      if (!value) {
        this.content.setAnimation(''); // remove animation
        return;
      }

      assert(`${this.name} "animation" is a String`, typeof value === 'string');

      const animation = getAnimationId(value);
      assert(`${this.name} "animation" is one of the google maps animation names: ${Object.keys(google.maps.Animation).join(', ')}`, animation);

      const icon = this.get('icon');
      const optimized = this.get('optimized');

      warn(
        `Setting Google Map Marker to optimized with an animated icon image is not recommended.\nPlease set: {{${this.name} optimized=false}}`,
        (optimized ? (icon === undefined || !icon.url) : true),
        {id: `ember-cli-g-maps.${this.name}.factory.animation`}
      );

      this.content.setAnimation(animation);
      return value;
    }
  }).volatile(),

  /**
   * The marker receives mouse and touch events
   * @type {Boolean}
   */
  clickable: computed({
    get() {
      return this.content.getClickable();
    },

    set(key, value) {
      if (!value) { value = false; }

      assert(`${this.name} "clickableIcons" is a Boolean`, typeof value === 'boolean');

      warn(
        `Setting Google Map Marker "clickable" to false while marker is draggable will have no effect.\nPlease set: {{${this.name} draggable=false}}`,
        (value === false ? this.get('draggable') === false : true),
        {id: `ember-cli-g-maps.${this.name}.factory.clickable`}
      );

      this.content.setClickable(value);
      return value;
    }
  }).volatile(),

  /**
   * Disables cross that appears beneath the marker when dragging
   * @type {Boolean}
   */
  crossOnDrag: computed({
    get() {
      return this.content.crossOnDrag;
    },

    set(key, value) {
      if (!value) { value = false; }

      assert(`${this.name} "crossOnDrag" is a Boolean`, typeof value === 'boolean');

      this.content.setOptions({crossOnDrag: value});
      return value;
    }
  }),

  /**
   * Mouse cursor to show on hover
   * @type {String|Undefined}
   */
  cursor: computed({
    get() {
      const cursor = this.content.getCursor();
      if (cursor) { return cursor; }
    },

    set(key, value) {
      if (!value) {
        this.content.setCursor(''); // remove
        return;
      }

      assert(`${this.name} "cursor" is a String`, typeof value === 'string');

      this.content.setCursor(value);
      return value;
    }
  }).volatile(),

  /**
   * The marker can be dragged
   * @type {Boolean}
   */
  draggable: computed({
    get() {
      return this.content.getDraggable();
    },

    set(key, value) {
      if (!value) { value = false; }

      assert(`${this.name} "draggable" is a Boolean`, typeof value === 'boolean');

      this.content.setDraggable(value);
      return value;
    }
  }).volatile(),

  /**
   * Icon for the foreground
   * @type {String|Object|Undefined}
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

      assert(`${this.name} "icon" is a String or Object`, typeof value === 'string' || typeof value === 'object' || value === false || value === null);

      if (typeof value === 'string') {
        this.content.setIcon(value); // set as Icon.url or remove if falsey value
      } else if (value.url) {
        this.content.setIcon(mapIcon(value));
      } else if (value.path){
        this.content.setIcon(mapSymbol(value));
      } else {
        assert(`${this.name} "icon" has a usable icon configuration`);
      }

      return this.get('icon');
    }
  }).volatile(),

  /**
   * Adds a label to the marker
   * @type {String|Object|Undefined}
   */
  label: computed({
    get() {
      const label = this.content.getLabel();
      if (label) { return label; }
    },

    set(key, value) {
      if (!value) { value = ''; } // setting a label to '' removes it

      assert(`${this.name} "label" is a String or Object`, typeof value === 'string' || typeof value === 'object');

      if (typeof value === 'object') {
        assert(`${this.name} "label" object "text" value is a String`, typeof value.text === 'string');
      }

      this.content.setLabel(value);
      return value;
    }
  }),

  /**
   * Marker's opacity between 0.0 and 1.0
   * @type {Number}
   */
  opacity: cps.opacity,

  /**
   * Optimization renders many markers as a single static element
   * Enabled by default
   * @type {Boolean}
   */
  optimized: computed({
    get() {
      return this.content.optimized;
    },

    set(key, value) {
      if (!value) { value = false; }

      assert(`${this.name} "optimized" is a Boolean`, typeof value === 'boolean');

      this.content.setOptions({optimized: value});
      return value;
    }
  }),

  /**
   * Marker position
   * @required
   * @type {Object}
   */
  position: computed({
    get() {
      const position = this.content.getPosition();
      return {lat: position.lat(), lng: position.lng()};
    },

    set(key, value) {
      assert(`${this.name} "position" is an Object`, typeof value === 'object');

      const {lat, lng} = value;
      assert(`${this.name} "position.lat" is a Number`, typeof lat === 'number' && lat === lat);
      assert(`${this.name} "position.lng" is a Number`, typeof lng === 'number' && lat === lat);

      this.content.setPosition(new google.maps.LatLng(lat, lng));
      return this.get('position');
    }
  }).volatile(),

  /**
   * Image map region definition used for drag/click
   * @type {Object|Undefined}
   */
  shape: computed({
    get() {
      const shape = this.content.getShape();
      if (shape) { return shape; }
    },

    set(key, value) {
      if (!value) {
        this.content.setShape(false); // remove shape
        return;
      }

      assert(`${this.name} "shape" is an Object`, typeof value === 'object');
      assert(`${this.name} "shape.type" is a string`, typeof value.type === 'string');
      assert(`${this.name} "shape.coords" is a an Array of Numbers`, isArray(value.coords) && typeof value.coords[0] === 'number');

      const type = value.type.toLowerCase();
      assert(`${this.name} "shape.type" is a defined shape`, type === 'circle' || type === 'poly' || type === 'rect');

      if (type === 'circle') {
        assert(`${this.name} "shape.coords" for type circle must contain 3 numbers`, value.coords.length === 3);
      } else if (type === 'poly') {
        assert(`${this.name} "shape.coords" for type poly must contain a minimum of 4 numbers`, value.coords.length >= 4);
        assert(`${this.name} "shape.coords" for type poly must contain an even number of coords`, value.coords.length % 2 === 0);
      } else if (type === 'rect') {
        assert(`${this.name} "shape.coords" for type rect must contain only 4 numbers`, value.coords.length === 4);
      }

      this.content.setShape(value);
      return value;
    }
  }).volatile(),

  /**
   * Rollover text
   * @type {String|Undefined}
   */
  title: computed({
    get() {
      const title = this.content.getTitle();
      if (title) { return title; }
    },

    set(key, value) {
      if (!value) { value = ''; } // remove

      assert(`${this.name} "title" is a String`, typeof value === 'string');

      this.content.setTitle(value);
      return this.get('title');
    }
  }).volatile(),

  /**
   * Marker visiblity
   * @type {Boolean}
   */
  visible: computed({
    get() {
      return this.content.getVisible();
    },

    set(key, value) {
      if (!value) { value = false; }

      assert(`${this.name} "visible" is a Boolean`, typeof value === 'boolean');

      this.content.setVisible(value);
      return value;
    }
  }).volatile(),

  /**
   * Marker display order
   * @type {Number|Undefined}
   */
  zIndex: computed({
    get() {
      const zIndex = this.content.getZIndex();
      if (typeof zIndex === 'number') { return zIndex; }
    },

    set(key, value) {
      if (!value && value !== 0) {
        this.content.setZIndex(null);
        return;
      }

      assert(`${this.name} "zIndex" is a Number`, typeof value === 'number');
      assert(`${this.name} "zIndex" is less than max zIndex`, value <= google.maps.Marker.MAX_ZINDEX);
      assert(`${this.name} "zIndex" is a Whole Number`, value % 1 === 0);

      const zIndex = value;

      this.content.setZIndex(zIndex);
      return zIndex;
    }
  }).volatile()
});

/**
 * Render a new Google Map Marker on a canvas with the given options
 * and return its' Google Map Marker Proxy instance
 * @param  {Map|StreetViewPanorama} canvas   Google Maps' Map or Street View Panorama
 * @param  {Object}                 options  Marker instance defaults (requires position)
 * @return {ObjectProxy}  Ember.ObjectProxy instance
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

  const settings = assign({}, DEFAULTS);
  assign(settings, options);

  // Set defaults via proxy API
  Object.keys(settings).forEach((key) =>
    proxy.set(key, settings[key]));

  return proxy;
}
