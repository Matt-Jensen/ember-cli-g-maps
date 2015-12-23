import Ember from 'ember';

const { observer, on } = Ember;

export default Ember.Mixin.create(Ember.Evented, {

  /**
   * [on map load bind map `zoom_changed` event to `_bindZoomToModel`]]
   */
  _addZoomChangedEvent: on('ember-cli-g-map-loaded', function() {
    const map = this.get('map');

    GMaps.on('zoom_changed', map.map, () => {
      Ember.run.later(() => this._bindZoomToModel());
    });
  }),

  /**
   * [observer for component attribute `zoom` updates]
   * @param  {Boolean} 'isMapLoaded'
   * @param  {[Number]}  'zoom'
   * @return {[Boolean]} [returns false if map not updated]
   */
  _bindZoomToMap: observer('isMapLoaded', 'zoom', function() {
    if (!this.get('isMapLoaded')) {
      return false;
    }

    const { map, zoom } = this.getProperties('map', 'zoom');

    if (typeof zoom !== 'number') {
      return false;
    }

    map.setZoom(zoom);
  }),

  /**
   * [updates component attributes `zoom` if out of sync]
   * @return {[Boolean]} [returns false if attributes not updated]
   */
  _bindZoomToModel: function() {
    const { map, zoom } = this.getProperties('map', 'zoom');

    // Zoom still in sync
    if(zoom === map.map.zoom) {
      return false;
    }

    const center = map.getCenter();

    // Zoom out of sync (lat, lng are usually updated on zoom as well)
    this.setProperties({
      zoom: map.map.zoom,
      lat: center.lat(),
      lng: center.lng()
    });
  },
});
