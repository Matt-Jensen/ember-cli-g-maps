import Component from 'ember-component';
import set from 'ember-metal/set';
import { default as get, getProperties } from 'ember-metal/get';
import computed from 'ember-computed';

import googleMap from 'ember-cli-g-maps/google-map';
import loadGoogleMaps from 'ember-cli-g-maps/utils/load-google-maps';
import layout from 'ember-cli-g-maps/templates/components/g-map';

const GMAP_DEFAULTS = {
  lat: 30.2672,
  lng: 97.7431
};

// const GOOGLE_MAP_EVENTS = [
//   'bounds_changed',
//   'center_changed',
//   'click',
//   'dblclick',
//   'drag',
//   'dragend',
//   'dragstart',
//   'heading_changed',
//   'idle',
//   'maptypeid_changed',
//   'mousemove',
//   'mouseout',
//   'mouseover',
//   'projection_changed',
//   'resize',
//   'rightclick',
//   'tilesloaded',
//   'tilt_changed',
//   'zoom_changed'
// ];

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

export default Component.extend({
  layout,

  /**
   * @type {Ember.ObjectProxy}
   * Proxy wrapper for the Google Map instance
   */
  _map: null,

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
      set(this, '_map', googleMap(canvas, options));

      // TODO trigger resize on the map when the div changes size
      // google.maps.event.trigger(map.content, 'resize')
    });
  }
});
