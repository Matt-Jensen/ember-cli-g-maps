import Ember from 'ember';

const { observer } = Ember;

export default Ember.Mixin.create({

  /**
   * [observer for component attribute's `styles` updates]
   * @param  {Boolean} 'isMapLoaded'
   * @param  {[Boolean]}  'styles'
   * @return {[Boolean]} [returns false if map not updated]
   */
  _bindStylesToMap: observer('isMapLoaded', 'styles', function() {
    if (!this.get('isMapLoaded')) {
      return false;
    }

    this.get('map.map').setOptions({
      styles: this.get('styles')
    });
  }),
});
