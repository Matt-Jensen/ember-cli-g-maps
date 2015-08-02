/* globals GMaps */
import Ember from 'ember';

const { on, merge, uuid } = Ember;

export default Ember.Component.extend({
  map: null,
  classNames: ['ember-cli-g-map'], 

  // Map Events
  _gmapEvents: [
    'bounds_changed',
    'center_changed',
    'click',
    'dblclick',
    'drag',
    'dragend',
    'dragstart',
    'heading_changed',
    'idle',
    'maptypeid_changed',
    'mousemove',
    'mouseout',
    'mouseover',
    'projection_changed',
    'resize',
    'rightclick',
    'tilesloaded',
    'tilt_changed',
    'zoom_changed'
  ],

  actions: {
    click: function() {
      this.send('click', ...arguments);
    },
    bounds_changed: function() {
      this.send('bounds_changed', ...arguments);
    },
    center_changed: function() {
      this.send('center_changed', ...arguments);
    },
    dblclick: function() {
      this.send('dblclick', ...arguments);
    },
    drag: function() {
      this.send('drag', ...arguments);
    },
    dragend: function() {
      this.send('dragend', ...arguments);
    },
    dragstart: function() {
      this.send('dragstart', ...arguments);
    },
    heading_changed: function() {
      this.send('heading_changed', ...arguments);
    },
    idle: function() {
      this.send('idle', ...arguments);
    },
    maptypeid_changed: function() {
      this.send('maptypeid_changed', ...arguments);
    },
    mousemove: function() {
      this.send('mousemove', ...arguments);
    },
    mouseout: function() {
      this.send('mouseout', ...arguments);
    },
    mouseover: function() {
      this.send('mouseover', ...arguments);
    },
    projection_changed: function() {
      this.send('projection_changed', ...arguments);
    },
    resize: function() {
      this.send('resize', ...arguments);
    },
    rightclick: function() {
      this.send('rightclick', ...arguments);
    },
    tilesloaded: function() {
      this.send('tilesloaded', ...arguments);
    },
    tilt_changed: function() {
      this.send('tilt_changed', ...arguments);
    },
    zoom_changed: function() {
      this.send('zoom_changed', ...arguments);
    }
  },

  insertMap: on('didInsertElement', function() {
    const events = this.get('_gmapEvents');
    const configProps = ['lat', 'lng', 'zoom'];
    let config = this.getProperties.apply(this, configProps);
    config.div = `#${this.element.id}`;

    const map = new GMaps( config );
    map.hasMarker = map.hasMarker || function(marker_id) {
      const markers = this.markers;
      for(let i = 0, l = markers.length; i < l; i++ ) {
        if(markers[i].details.id === marker_id) {
          return true;
        }
      }
      return false;
    };
    this.set('map', map);

    // Set GMap events
    for(let i = 0, l = events.length; i < l; i++ ) {
      if( !this.get(events[i]) ) { continue; }
      GMaps.on(events[i], map.map, (e) => this.sendAction(events[i], e));
    }

    this.addObserver('markers.@each', this, this._syncMarkers);
    this._syncMarkers();
  }),

  destroyMap: on('willDestroyElement', function() {
    const events = this.get('events');
    const map    = this.get('map');

    // Set GMap events
    for(let i = 0, l = events.length; i < l; i++ ) {
      if( !this.get(events[i]) ) { continue; }
        GMaps.off(events[i], map.map);
      }
  }),

  // Common Child Events
  _gmapChildEvents: [
    'click',
    'rightclick',
    'dblclick',
    'drag',
    'dragend',
    'dragstart',
    'mousedown',
    'mouseout',
    'mouseover',
    'mouseup'
  ],

  ////////////
  // Markers
  ///////////
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
  _isMarkerRemoved: (id, markers) => { 
    for(let i = 0, l = markers.length; i < l; i++ ) {
      if(markers[i].id === id) { return false; }
    }
    return true;
  },
  _syncMarkers: function() {
    const map   = this.get('map');
    let markers = this.get('markers');

    if( !Ember.isArray(markers) ) {
      throw new Error('g-maps componet expects markers to be an Array');
    }

    if( typeof markers.toArray === 'function' ) {
      markers = markers.toArray();
    }

    const configProps = this.get('_gmapMarkerProps')
      .concat( this.get('_gmapMarkerEvents') )
      .concat( this.get('_gmapChildEvents') );
    // map.hideInfoWindows();

    // Remove Markers and close any open infoWindows
    map.markers.forEach((m) => {
      if( this._isMarkerRemoved(m.details.id, markers) ) {
        if(m.infoWindow && m.infoWindow.visible) { 
          m.infoWindow.setMap(null);
          m.infoWindow = null;
        }
        m.setMap(null);
      }
    });

    // Add Markers
    markers.forEach((m) => {
      let config = this.getProperties.apply(m, configProps);
      config.details = merge(m, config.details || {});
      config.details.id = config.details.id || `ember-cli-g-maps-${uuid()}`;

      if( !map.hasMarker(config.details.id) ) {
        const marker = map.addMarker(config);

        if(m.infoWindow && m.infoWindow.visible) {
          marker.infoWindow.open(map.map, marker);
        }
      }

    });
  }
});
