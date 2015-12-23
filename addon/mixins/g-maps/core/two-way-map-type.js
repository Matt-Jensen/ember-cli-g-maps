import Ember from 'ember';

const { observer } = Ember;

export default Ember.Mixin.create({

  /**
   * [observer for component attribute's `mapType` updates]
   * @param  {Boolean} 'isMapLoaded'
   * @param  {[String]}  'mapType'
   * @return {[Boolean]} [returns false if map not updated]
   */
  _bindMapTypeToMap: observer('isMapLoaded', 'mapType', function() {
    if (!this.get('isMapLoaded')) {
      return false;
    }

    const googleMapInstance = this.get('map.map');
    const mapType = `${this.get('mapType')}`;

    // If invalid mapType
    if (google.maps.MapTypeId[mapType.toUpperCase()] === undefined) {
      return false;
    }

    // If mapType in sync
    if (mapType.toLowerCase() === googleMapInstance.getMapTypeId()) {
      return false;
    }

    // Update map
    googleMapInstance.setMapTypeId( google.maps.MapTypeId[mapType.toUpperCase()] );
  }),
});
