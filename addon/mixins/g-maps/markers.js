import Ember           from 'ember';
import childCollection from 'ember-cli-g-maps/utils/g-maps/child-collection';

const { isArray } = Ember;

export default Ember.Mixin.create(
  childCollection.create({
    model: 'markers',

    namespace: 'marker',

    /* Supported:
    props: [ 'lat', 'lng', 'details', 'fences', 'outside', 'infoWindow', 'anchorPoint', 'animation', 'attribution', 'clickable', 'crossOnDrag', 'cursor', 'draggable', 'icon', 'opacity', 'optimized', 'place', 'shape', 'title', 'visible', 'zIndex' ],

    events: [ 'click', 'rightclick', 'dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'animation_changed', 'clickable_changed', 'cursor_changed', 'draggable_changed', 'flat_changed', 'icon_changed', 'position_changed', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed', 'zindex_changed' ],
    */

    validate: function validateMarkers() {
      const markers = this.get('markers');
      if(markers && !isArray(markers)) {
        throw new Error('g-maps component expects markers to be an Ember Array');
      }
    },

    destroy: function destroyMarkers() {
      google.maps.event.clearListeners(this.get('map').map, 'closeclick');
    },

    removeItem: function removeMarker(m) {
      if(m.infoWindow) {
        m.infoWindow.setMap(null);
        m.infoWindow = null;
      }
    },

    addedItem: function addMarker(m, marker, map) {
      // If marker has visible window, trigger open
      if(marker.infoWindow && marker.infoWindow.visible) {
        marker.infoWindow.addListener('closeclick', function() {
          marker.infoWindow.set('visible', false);
        });
        marker.infoWindow.open(map.map, marker);
        marker.addListener('click', function toggleInfoWindow() {
          if(!marker.infoWindow) { return; }
          if(marker.infoWindow.get('visible') === false) {
            marker.infoWindow.open(map.map, marker);
            marker.infoWindow.set('visible', true);
          } else {
            marker.infoWindow.close(map.map, marker);
            marker.infoWindow.set('visible', false);
          }
        });
      }
    }
  })
);
