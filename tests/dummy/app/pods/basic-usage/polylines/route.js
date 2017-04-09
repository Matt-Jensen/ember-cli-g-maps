import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import {A} from 'ember-array/utils';
import {assign} from 'ember-platform';

import DocumentationHelpers from '../../../mixins/documentation-actions';

export default Route.extend(DocumentationHelpers, {
  actions: {
    upsert_at(i, path, altPath) {
      const {controller} = this;

      if (altPath) {
        path = altPath;
      }

      if (typeof i === 'number') {
        set(controller, 'options.path', A(path));
      }
    },

    remove_at(i/*, path*/) {
      const {controller} = this;

      if (typeof i === 'number') {
        get(controller, 'options.path').removeAt(i);
      }
    },

    /**
     * Move map center to polygon center
     */
    mouseup(e/*, path*/) {
      const {controller} = this;

      /*
       * Accpetance tests events don't provide a Mouse event
       */
      if (e) {
        const path = getPathAverage(
          get(controller, 'options.path').toArray()
        );
        set(controller, 'lat', path.lat);
        set(controller, 'lng', path.lng);
      }
    },

    addVertex() {
      const {controller} = this;
      const path = get(controller, 'options.path');
      const [start, end] = getRandomEdge(path);
      const vertex = getPathAverage([path[start], path[end]]);

      if (start < end) {
        path.insertAt(end, vertex);
      } else {
        path.pushObject(vertex);
      }
    },

    removeVertex() {
      const {controller} = this;
      get(controller, 'options.path').removeAt(0);
    },

    toggleColor(option) {
      const {controller} = this;
      const hasColor = Boolean(get(controller, `options.${option}`));
      set(controller, `options.${option}`, hasColor ? false : controller.polylineDefaults[option]);
      controller.notifyPropertyChange('options');
    },

    appendCustomIcon() {
      const {controller} = this;
      const path = get(controller, 'options.path');
      const icons = get(controller, 'options.icons');

      if (icons.length >= path.length) {
        return;
      }

      icons.pushObject({icon: {path: 'FORWARD_OPEN_ARROW'}});
      controller.notifyPropertyChange('options');
    },

    unappendCustomIcon() {
      const {controller} = this;
      const icons = get(controller, 'options.icons');

      if (icons.length === 0) {
        return;
      }

      icons.removeAt(icons.length - 1);
      controller.notifyPropertyChange('options');
    },

    resetMapState() {
      const {controller} = this;
      set(controller, 'lat', controller.mapDefaults.lat);
      set(controller, 'lng', controller.mapDefaults.lng);
      set(controller, 'zoom', controller.mapDefaults.zoom);
      set(controller, 'options', assign({}, controller.polylineDefaults));
    }
  }
});

function getRandomEdge(path) {
  const start = Math.round(Math.random() * (path.length - 1));
  const end = path[start + 1] ? start + 1 : 0;
  return [start, end];
}

function getPathAverage(path) {
  return path.reduce((coord1, coord2) =>
    ({lat: (coord1.lat + coord2.lat) / 2, lng: (coord1.lng + coord2.lng) / 2}));
}
