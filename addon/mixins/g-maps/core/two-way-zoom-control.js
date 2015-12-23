import Ember from 'ember';

const { observer } = Ember;

export default Ember.Mixin.create({

  /**
   * [observer for component attribute's `zoomControl` updates]
   * @param  {Boolean} 'isMapLoaded'
   * @param  {[Boolean]}  'zoomControl'
   * @return {[Boolean]} [returns false if map not updated]
   */
  _bindZoomControlToMap: observer('isMapLoaded', 'zoomControl', function() {
    if (!this.get('isMapLoaded')) {
      return false;
    }

    this.get('map.map').setOptions({
      zoomControl: (this.get('zoomControl') ? true : false)
    });
  })
});
