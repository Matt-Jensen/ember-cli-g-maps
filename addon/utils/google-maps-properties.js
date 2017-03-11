import computed from 'ember-computed';
import {assert} from 'ember-metal/utils';
import {isPresent} from 'ember-utils';

export default {
  /**
   * @type {Object}
   */
  center: computed({
    get() {
      const latLng = this.content.getCenter();
      return {lat: latLng.lat(), lng: latLng.lng()};
    },

    set(key, value) {
      assert(`${this.name} "center" is an Object`, typeof value === 'object');

      const {lat, lng} = value;

      assert(`${this.name} "center.lat" is a Number`, typeof lat === 'number' && lat === lat);
      assert(`${this.name} "center.lng" is a Number`, typeof lng === 'number' && lng === lng);

      this.content.setCenter(value);
      return this.get('center');
    }
  }).volatile(),

  /**
   * @type {Boolean}
   */
  clickable: computed({
    get() {
      const {clickable} = this.content;
      return isPresent(clickable) ? clickable : this.defaults.clickable;
    },

    set(key, value) {
      if (!value) { value = false; } // remove

      assert(`${this.name} "clickable" is a Boolean`, typeof value === 'boolean');

      this.content.setOptions({clickable: value});
      return value;
    }
  }),

  /**
   * @type {Boolean}
   */
  draggable: computed({
    get() {
      const {draggable} = this.content;
      return isPresent(draggable) ? draggable : this.defaults.draggable;
    },

    set(key, value) {
      if (!value) { value = false; } // remove

      assert(`${this.name} "draggable" is a Boolean`, typeof value === 'boolean');

      this.content.setOptions({draggable: value});
      return value;
    }
  }),

  /**
   * @type {Boolean}
   */
  editable: computed({
    get() {
      const {editable} = this.content;
      return isPresent(editable) ? editable : this.defaults.editable;
    },

    set(key, value) {
      if (!value) { value = false; } // remove

      assert(`${this.name} "editable" is a Boolean`, typeof value === 'boolean');

      this.content.setOptions({editable: value});
      return value;
    }
  }),

  /**
   * @type {String|Undefined}
   */
  fillColor: computed({
    get() {
      const {fillColor} = this.content;
      return isPresent(fillColor) ? fillColor : this.defaults.fillColor;
    },

    set(key, value) {
      if (!value) {
        value = this.defaults.fillColor; // reset
      }

      assert(`${this.name} "fillColor" is a String`, typeof value === 'string');

      this.content.setOptions({fillColor: value});
      return value;
    }
  }),

  /**
   * @type {Number}
   */
  fillOpacity: computed({
    get() {
      const {fillOpacity} = this.content;
      return isPresent(fillOpacity) ? fillOpacity : this.defaults.fillOpacity;
    },

    set(key, value) {
      if (!value && value !== 0) {
        value = this.defaults.fillOpacity; // reset
      }

      assert(`${this.name} "fillOpacity" is a Number`, typeof value === 'number');
      assert(`${this.name} "fillOpacity" is not greater than 1`, value <= 1);
      assert(`${this.name} "fillOpacity" is not less than 0`, value >= 0);

      this.content.setOptions({fillOpacity: value});
      return value;
    }
  }),

  /**
   * @type {Boolean}
   */
  geodesic: computed({
    get() {
      const {geodesic} = this.content;
      return isPresent(geodesic) ? geodesic : this.defaults.geodesic;
    },

    set(key, value) {
      if (!value) { value = false; } // remove

      assert(`${this.name} "geodesic" is a Boolean`, typeof value === 'boolean');

      this.content.setOptions({geodesic: value});
      return value;
    }
  }),

  /**
   * @type {Number}
   */
  opacity: computed({
    get() {
      const {opacity} = this.content;
      return isPresent(opacity) ? opacity : this.defaults.opacity;
    },

    set(key, value) {
      if (!value && value !== 0) {
        value = this.defaults.opacity; // reset
      }

      assert(`${this.name} "opacity" is a Number`, typeof value === 'number');
      assert(`${this.name} "opacity" is not greater than 1`, value <= 1);
      assert(`${this.name} "opacity" is not less than 0`, value >= 0);

      this.content.setOptions({opacity: value});
      return value;
    }
  }),

  /**
   * @type {String|Undefined}
   */
  strokeColor: computed({
    get() {
      const {strokeColor} = this.content;
      return isPresent(strokeColor) ? strokeColor : this.defaults.strokeColor;
    },

    set(key, value) {
      if (!value) {
        value = this.defaults.strokeColor;
      }

      assert(`${this.name} "strokeColor" is a String`, typeof value === 'string');

      this.content.setOptions({strokeColor: value});
      return value;
    }
  }),

  /**
   * @type {Number}
   */
  strokeOpacity: computed({
    get() {
      const {strokeOpacity} = this.content;
      return isPresent(strokeOpacity) ? strokeOpacity : this.defaults.strokeOpacity;
    },

    set(key, value) {
      if (!value && value !== 0) {
        value = this.defaults.strokeOpacity; // reset
      }

      assert(`${this.name} "strokeOpacity" is a Number`, typeof value === 'number');
      assert(`${this.name} "strokeOpacity" is not greater than 1`, value <= 1);
      assert(`${this.name} "strokeOpacity" is not less than 0`, value >= 0);

      this.content.setOptions({strokeOpacity: value});
      return value;
    }
  }),

  /**
   * @type {String}
   */
  strokePosition: computed({
    get() {
      return isPresent(this.content.strokePosition) ? getStrokePosition(this.content.strokePosition) : this.defaults.strokePosition;
    },

    set(key, value) {
      if (!value) {
        value = this.defaults.strokePosition; // reset
      }

      assert(`${this.name} "strokePosition" is a String`, typeof value === 'string');

      const id = getStrokePositionId(value);

      assert(`${this.name} "strokePosition" is a valid stroke position`, typeof id === 'number');

      this.content.setOptions({strokePosition: id});
      return value;
    }
  }),

  /**
   * @type {Number}
   */
  strokeWeight: computed({
    get() {
      const {strokeWeight} = this.content;
      return isPresent(strokeWeight) ? strokeWeight : this.defaults.strokeWeight;
    },

    set(key, value) {
      if (!value && value !== 0) {
        value = this.defaults.strokeWeight; // reset
      }

      assert(`${this.name} "strokeWeight" is a Number`, typeof value === 'number');

      this.content.setOptions({strokeWeight: value});
      return value;
    }
  }),

  /**
   * @type {Boolean}
   */
  visible: computed({
    get() {
      const {visible} = this.content;
      return isPresent(visible) ? visible : this.defaults.visible;
    },

    set(key, value) {
      if (!value) { value = false; }

      assert(`${this.name} "visible" is a Boolean`, typeof value === 'boolean');

      this.content.setOptions({visible: value});
      return value;
    }
  }),

  /**
   * @type {Number|Undefined}
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

      assert(`${this.name} "zIndex" is a Number`, typeof value === 'number');
      assert(`${this.name} "zIndex" is a Whole Number`, value % 1 === 0);

      this.content.setOptions({zIndex: value});
      return value;
    }
  })
};

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
