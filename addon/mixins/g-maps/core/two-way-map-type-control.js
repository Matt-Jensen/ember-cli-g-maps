import Ember from 'ember';

const { observer } = Ember;

export default Ember.Mixin.create({

  /**
   * [observer for component attribute's `showMapTypeControl` updates]
   * @param  {Boolean} 'isMapLoaded'
   * @param  {[Boolean]}  'showMapTypeControl'
   * @return {[Boolean]} [returns false if map not updated]
   */
  _bindMapTypeControlToMap: observer('isMapLoaded', 'showMapTypeControl', function() {
    if (!this.get('isMapLoaded')) {
      return false;
    }

    this.get('map.map').setOptions({
      mapTypeControl: (this.get('showMapTypeControl') ? true : false)
    });
  })
});
