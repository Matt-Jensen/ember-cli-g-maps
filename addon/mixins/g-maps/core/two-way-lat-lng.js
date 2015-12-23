import Ember from 'ember';
import { areCoordsEqual } from 'ember-cli-g-maps/utils/g-maps/math';

const { observer, on } = Ember;

export default Ember.Mixin.create(Ember.Evented, {

  /**
   * [on map load bind map `center_changed` event to `_bindLatLngToModel`]
   */
  _addCenterChangedEvent: on('ember-cli-g-map-loaded', function() {
    const googleMapInstance = this.get('map.map');

    GMaps.on('center_changed', googleMapInstance, () => {
      Ember.run.debounce(this, this._bindLatLngToModel, 100);
    });
  }),

  /**
   * [observer for component attribute's `lat` and `lng` updates]
   * @param  {Boolean} 'isMapLoaded'
   * @param  {[Number]}  'lat'
   * @param  {[Number]}  'lng'
   * @return {[Boolean]} [returns false if map not updated]
   */
  _bindLatLngToMap: observer('isMapLoaded', 'lat', 'lng', function() {
    if (!this.get('isMapLoaded')) {
      return false;
    }

    const { map, lat, lng } = this.getProperties('map', 'lng', 'lat');
    const center = map.getCenter();

    // If map is out of sync with app state
    if(!areCoordsEqual(center.lat(), lat) || !areCoordsEqual(center.lng(), lng)) {
      map.setCenter(lat, lng);
    }
  }),

  /**
   * [updates component attributes `lat` and `lng` if out of sync]
   * @return {[Boolean]} [returns false if attributes not updated]
   */
  _bindLatLngToModel: function() {
    const map = this.get('map');
    const { lat, lng } = this.getProperties('lat', 'lng');
    const center = map.getCenter();

    // Still in sync
    if(areCoordsEqual(center.lat(), lat) || areCoordsEqual(center.lng(), lng)) {
      return false;
    }

    // Out of sync
    this.setProperties({ lat: center.lat(), lng: center.lng() });
  }
});
