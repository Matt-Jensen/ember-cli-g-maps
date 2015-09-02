/* globals google */
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

        const mapItem = { 
          name: name, 
          onLoad: new Ember.RSVP.Promise((resolve) => {
            google.maps.event.addListenerOnce(map, 'idle', resolve);
          })
        };

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
  })()
});
