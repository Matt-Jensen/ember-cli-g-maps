/* globals GMaps: true, google: true */
import Ember        from 'ember';
import GMapMarkers  from 'ember-cli-g-maps/mixins/g-maps/markers';
import GMapPolygons from 'ember-cli-g-maps/mixins/g-maps/polygons';
import GMapCircles  from 'ember-cli-g-maps/mixins/g-maps/circles';

const { on, merge, uuid, computed, observer } = Ember;
const { later } = Ember.run;

export default Ember.Component.extend(Ember.Evented, GMapMarkers, GMapPolygons, GMapCircles, {
  map: null,
  name: null,
  draggable: true,
  isMapLoaded: false,
  classNames: ['ember-cli-g-map'], 
  gMap: Ember.inject.service(),

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

  _requiredProperties: {
    lat: 0,
    lng: 0,
    zoom: 0,
    mapTypeControl: false,
    mapType: 'ROADMAP'
  },

  insertGMap: on('didInsertElement', function() {
    const events = this.get('_gmapEvents');
    const configProps = ['lat', 'lng', 'zoom'];
    let config = this.getProperties.apply(this, configProps);
    config     = merge(this._requiredProperties, config);
    config.div = `#${this.element.id}`;

    const map = new GMaps( config );
    this.set('map', map);

    // Set GMap events
    for(let i = 0, l = events.length; i < l; i++ ) {
      if( !this.get(events[i]) ) { continue; }

      // Add GMaps event listener on google map instance
      GMaps.on(events[i], map.map, (e) => this.send(events[i], e));
    }

    if( !this.get('name') ) {
      this.set('name', `ember-cli-g-map-${uuid()}`);
    }

    // Create map service instance and register load event
    const mapService = this.get('gMap').maps.add(this.get('name'), map.map);
    mapService.onLoad.then(() => {
      this.set('isMapLoaded', true);
      this.trigger('ember-cli-g-map-loaded');
    });
  }),


  destroyGMap: on('willDestroyElement', function destroyGMap() {
    const events = this.get('events');
    const map    = this.get('map');

    // Remove GMap events
    for(let i = 0, l = events.length; i < l; i++ ) {
      if( !this.get(events[i]) ) { continue; }
      GMaps.off(events[i], map.map);
    }

    this.get('map').destroy();
    this.set('map', null);

    // Remove GMap from gMap service
    this.get('gMap').maps.remove(this.get('name'));
  }),


  /////////////////////////////
  // Parent -> GMap Bindings
  /////////////////////////////

  _syncCenter: observer('isMapLoaded', 'lat', 'lng', function() {
    if(!this.get('isMapLoaded')) { return; }
    const { map, lat, lng } = this.getProperties('map', 'lng', 'lat');
    const { A, F } = map.getCenter();
    const areCoordsEqual = this._areCoordsEqual;

    // If map is out of sync with app state
    if(!areCoordsEqual(A, lat) || !areCoordsEqual(F, lng)) {
      map.setCenter(lat, lng);
    }
  }),

  _syncZoom: observer('isMapLoaded', 'zoom', function() {
    if(!this.get('isMapLoaded')) { return; }
    const { map, zoom } = this.getProperties('map', 'zoom');
    map.setZoom(zoom);
  }),

  _syncDraggable: observer('draggable', function() {
    if(!this.get('isMapLoaded')) { return; }
    const map = this.get('map').map;
    map.setOptions({ draggable: this.get('draggable') });
  }),

  _syncMapType: observer('mapType', function() {
    if(!this.get('isMapLoaded')) { return; }
    const map     = this.get('map').map;
    const mapType = (this.get('mapType')+'').toUpperCase();
    map.setMapTypeId( google.maps.MapTypeId[mapType] );
  }),


  /////////////////////////////
  // GMap -> Parent Bindings
  ////////////////////////////

  _addGMapPersisters: on('ember-cli-g-map-loaded', function() {
    const map = this.get('map');
    const areCoordsEqual = this._areCoordsEqual;

    GMaps.on('center_changed', map.map, () => { 
      later(() => {
        const { lat, lng } = this.getProperties('lat', 'lng');
        const { A, F } = map.getCenter();

        // If app state is out of sync with GMap
        if(!areCoordsEqual(A, lat) || !areCoordsEqual(F, lng)) {
          this.setProperties({ lat: A, lng: F });
        }
      });
    });

    GMaps.on('zoom_changed', map.map, () => {
      later(() => {
        const zoom = this.get('zoom');
        if(zoom !== map.map.zoom) {
          this.set('zoom', map.map.zoom);
        }
      });
    });
  }),


  // Supported g-map Actions

  actions: {
    click: function() {
      this.sendAction('click', merge(this.get('happyPathGMapState'), ...arguments));
    },
    bounds_changed: function() {
      this.sendAction('bounds_changed', merge(this.get('happyPathGMapState'), ...arguments));
    },
    center_changed: function() {
      this.sendAction('center_changed', merge(this.get('happyPathGMapState'), ...arguments));
    },
    dblclick: function() {
      this.sendAction('dblclick', merge(this.get('happyPathGMapState'), ...arguments));
    },
    drag: function() {
      this.sendAction('drag', merge(this.get('happyPathGMapState'), ...arguments));
    },
    dragend: function() {
      this.sendAction('dragend', merge(this.get('happyPathGMapState'), ...arguments));
    },
    dragstart: function() {
      this.sendAction('dragstart', merge(this.get('happyPathGMapState'), ...arguments));
    },
    heading_changed: function() {
      this.sendAction('heading_changed', merge(this.get('happyPathGMapState'), ...arguments));
    },
    idle: function() {
      this.sendAction('idle', merge(this.get('happyPathGMapState'), ...arguments));
    },
    maptypeid_changed: function() {
      this.sendAction('maptypeid_changed', merge(this.get('happyPathGMapState'), ...arguments));
    },
    mousemove: function() {
      this.sendAction('mousemove', merge(this.get('happyPathGMapState'), ...arguments));
    },
    mouseout: function() {
      this.sendAction('mouseout', merge(this.get('happyPathGMapState'), ...arguments));
    },
    mouseover: function() {
      this.sendAction('mouseover', merge(this.get('happyPathGMapState'), ...arguments));
    },
    projection_changed: function() {
      this.sendAction('projection_changed', merge(this.get('happyPathGMapState'), ...arguments));
    },
    resize: function() {
      this.sendAction('resize', merge(this.get('happyPathGMapState'), ...arguments));
    },
    rightclick: function() {
      this.sendAction('rightclick', merge(this.get('happyPathGMapState'), ...arguments));
    },
    tilesloaded: function() {
      this.sendAction('tilesloaded', merge(this.get('happyPathGMapState'), ...arguments));
    },
    tilt_changed: function() {
      this.sendAction('tilt_changed', merge(this.get('happyPathGMapState'), ...arguments));
    },
    zoom_changed: function() {
      this.sendAction('zoom_changed', merge(this.get('happyPathGMapState'), ...arguments));
    }
  },


  /////////////////////////////////////////////////////
  // Map state info, generally used to make requests
  ////////////////////////////////////////////////////

  happyPathGMapState: computed('lat', 'lng', 'zoom', function() {
    const map    = this.get('map');
    const bounds = map.map.getBounds();

    return {
      bounds: [
        { lat: bounds.Da.j, lng: bounds.va.j },
        { lat: bounds.Da.j, lng: bounds.va.A },
        { lat: bounds.Da.A, lng: bounds.va.A },
        { lat: bounds.Da.A, lng: bounds.va.j }
      ],

      mapIdle: new Promise((resolve) => {
        google.maps.event.addListenerOnce(map.map, 'idle', resolve);
      }),

      mapTilesLoaded: new Promise((resolve) => {
        google.maps.event.addListenerOnce(map.map, 'tilesloaded', resolve);
      })
    };
  }),


  /////////////
  // Helpers
  ////////////
  
  _areCoordsEqual: (a, b) => a.toFixed(12) === b.toFixed(12)
});
