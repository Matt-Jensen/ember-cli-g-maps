import Ember from 'ember';
import WeakMap from 'ember-weakmap/weak-map';

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

  autocompletes: Ember.computed({
    get() {
      return new WeakMap();
    }
  }),

  setupAutocomplete({input, component, callback}) {
    // setup input field using Google Maps API
    // setup event binding for when autocomplete
    // trigger callback on component when on autocomplete
    // unregister
    let autocompletes = this.get('autocompletes');

    let autocomplete = new google.maps.places.Autocomplete(input);
    let listener = autocomplete.addListener('place_changed', Ember.run.bind(this, ()=>{
      let place = autocomplete.getPlace();
      this.notifyAutocomplete(component, callback, place);
    }));

    autocompletes.set(component, {autocomplete, listener});
  },

  notifyAutocomplete(component, callback, place) {
    callback.call(component, place);
  },

  teardownAutocomplete(component) {
    let autocompletes = this.get('autocompletes');
    let { autocomplete, listener } = autocompletes.get(component);

    google.maps.event.removeListener(listener);
    google.maps.event.clearInstanceListeners(autocomplete);

    autocompletes.delete(component);
  }
});
