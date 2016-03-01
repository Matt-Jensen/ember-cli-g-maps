import Ember from 'ember';

const {
  get,
  typeOf,
  computed
} = Ember;

export default Ember.Service.extend({
  maps: (function() {
    const maps = Ember.A([]);

    return {
      select(name) {
        for(let i = 0, l = maps.length; i < l; i++) {
          if(maps[i].name === name){
            return maps[i];
          }
        }
        return undefined;
      },

      add(name, map) {
        if(typeof name !== 'string') {
          throw new Error('GMap name must be a string');
        }

        if(this.select(name)) {
          throw new Error('GMap name is taken, select a new GMap name');
        }

        const mapItem = { name: name };

        // Using accessor property to avoid calling warning via `service.add`
        Object.defineProperty(mapItem, 'onLoad', {
          get: function() {
            return new Ember.RSVP.Promise((resolve) => {
              google.maps.event.addListenerOnce(map, 'idle', () => {
                Ember.Logger.warn('gMaps service onLoad has been deprecated, please use the component\'s `loaded` action instead.');
                resolve();
              });
            });
          }
        });

        maps.pushObject(mapItem);

        return mapItem;
      },

      remove(name) {
        for(let i = 0, l = maps.length; i < l; i++) {
          if(maps[i].name === name){
            maps.removeAt(i);
            return true;
          }
        }
        return false;
      }
    };
  })(),

  geocode(options) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      options.callback = function(result, status) {
        if (status === 'OK' || status === 'ZERO_RESULTS') {
          resolve(result);
        } else {
          const err = { status };

          // Add any available error_message
          if(result && result.error_message) {
            err.message = result.error_message;
          }

          reject(err);
        }
      };
      GMaps.prototype.geocode(options);
    });
  },

  /**
   * @private
   * registery for all Google Autocomplete instances
   */
  _autocompletes: computed({
    get() {
      const autocompletes = {};

      return {
        add(item) {
          const id = get(item.component, 'elementId');
          autocompletes[id] = item;
        },
        remove(component) {
          const id = get(component, 'elementId');
          delete autocompletes[id];
        },
        get(component) {
          if (typeOf(component) === 'string') {
            return autocompletes[component];
          }
          const id = get(component, 'elementId');
          return autocompletes[id];
        }
      };
    }
  }),

  /**
   * TODO needs description
   */
  googleAPI: computed({
    get() {
    }
  }),

  /**
   * @public
   * instantiate autocomplete
   * add event listeners
   * setup `_notifyAutocomplete` callback
   * register autocomplete instance
   *
   * @param object {input} DOM input elementId
   * @param object {component} Ember.Component instance
   * @param function {callback} on `place_changed` event callback
   */
  setupAutocomplete({input, component, callback}) {
    const autocomplete = new google.maps.places.Autocomplete(input);
    const listener = autocomplete.addListener('place_changed', Ember.run.bind(this, () => {
      const place = autocomplete.getPlace();
      this._notifyAutocomplete(component, callback, place);
    }));

    // register
    get(this, '_autocompletes').add({component, callback, autocomplete, listener});
  },

  /**
   * @private
   * optionally find autocomplete instance by id
   * invoke callback with `data`
   *
   * @param object|string {component} Ember.Component instance
   * @param function {callback}
   * @param object {data} Google Autocomplete event data
   */
  _notifyAutocomplete(component, callback, data) {
    if (typeOf(component) === 'string') {
      const autocomplete = get(this, '_autocompletes').get(component);
      component = autocomplete.component;
      callback = autocomplete.callback;
    }

    // invoke autocomplete callback
    callback.call(component, data);
  },

  /**
   * @public
   * remove Autocomplete events
   * unregister autocomplete
   *
   * @param string {component} Autocomplete id
   */
  teardownAutocomplete(component) {
    const autocompletes = get(this, '_autocompletes');
    const { autocomplete, listener } = autocompletes.get(component);

    google.maps.event.removeListener(listener);
    google.maps.event.clearInstanceListeners(autocomplete);

    // unregister
    autocompletes.remove(component);
  }
});
