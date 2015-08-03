/* globals GMaps google */

import Ember from 'ember';
import Configurables from 'ember-cli-g-maps/mixins/g-maps/configurables';

const { on, computed, observer, merge } = Ember;

export default Ember.Mixin.create(Configurables, {

  ///////////////////////////
  // Marker Configurables
  //////////////////////////
  _gmapMarkerProps: [
    'lat',
    'lng',
    'details',
    'fences',
    'outside',
    'infoWindow',
    'anchorPoint',
    'animation',
    'attribution',
    'clickable',
    'crossOnDrag',
    'cursor',
    'draggable',
    'icon',
    'opacity',
    'optimized',
    'place',
    'shape',
    'title',
    'visible',
    'zIndex'
  ],

  _gmapMarkerEvents: [
    'animation_changed',
    'clickable_changed',
    'cursor_changed',
    'draggable_changed',
    'flat_changed',
    'icon_changed',
    'position_changed',
    'shadow_changed',
    'shape_changed',
    'title_changed',
    'visible_changed',
    'zindex_changed'
  ],

  validateMarkers: on('didInsertElement', function() {
    const markers = this.get('markers');
    if(markers && !Ember.isArray(markers)) {
      throw new Error('g-maps componet expects markers to be an Array');
    }
  }),

  destroyMarkers: on('willDestroyElement', function() {
    google.maps.event.clearListeners(this.get('map').map, 'closeclick');
  }),

  _isMarkerRemoved: (id, markers) => { 
    for(let i = 0, l = markers.length; i < l; i++ ) {
      if(markers[i].id === id) { return false; }
    }
    return true;
  },

  _syncLength: null,
  _syncMarkers: observer('isMapLoaded', 'markers.length', function() {
    const map   = this.get('map');
    let markers = this.get('markers');

    // Test if markers should sync
    if(!this.get('isMapLoaded')) { return; }
    if(this.get('_syncLength') === markers.length) { return; }
    this._prevLength = markers.length;

    // Convert markers to raw array
    if( typeof markers.toArray === 'function' ) {
      markers = markers.toArray();
    }

    // Remove (deleted) Markers
    for(let i = 0, l = map.markers.length; i < l; i++) {
      let m = map.markers[i];
      if( !this._isMarkerRemoved(m.details.id, markers) ) { 
        continue;
      }

      // close any open infoWindows
      if(m.infoWindow) { 
        m.infoWindow.setMap(null);
        m.infoWindow = null;
      }
      m.setMap(null);
    }

    const markerConfProps = this.getConfigParams('_gmapChildEvents', '_gmapMarkerProps', '_gmapMarkerEvents')

    // Add (unadded) Markers
    for(let i = 0, l = markers.length; i < l; i++) {
      let m = markers[i];
      let id = m.details && m.details.id;

      if( id && map.hasMarker(id) ) { continue; }

      let config = this.getConfig(markerConfProps, m);

      // Merge marker source data into marker.details
      config.details = merge(m, config.details || {});

      // Ensure that marker id exists
      config.details.id = config.details.id || `ember-cli-g-maps-${uuid()}`;

      // Add new marker to map
      const marker = map.addMarker(config);

      // If marker has visible window, trigger open
      if(!m.hasInfoWindow && m.infoWindow && m.infoWindow.visible) {
        m.hasInfoWindow = true;
        marker.infoWindow.addListener('closeclick', function() {
          marker.infoWindow.set('visible', false);
        });
        marker.infoWindow.open(map.map, marker);
        marker.addListener('click', function toggleInfoWindow() {
          if(!marker.infoWindow) { return; }
          if(marker.infoWindow.get('visible')) {
            marker.infoWindow.open(map.map, marker);
          } else {
            marker.infoWindow.close(map.map, marker);
          }
        });
      }
    }
  })
});
