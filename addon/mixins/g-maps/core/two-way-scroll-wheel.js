import Ember from 'ember';

const { observer } = Ember;

export default Ember.Mixin.create({

  /**
   * [observer for component attribute's `scrollwheel` updates]
   * @param  {Boolean} 'isMapLoaded'
   * @param  {[Boolean]}  'scrollwheel'
   * @return {[Boolean]} [returns false if map not updated]
   */
  _bindScrollwheelToMap: observer('isMapLoaded', 'scrollwheel', function() {
    if (!this.get('isMapLoaded')) {
      return false;
    }

    this.get('map.map').setOptions({
      scrollwheel: (this.get('scrollwheel') ? true : false)
    });
  }),
});
