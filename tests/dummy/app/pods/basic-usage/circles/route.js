import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import {assign} from 'ember-platform';

import DocumentationHelpers from '../../../mixins/documentation-actions';
import {GOOGLE_CIRCLE_DEFAULTS} from 'ember-cli-g-maps/components/g-map-circle/component';

const MAP_DEFAULTS = {
  lat: 30.2672,
  lng: -97.74310000000003
};

const CIRCLE_DEFAULTS = {
  lat: MAP_DEFAULTS.lat,
  lng: MAP_DEFAULTS.lng,
  radius: 200000,
  clickable: true,
  draggable: true,
  editable: true,
  fillColor: '#D43029',
  fillOpacity: 0.4,
  strokeColor: '#D43029',
  strokeOpacity: 1,
  strokePosition: 'INSIDE',
  strokeWeight: 3,
  visible: true,
  zIndex: 10
};

export default Route.extend(DocumentationHelpers, {
  setupController(controller, googleMaps) {
    controller.setProperties({
      lat: MAP_DEFAULTS.lat,
      lng: MAP_DEFAULTS.lng,
      zoom: 5,
      useOptions: false,
      options: assign({}, CIRCLE_DEFAULTS),
      strokePositions: Object.keys(googleMaps.StrokePosition),
      defaultRadius: GOOGLE_CIRCLE_DEFAULTS.radius
    });
  },

  actions: {
    toggleColor(option) {
      const {controller} = this;
      const hasColor = Boolean(get(controller, `options.${option}`));
      set(controller, `options.${option}`, hasColor ? false : CIRCLE_DEFAULTS[option]);
      controller.notifyPropertyChange('options');
    },

    /**
     * Sync user updates to Circle state
     */
    center_changed(center) {
      const {controller} = this;

      if (center) {
        set(controller, 'options.lat', center.lat);
        set(controller, 'options.lng', center.lng);
      }
    },

    /**
     * Sync user updates to Circle state
     */
    radius_changed(radius) {
      const {controller} = this;

      if(typeof radius === 'number') {
        set(controller, 'options.radius', radius);
      }
    },

    /**
     * Move map center to circle center
     */
    mouseup(e) {
      const {controller} = this;

      /*
       * Accpetance tests events don't provide a Mouse event
       */
      if (e) {
        set(controller, 'lat', get(controller, 'options.lat'));
        set(controller, 'lng', get(controller, 'options.lng'));
      }
    },

    resetMapState() {
      this.controller.set('options', CIRCLE_DEFAULTS);
    }
  }
});
