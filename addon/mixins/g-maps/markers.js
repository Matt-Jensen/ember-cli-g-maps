/* globals GMaps google */
import Ember           from 'ember';
import Configurables   from 'ember-cli-g-maps/mixins/g-maps/configurables';
import childCollection from 'ember-cli-g-maps/utils/g-maps/child-collection';

const { isArray } = Ember;

export default Ember.Mixin.create(
  Configurables,
  childCollection.create({
    model: 'markers',

    namespace: 'marker',

    props: [
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

    events: [
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

    validate: function() {
      const markers = this.get('markers');
      if(markers && !isArray(markers)) {
        throw new Error('g-maps component expects markers to be an Ember Array');
      }
    },

    onDestroy: function() {
      google.maps.event.clearListeners(this.get('map').map, 'closeclick');
    },

    onRemoveItem: function(m) {
      if(m.infoWindow) { 
        m.infoWindow.setMap(null);
        m.infoWindow = null;
      }
    },

    onAddedItem: function(m, marker, map) {
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
);
