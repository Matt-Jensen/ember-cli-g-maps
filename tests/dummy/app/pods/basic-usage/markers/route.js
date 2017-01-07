import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import {assign} from 'ember-platform';

import DocumentationHelpers from '../../../mixins/documentation-actions';

const MAP_DEFAULTS = {
  lat: 30.2672,
  lng: -97.74310000000003
};

const MARKER_DEFAULTS = {
  lat: MAP_DEFAULTS.lat,
  lng: MAP_DEFAULTS.lng,
  animation: 'BOUNCE',
  clickable: true,
  crossOnDrag: true,
  cursor: 'default',
  draggable: true,
  icon: undefined,
  label: undefined,
  opacity: 1,
  optimized: false,
  shape: {
    type: 'circle',
    coords: [0, 0, 100]
  },
  title: undefined,
  visible: true,
  zIndex: 10
};

export default Route.extend(DocumentationHelpers, {
  setupController(controller, googleMaps) {
    this._super(...arguments);

    controller.setProperties({
      lat: MAP_DEFAULTS.lat,
      lng: MAP_DEFAULTS.lng,
      zoom: 6,

      useOptions: false,

      options: assign({}, MARKER_DEFAULTS),
      animations: Object.keys(googleMaps.Animation),
      symbolPaths: Object.keys(googleMaps.SymbolPath),

      shapes: {
        circle: [0, 0, 100],
        poly: [-100, -100, 100, -100, 100, 100, 80, 120, -100, 100],
        rect: [1000, 1000, -1000, -1000]
      }
    });
  },

  actions: {
    setAnimation(animation) {
      const {controller} = this;
      set(controller, 'options.animation', animation);
      controller.notifyPropertyChange('options');
    },

    toggleCustomMarker() {
      const {controller} = this;
      const hasCustomIcon = Boolean(get(controller, 'options.icon'));
      set(controller, 'options.icon', hasCustomIcon ? false : {
        url: 'beachflag.png',
        anchor: {x: 1, y: 30},
        size: {width: 20, height: 75}
      });
      controller.notifyPropertyChange('options');
    },

    toggleAnchorPoint() {
      const {controller} = this;
      const hasAnchorPoint = Boolean(get(controller, 'options.anchorPoint'));
      set(controller, 'options.anchorPoint', hasAnchorPoint ? false : {x: 10, y: 10});
      controller.notifyPropertyChange('options');
    },

    toggleLabel() {
      const {controller} = this;
      const hasLabel = Boolean(get(controller, 'options.label'));
      set(controller, 'options.label', hasLabel ? false : 'It\'s Remarkable');
      controller.notifyPropertyChange('options');
    },

    toggleTitle() {
      const {controller} = this;
      const hasTitle = Boolean(get(controller, 'options.title'));
      set(controller, 'options.title', hasTitle ? false : 'Nice rollover');
      controller.notifyPropertyChange('options');
    },

    setShapeType(type) {
      const {controller} = this;

      if (!type) {
        set(controller, 'options.shape', false);
      } else {
        set(controller, 'options.shape', {
          type,
          coords: get(controller, `shapes.${type}`)
        });
      }

      controller.notifyPropertyChange('options');
    },

    /**
     * Move map center to marker position
     */
    mouseup(e) {
      const {controller} = this;

      /*
       * Accpetance tests events don't provide a Mouse event
       */
      if (e) {
        set(controller, 'lat', e.latLng.lat());
        set(controller, 'lng', e.latLng.lng());
      }
    },

    /**
     * Update Marker position state
     */
    drag(e) {
      const {controller} = this;

      /*
       * Accpetance tests events don't provide a Mouse event
       */
      if (e) {
        set(controller, 'options.lat', e.latLng.lat());
        set(controller, 'options.lng', e.latLng.lng());
        controller.notifyPropertyChange('options');
      }
    },

    resetMapState() {
      this.controller.set('options', MARKER_DEFAULTS);
    }
  }
});
