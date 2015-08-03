/* globals GMaps google */

import Ember         from 'ember';
import Configurables from 'ember-cli-g-maps/mixins/g-maps/configurables';
import utils         from 'ember-cli-g-maps/utils/g-maps/markers';

const { on, computed, observer, merge, uuid } = Ember;

export default Ember.Mixin.create(Configurables, {
  markers: Ember.A(),

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


  _markerIds: computed.map('markers.@each.id', function(marker) { 
    if( !marker.id ) { throw new Error('Marker items require an id'); }
    return marker.id;
  }),


  _markersUpdated: computed('_markerIds', {
    get() {
      if(!this.get('map')){ return false; }
      const _markerIds  = this.get('_markerIds');
      const mapMarkers  = this.get('map').markers;

      // Markers were updated
      if(mapMarkers.length !== _markerIds.length) { return true; }

      for(let i = 0, l = mapMarkers.length; i < l; i++) {

        // Compare GMap marker id's to Model markers id's
        if(_markerIds.indexOf(mapMarkers[i].id) === -1) {
          return true; // Markers were updated
        }
      }

      return false; // Markers not updated
    }
  }),


  _syncMarkers: observer('isMapLoaded', 'markers.@each.id', function() {
    let markers = this.get('markers');
    const map   = this.get('map');

    // If markers should sync
    if(!this.get('isMapLoaded') || !this.get('_markersUpdated')) { return; }

    // Remove (deleted) Markers from GMap
    for(let i = 0, l = map.markers.length; i < l; i++) {
      let m  = map.markers[i];
      let id = m.details.id;

      if(utils.isMarkerRemoved(id, markers) === false) { 
        continue;
      }

      // close/remove any open marker infoWindows
      if(m.infoWindow) { 
        m.infoWindow.setMap(null);
        m.infoWindow = null;
      }

      // Remove Marker
      m.setMap(null);
    }

    const markerConfProps = this.getConfigParams('_gmapChildEvents', '_gmapMarkerProps', '_gmapMarkerEvents');

    // Add (unadded) Markers to GMap
    for(let i = 0, l = markers.length; i < l; i++) {
      let m = markers[i];
      let id = m.id;

      if( id && map.hasMarker(id) ) { continue; }

      let config = this.getConfig(markerConfProps, m);

      // Merge marker source data into marker.details
      config.details = merge(m, config.details || {});

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
