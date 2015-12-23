import Ember from 'ember';

const { observer } = Ember;

export default Ember.Mixin.create({

  /**
   * [observer for component attribute's `scaleControl` updates]
   * @param  {Boolean} 'isMapLoaded'
   * @param  {[Boolean]}  'scaleControl'
   * @return {[Boolean]} [returns false if map not updated]
   */
  _bindScaleControlToMap: observer('isMapLoaded', 'scaleControl', function() {
    if (!this.get('isMapLoaded')) {
      return false;
    }

    this.get('map.map').setOptions({
      scaleControl: (this.get('scaleControl') ? true : false)
    });
  })
});
