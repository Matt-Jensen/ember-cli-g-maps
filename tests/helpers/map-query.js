import run from 'ember-runloop';
import {assert} from 'ember-metal/utils';

const instanceSelectors = {
  polyline: '__GOOGLE_MAP_POLYLINES__'
};

const mapQuery = function mapQuery(instanceName, selector = '.ember-cli-g-map') {
  const element = find(selector);
  const instanceSelector = instanceSelectors[instanceName];

  assert('mapQuery found g-map instance', element.length);
  assert('mapQuery has instance selector', instanceSelector);
  assert(`mapQuery has instance(s) of ${instanceName}`, element.get(0)[instanceSelector]);

  const [instance] = element.get(0)[instanceSelector];

  return Object.create(mapQuery.prototype, {_instance: {value: instance}});
};

mapQuery.prototype = {
  /**
   * @param  {String} eventName
   * Trigger a given event on a Google Map instance
   */
  trigger(eventName) {
    let target = this._instance;

    if (eventName === 'remove_at' || eventName === 'set_at' || eventName === 'insert_at') {
      target = target.getPath();
    }

    run(() => google.maps.event.trigger(target, eventName));
  },

  /**
   * @param {String} option    Google Maps Polyline option
   * @return {any}
   * Return an option value from google map instance
   */
  getOption(option) {
    let target = this._instance;

    if (option === 'path') {
      // Convert MVCArray[<LatLng>] to [{lat, lng}]
      return target.getPath().getArray().map((ll) => ll.toJSON());
    }

    return target[option];
  },

  /**
   * @return {Object} Google Map State
    * Return current map state of all properties
   */
  getState(options = []) {
    const state = Object.create(null);

    options.forEach((option) =>
      state[option] = this.getOption(option));

    return state;
  }
};

export default mapQuery;
