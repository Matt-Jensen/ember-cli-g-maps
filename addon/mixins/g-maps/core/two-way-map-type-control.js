import Ember from 'ember';

const { observer } = Ember;

export default Ember.Mixin.create({

  /**
   * [observer for component attribute's `mapTypeControl` updates]
   * @param  {Boolean} 'isMapLoaded'
   * @param  {[Boolean]}  'mapTypeControl'
   * @return {[Boolean]} [returns false if map not updated]
   */
  _bindMapTypeControlToMap: observer('isMapLoaded', 'mapTypeControl', function() {
    if (!this.get('isMapLoaded')) {
      return false;
    }

    this.get('map.map').setOptions({
      mapTypeControl: (this.get('mapTypeControl') ? true : false)
    });
  })
});
