import Mixin from 'ember-metal/mixin';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import {assert} from 'ember-metal/utils';
import run from 'ember-runloop';
import loadGoogleMaps from 'ember-cli-g-maps/utils/load-google-maps';

const CSS_CURSORS = ['default', 'pointer', 'crosshair', 'alias', 'move', 'zoom-in', 'grab'];
const CONTROL_POSITIONS = ['BOTTOM_CENTER', 'BOTTOM_LEFT', 'BOTTOM_RIGHT', 'LEFT_BOTTOM', 'LEFT_CENTER', 'LEFT_TOP', 'RIGHT_BOTTOM', 'RIGHT_CENTER', 'RIGHT_TOP', 'TOP_CENTER', 'TOP_LEFT', 'TOP_RIGHT'];
const GESTURE_HANDLERS = ['cooperative', 'greedy', 'none', 'auto'];
const MAP_TYPE_CONTROL_STYLES = ['DEFAULT', 'DROPDOWN_MENU', 'HORIZONTAL_BAR'];
const SCALE_CONTROL_STYLES = ['DEFAULT'];

export default Mixin.create({
  model() {
    this._super(...arguments);
    set(this, '_toggledColors', Object.create(null));
    return loadGoogleMaps();
  },

  /**
   * Cache colored options from `toggleColor`
   * @type {Object}
   */
  _toggledColors: Object.create(null),

  actions: {
    setToNext(scope, type) {
      const {controller} = this;
      const current = controller.get(`options.${scope}`);
      let model;

      if (type === 'cursor') {
        model = CSS_CURSORS;
      } else if (type === 'position') {
        model = CONTROL_POSITIONS;
      } else if (type === 'gesture') {
        model = GESTURE_HANDLERS;
      } else if (type === 'mapTypeControlStyles') {
        model = MAP_TYPE_CONTROL_STYLES;
      } else if (type === 'scaleControlStyles') {
        model = SCALE_CONTROL_STYLES;
      }

      assert('set to next type was invalid', model);
      const next = model[model.indexOf(current) + 1] || model[0];

      controller.set(`options.${scope}`, next);
      controller.notifyPropertyChange('options');
      controller.notifyPropertyChange(`options.${scope.split('.')[0]}`);
    },

    toggleOption(scope) {
      const {controller} = this;
      const current = controller.get(`options.${scope}`);
      controller.set(`options.${scope}`, !current);
      controller.notifyPropertyChange('options');
    },

    setOption(scope, value) {
      const {controller} = this;
      controller.set(`options.${scope}`, value);
      controller.notifyPropertyChange('options');
    },

    increment(option, by = 1) {
      const {controller} = this;
      const value = controller.get(`options.${option}`) + by;
      controller.set(`options.${option}`, value);
      controller.notifyPropertyChange('options');
    },

    decrement(option, by = 1) {
      const {controller} = this;
      const value = controller.get(`options.${option}`) - by;
      controller.set(`options.${option}`, value);
      controller.notifyPropertyChange('options');
    },

    registerEvent(eventName) {
      const {controller} = this;

      const isEvent = `is${eventName}`;
      const toEvent = `${eventName}to`;
      const wasEvent = `was${eventName}`;

      set(controller, isEvent, true);
      set(controller, wasEvent, true);

      if (get(this, toEvent)) {
        window.clearTimeout(get(this, toEvent));
      }

      set(this, toEvent, window.setTimeout(() => this._debounceRemove(isEvent), 300));
    },

    syncMapCenter() {
      const {controller} = this;
      set(controller, 'lat', get(controller, 'options.lat'));
      set(controller, 'lng', get(controller, 'options.lng'));
    },

    toggleColor(option) {
      const {controller} = this;

      // Cache original color
      if (!get(this, `_toggledColors.${option}`)) {
        set(this, `_toggledColors.${option}`, get(controller, `options.${option}`));
      }

      const hasColor = Boolean(get(controller, `options.${option}`));
      set(controller, `options.${option}`, hasColor ? false : get(this, `_toggledColors.${option}`));
      controller.notifyPropertyChange('options');
    }
  },

  _debounceRemove(event) {
    const {controller} = this;

    run(() => {
      if (controller.isDestroyed === false) {
        set(controller, event, false);
      }
    });
  }
});
