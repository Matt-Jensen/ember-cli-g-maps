import Ember from 'ember';
import {assert} from 'ember-metal/utils';
import {assign} from 'ember-platform';
import computed from 'ember-computed';

const CIRCLE_DEFAULTS = {
  clickable: true,
  draggable: false,
  editable: false,
  fillColor: '#000000',
  fillOpacity: 1,
  strokeColor: '#000000',
  strokeOpacity: 1,
  strokePosition: 'CENTER'
};

export const GoogleMapCircleProxy = Ember.ObjectProxy.extend({
  /**
   * @required
   * @type {Object}
   * Circle center
   */
  center: computed({
    get() {
      const latLng = this.content.getCenter();
      return {lat: latLng.lat(), lng: latLng.lng()};
    },

    set(key, value) {
      assert('g-map-circle `center` is an Object', typeof value === 'object');

      const {lat, lng} = value;

      assert('g-map-circle `center.lat` is a Number', typeof lat === 'number' && lat === lat);
      assert('g-map-circle `center.lng` is a Number', typeof lng === 'number' && lng === lng);

      this.content.setCenter(value);
      return this.get('center');
    }
  }).volatile(),

  /**
  * @type {Boolean}
  * Indicates whether this Circle handles mouse events.
  */
  clickable: computed({
    get() {
      return this.content.clickable;
    },

    set(key, value) {
      if (!value) { value = false; } // remove
      assert('g-map-circle `clickableIcons` is a Boolean', typeof value === 'boolean');

      this.content.setOptions({clickable: value});
      return value;
    }
  }),

  /**
   * @type {Boolean}
   * If set to true, the user can drag this circle over the map.
   */
  draggable: computed({
    get() {
      return this.content.getDraggable();
    },

    set(key, value) {
      if (!value) { value = false; } // remove

      assert('g-map-circle `draggable` is a Boolean', typeof value === 'boolean');

      this.content.setDraggable(value);
      return value;
    }
  }),

  /**
   * @type {Boolean}
   * If set to true, the user can edit this circle by dragging the
   * control points shown at the center and around the circumference
   * of the circle.
   */
  editable: computed({
    get() {
      return this.content.getEditable();
    },

    set(key, value) {
      if (!value) { value = false; } // remove

      assert('g-map-circle `editable` is a Boolean', typeof value === 'boolean');

      this.content.setEditable(value);
      return value;
    }
  }),

  /**
   * @type {String|Undefined}
   * The fill color. All CSS3 colors are supported except for extended
   * named colors.
   */
  fillColor: computed({
    get() {
      return this.content.fillColor;
    },

    set(key, value) {
      if (!value) {
        value = CIRCLE_DEFAULTS.fillColor;
      }

      assert('g-map-circle `fillColor` is a String', typeof value === 'string');

      this.content.setOptions({fillColor: value});
      return value;
    }
  }),

  /**
   * @type {Number}
   * The fill opacity between 0.0 and 1.0
   */
  fillOpacity: computed({
    get() {
      return this.content.fillOpacity;
    },

    set(key, value) {
      if (!value && value !== 0) {
        value = CIRCLE_DEFAULTS.fillOpacity; // reset
      }

      assert('g-map-circle `fillOpacity` is a Number', typeof value === 'number');
      assert('g-map-circle `fillOpacity` is not greater than 1', value <= 1);
      assert('g-map-circle `fillOpacity` is not less than 0', value >= 0);

      this.content.setOptions({fillOpacity: value});
      return value;
    }
  }),

  /**
   * @required
   * @type {Number}
   * The radius in meters on the Earth's surface
   */
  radius: computed({
    get() {
      return this.content.getRadius();
    },

    set(key, value) {
      if (!value) { value = 0; } // remove

      assert('g-map-circle `radius` is a Number', typeof value === 'number' && value === value);

      this.content.setRadius(value);
      return value;
    }
  }).volatile(),

  /**
   * @type {String|Undefined}
   * The stroke color. All CSS3 colors are supported except for extended
   * named colors.
   */
  strokeColor: computed({
    get() {
      return this.content.strokeColor;
    },

    set(key, value) {
      if (!value) {
        value = CIRCLE_DEFAULTS.strokeColor;
      }

      assert('g-map-circle `strokeColor` is a String', typeof value === 'string');

      this.content.setOptions({strokeColor: value});
      return value;
    }
  }),

  /**
   * @type {Number}
   * The stroke opacity between 0.0 and 1.0
   */
  strokeOpacity: computed({
    get() {
      return this.content.strokeOpacity;
    },

    set(key, value) {
      if (!value && value !== 0) {
        value = CIRCLE_DEFAULTS.strokeOpacity; // reset
      }

      assert('g-map-circle `strokeOpacity` is a Number', typeof value === 'number');
      assert('g-map-circle `strokeOpacity` is not greater than 1', value <= 1);
      assert('g-map-circle `strokeOpacity` is not less than 0', value >= 0);

      this.content.setOptions({strokeOpacity: value});
      return value;
    }
  }),

  /**
   * @type {String}
   * The stroke position.
   */
  strokePosition: computed({
    get() {
      return getStrokePosition(this.content.strokePosition);
    },

    set(key, value) {
      if (!value) { value = CIRCLE_DEFAULTS.strokePosition; } // reset

      assert('g-map-circle `strokePosition` is a String', typeof value === 'string');

      const id = getStrokePositionId(value);

      assert('g-map-circle `strokePosition` is a valid stroke position', typeof id === 'number');

      this.content.setOptions({strokePosition: id});
      return value;
    }
  }),

  /**
   * @type {Number|Undefined}
   * The stroke width in pixels.
   */
  strokeWeight: computed({
    get() {
      return this.content.strokeWeight;
    },

    set(key, value) {
      if (!value) { value = 0; } // remove

      assert('g-map-circle `strokeWeight` is a Number', typeof value === 'number');

      this.content.setOptions({strokeWeight: value});
      return value;
    }
  }),

  /**
   * @type {Boolean}
   * Whether this circle is visible on the map.
   */
  visible: computed({
    get() {
      return this.content.getVisible();
    },

    set(key, value) {
      if (!value) { value = false; } // remove

      assert('g-map-circle `visible` is a Boolean', typeof value === 'boolean');

      this.content.setVisible(value);
      return value;
    }
  }),

  /**
  * @type {Number|Undefined}
  * The zIndex compared to other polys.
  */
  zIndex: computed({
    get() {
      return this.content.zIndex;
    },

    set(key, value) {
      if (!value && value !== 0) {
        this.content.setOptions({zIndex: null}); // remove
        return;
      }

      assert('g-map-circle `zIndex` is a Number', typeof value === 'number');
      assert('g-map-circle `zIndex` is a Whole Number', value % 1 === 0);

      this.content.setOptions({zIndex: value});
      return value;
    }
  })
});

