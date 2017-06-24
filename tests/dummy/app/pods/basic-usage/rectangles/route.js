import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import {assign} from 'ember-platform';

import DocumentationHelpers from '../../../mixins/documentation-actions';

export default Route.extend(DocumentationHelpers, {
  actions: {
    updateFirstBound(amount = 0.5) {
      const {controller} = this;
      const bound = get(controller, 'options.bounds.0');

      set(controller, 'options.bounds.0.lat', bound.lat + amount);
      set(controller, 'options.bounds.0.lng', bound.lng + amount);

      get(controller, 'options.bounds').arrayContentDidChange();
    },

    resetMapState() {
      const {controller} = this;
      set(controller, 'lat', controller.mapDefaults.lat);
      set(controller, 'lng', controller.mapDefaults.lng);
      set(controller, 'zoom', controller.mapDefaults.zoom);
      set(controller, 'options', assign({}, controller.rectangleDefaults));
    }
  }
});
