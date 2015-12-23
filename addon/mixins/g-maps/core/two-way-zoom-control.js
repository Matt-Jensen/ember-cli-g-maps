import Ember from 'ember';

const { observer } = Ember;

export default Ember.Mixin.create({

  /**
   * [observer for component attribute's `showZoomControl` updates]
   * @param  {Boolean} 'isMapLoaded'
   * @param  {[Boolean]}  'showZoomControl'
   * @return {[Boolean]} [returns false if map not updated]
   */
  _bindZoomControlToMap: observer('isMapLoaded', 'showZoomControl', function() {
    if (!this.get('isMapLoaded')) {
      return false;
    }

    this.get('map.map').setOptions({
      zoomControl: (this.get('showZoomControl') ? true : false)
    });
  })
});
