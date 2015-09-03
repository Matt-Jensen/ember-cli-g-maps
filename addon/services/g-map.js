/* globals google: true */
import Ember from 'ember';

export default Ember.Service.extend({
  maps: (function() {
    const maps = Ember.A([]);

    return {

      // TODO: remove for 0.4.0 release
      select(name) {
        for(let i = 0, l = maps.length; i < l; i++) {
          if(maps[i].name === name){ return maps[i]; }
        }
        return undefined;
      },

      // TODO: remove for 0.4.0 release
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

      // TODO: remove for 0.4.0 release
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
  })()
});
