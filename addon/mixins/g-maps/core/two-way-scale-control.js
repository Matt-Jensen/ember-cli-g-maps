import Ember from 'ember';

const { observer } = Ember;

export default Ember.Mixin.create({

  /**
   * [observer for component attribute's `showScaleControl` updates]
   * @param  {Boolean} 'isMapLoaded'
   * @param  {[Boolean]}  'showScaleControl'
   * @return {[Boolean]} [returns false if map not updated]
   */
  _bindScaleControlToMap: observer('isMapLoaded', 'showScaleControl', function() {
    if (!this.get('isMapLoaded')) {
      return false;
    }

    this.get('map.map').setOptions({
      scaleControl: (this.get('showScaleControl') ? true : false)
    });
  })
});
