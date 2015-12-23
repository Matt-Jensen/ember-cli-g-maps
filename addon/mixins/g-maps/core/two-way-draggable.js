import Ember from 'ember';

const { observer } = Ember;

export default Ember.Mixin.create({

  /**
   * [observer for component attribute's `draggable` updates]
   * @param  {Boolean} 'isMapLoaded'
   * @param  {[Boolean]}  'draggable'
   * @return {[Boolean]} [returns false if map not updated]
   */

  _bindDraggableToMap: observer('isMapLoaded', 'draggable', function() {
    if (!this.get('isMapLoaded')) {
      return false;
    }

    this.get('map.map').setOptions({
      draggable: (this.get('draggable') ? true : false)
    });
  })
});
