import Ember from 'ember';

const { observer } = Ember;

export default Ember.Mixin.create({

  /**
   * [observer for component attribute's `disableDoubleClickZoom` updates]
   * @param  {Boolean} 'isMapLoaded'
   * @param  {[Boolean]}  'disableDoubleClickZoom'
   * @return {[Boolean]} [returns false if map not updated]
   */
  _bindDisableDoubleClickZoomToMap: observer('isMapLoaded', 'disableDoubleClickZoom', function() {
    if (!this.get('isMapLoaded')) {
      return false;
    }

    this.get('map.map').setOptions({
      disableDoubleClickZoom: (this.get('disableDoubleClickZoom') ? true : false)
    });
  })
});
