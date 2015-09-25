/* globals google: true */
import Ember from 'ember';

export default Ember.Service.extend({
  maps: (function() {
    const maps = Ember.A([]);

    return {
      select(name) {
        for(let i = 0, l = maps.length; i < l; i++) {
          if(maps[i].name === name){ return maps[i]; }
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
          reject({ status, message: result.error_message });
        }
      };
      GMaps.prototype.geocode(options);
    });
  }
});
