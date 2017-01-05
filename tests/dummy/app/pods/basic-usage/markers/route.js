import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import {assign} from 'ember-platform';
import run from 'ember-runloop';

import DocumentationHelpers from '../../../mixins/documentation-actions';

const MAP_DEFAULTS = {
  lat: 30.2672,
  lng: -97.74310000000003,
  zoom: 6
};

const CUSTOM_ICON = {
  url: 'beachflag.png',
  anchor: {x: 1, y: 30},
  size: {width: 20, height: 75}
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
  label: 'It\'s Remarkable',
  opacity: 1,
  optimized: false,
  shape: undefined,
  title: 'Nice rollover',
  visible: true,
  zIndex: 10
};

const ANIMATIONS = [
  'BOUNCE',
  'DROP',
  'So',
  'Uo'
];

export default Route.extend(DocumentationHelpers, {
  setupController(controller) {
    controller.setProperties({
      lat: MAP_DEFAULTS.lat,
      lng: MAP_DEFAULTS.lng,
      zoom: MAP_DEFAULTS.zoom,

      options: assign({}, MARKER_DEFAULTS),
      animations: ANIMATIONS,

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
      set(controller, 'options.icon', hasCustomIcon ? false : CUSTOM_ICON);
      controller.notifyPropertyChange('options');
    },

    toggleLabel() {
      const {controller} = this;
      const hasLabel = Boolean(get(controller, 'options.label'));
      set(controller, 'options.label', hasLabel ? false : MARKER_DEFAULTS.label);
      controller.notifyPropertyChange('options');
    },

    toggleTitle() {
      const {controller} = this;
      const hasTitle = Boolean(get(controller, 'options.title'));
      set(controller, 'options.title', hasTitle ? false : MARKER_DEFAULTS.title);
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

    syncMapCenter() {
      const {controller} = this;
      set(controller, 'lat', get(controller, 'options.lat'));
      set(controller, 'lng', get(controller, 'options.lng'));
    },

    /**
     * Move map center to marker position
     */
    mouseup(e) {
      const {controller} = this;
      set(controller, 'lat', e.latLng.lat());
      set(controller, 'lng', e.latLng.lng());
    },

    /**
     * Update Marker position state
     */
    drag(e) {
      const {controller} = this;
      set(controller, 'options.lat', e.latLng.lat());
      set(controller, 'options.lng', e.latLng.lng());
      controller.notifyPropertyChange('options');
    }
  }
});