/**
 * @param  {Map}    canvas   Google Maps' Map
 * @param  {Object} options  Circle instance defaults (requires center, radius)
 * @return {ObjectProxy}  Ember.ObjectProxy instance
 * Render a new Google Map Circle on a canvas with the given options
 * and return its' Google Map Center Proxy instance
 */
export default function googleMapCircle(map, options = {}) {
  assert('Google Map Circle requires a Google Map instance', map instanceof google.maps.Map);
  assert('Google Map Circle requires a center', options.center);
  assert('Google Map Circle requires a radius', options.radius);

  const proxy = GoogleMapCircleProxy.create({
    content: new google.maps.Circle({map})
  });

  const settings = assign({}, CIRCLE_DEFAULTS);
  assign(settings, options);

  // Set defaults via proxy API
  Object.keys(settings).forEach((key) =>
    proxy.set(key, settings[key]));

  return proxy;
}

/**
 * @param  {String} path   Stroke position
 * @return {Number}        Stroke position id
 * Get the id of a preconfigured stroke position by name
 */
export function getStrokePositionId(position) {
  position = `${position}`.toUpperCase();
  return google.maps.StrokePosition[position];
}

/**
 * @param  {Number} id Stroke position id
 * @return {String}    Stroke position
 * Get a name of a preconfigured stroke position from its' id value
 */
export function getStrokePosition(id) {
  id = parseInt(id, 10);
  return Object.keys(google.maps.StrokePosition).filter((position) =>
    google.maps.StrokePosition[position] === id)[0];
}
