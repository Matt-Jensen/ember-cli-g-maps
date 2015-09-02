/* globals GMaps: true, google: true */
import Ember from 'ember';

const { on, merge, uuid, computed, observer } = Ember;

export default Ember.Mixin.create({
  map: null,
  name: null,
  draggable: true,
  isMapLoaded: false,
  classNames: ['ember-cli-g-map'], 
  gMap: Ember.inject.service(),

  // Map Events
  _gmapEvents: [
    'idle',
    'drag',
    'click',
    'resize',
    'dragend',
    'dblclick',
    'mouseout',
    'dragstart',
    'mousemove',
    'mouseover',
    'rightclick',
    'tilesloaded',
    'tilt_changed',
    'zoom_changed',
    'bounds_changed',
    'center_changed',
    'heading_changed',
    'maptypeid_changed',
    'projection_changed'
  ],

  _requiredProperties: {
    lat: 0,
    lng: 0,
    zoom: 0,
    mapType: 'ROADMAP',
    mapTypeControl: false,
  },

  _initGMap: on('didInsertElement', function() {
    const events      = this.get('_gmapEvents');
    const configProps = ['lat', 'lng', 'zoom'];
    let config        = this.getProperties.apply(this, configProps);
    config            = merge(this._requiredProperties, config);
    config.div        = `#${this.element.id}`;

    const map = new GMaps( config );
    this.set('map', map);

    // Set GMap events
    for(let i = 0, l = events.length; i < l; i++ ) {

      // If map event defined on component
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

  _destroyGMap: on('willDestroyElement', function destroyGMap() {
    const events = this.get('_gmapEvents');
    const map    = this.get('map');

    // Remove GMap events
    for(let i = 0, l = events.length; i < l; i++ ) {

      // If map event defined on component
      if( !this.get(events[i]) ) { continue; }
      GMaps.off(events[i], map.map);
    }

    // Remove GMap from gMap service
    this.get('gMap').maps.remove(this.get('name'));

    // Run after Mixin willDestroyElement
    Ember.run.later(() => this.get('map').destroy());
  }),


  /////////////////////////////
  // Parent -> GMap Bindings
  /////////////////////////////

  _syncCenter: observer('isMapLoaded', 'lat', 'lng', function() {
    if(!this.get('isMapLoaded')) { return false; }
    const { map, lat, lng } = this.getProperties('map', 'lng', 'lat');
    const center = map.getCenter();
    const areCoordsEqual = this._areCoordsEqual;

    // If map is out of sync with app state
    if(!areCoordsEqual(center.lat(), lat) || !areCoordsEqual(center.lng(), lng)) {
      map.setCenter(lat, lng);
    }
  }),

  _syncZoom: observer('isMapLoaded', 'zoom', function() {
    if(!this.get('isMapLoaded')) { return false; }
    const { map, zoom } = this.getProperties('map', 'zoom');
    map.setZoom(zoom);
  }),

  _syncDraggable: observer('isMapLoaded', 'draggable', function() {
    if(!this.get('isMapLoaded')) { return false; }
    const map = this.get('map').map;
    map.setOptions({ draggable: this.get('draggable') });
  }),

  _syncMapType: observer('isMapLoaded', 'mapType', function() {
    if(!this.get('isMapLoaded')) { return false; }
    const map     = this.get('map').map;
    const mapType = this.get('mapType')+'';

    if(mapType === 'undefined') { return false; }

    if(mapType.toLowerCase() !== map.getMapTypeId()) {
      map.setMapTypeId( google.maps.MapTypeId[mapType.toUpperCase()] );
    }
  }),


  /////////////////////////////
  // GMap -> Parent Bindings
  ////////////////////////////

  _addGMapPersisters: on('ember-cli-g-map-loaded', function() {
    const map = this.get('map');

    GMaps.on('center_changed', map.map, () => {
      Ember.run.debounce(this, this._onCenterChanged, 100);
    });

    GMaps.on('zoom_changed', map.map, () => {
      Ember.run.later(() => this._onZoomChanged());
    });
  }),

  _onCenterChanged: function() {
    const map = this.get('map');
    const areCoordsEqual = this._areCoordsEqual;
    const { lat, lng } = this.getProperties('lat', 'lng');
    const center = map.getCenter();

    // Still in sync
    if(areCoordsEqual(center.lat(), lat) || areCoordsEqual(center.lng(), lng)) { return false; }

    // Out of sync
    this.setProperties({ lat: center.lat(), lng: center.lng() });
  },

  _onZoomChanged: function() {
    const map = this.get('map');
    const zoom = this.get('zoom');

    // Zoom still in sync
    if(zoom === map.map.zoom) { return false; }

    // Zooming changes lat,lng state
    const center = map.getCenter();

    // Zoom out of sync
    this.setProperties({ zoom: map.map.zoom, lat: center.lat(), lng: center.lng() });
  },


  /////////////////////////////////////////////////////////////
  // Map state info, generally required info to make requests
  /////////////////////////////////////////////////////////////

  defaultGMapState: computed('lat', 'lng', 'zoom', function() {
    const map    = this.get('map');
    const bounds = map.map.getBounds();
    const ne     = bounds.getNorthEast();
    const sw     = bounds.getSouthWest();

    return {
      bounds: [
        { lat: ne.lat(), lng: ne.lng(), location: 'northeast' }, // Northeast
        { lat: sw.lat(), lng: sw.lng(), location: 'southwest' }  // Southwest
      ],

      mapIdle: new Ember.RSVP.Promise((resolve) => {
        google.maps.event.addListenerOnce(map.map, 'idle', resolve);
      }),

      mapTilesLoaded: new Ember.RSVP.Promise((resolve) => {
        google.maps.event.addListenerOnce(map.map, 'tilesloaded', resolve);
      })
    };
  }),


  // Supported g-map Actions

  actions: {
    idle: function() {
      this.sendAction('idle', merge(this.get('defaultGMapState'), ...arguments));
    },
    drag: function() {
      this.sendAction('drag', merge(this.get('defaultGMapState'), ...arguments));
    },
    click: function() {
      this.sendAction('click', merge(this.get('defaultGMapState'), ...arguments));
    },
    resize: function() {
      this.sendAction('resize', merge(this.get('defaultGMapState'), ...arguments));
    },
    dragend: function() {
      this.sendAction('dragend', merge(this.get('defaultGMapState'), ...arguments));
    },
    dblclick: function() {
      this.sendAction('dblclick', merge(this.get('defaultGMapState'), ...arguments));
    },
    mouseout: function() {
      this.sendAction('mouseout', merge(this.get('defaultGMapState'), ...arguments));
    },
    dragstart: function() {
      this.sendAction('dragstart', merge(this.get('defaultGMapState'), ...arguments));
    },
    mousemove: function() {
      this.sendAction('mousemove', merge(this.get('defaultGMapState'), ...arguments));
    },
    mouseover: function() {
      this.sendAction('mouseover', merge(this.get('defaultGMapState'), ...arguments));
    },
    rightclick: function() {
      this.sendAction('rightclick', merge(this.get('defaultGMapState'), ...arguments));
    },
    tilesloaded: function() {
      this.sendAction('tilesloaded', merge(this.get('defaultGMapState'), ...arguments));
    },
    tilt_changed: function() {
      this.sendAction('tilt_changed', merge(this.get('defaultGMapState'), ...arguments));
    },
    zoom_changed: function() {
      this.sendAction('zoom_changed', merge(this.get('defaultGMapState'), ...arguments));
    },
    bounds_changed: function() {
      this.sendAction('bounds_changed', merge(this.get('defaultGMapState'), ...arguments));
    },
    center_changed: function() {
      this.sendAction('center_changed', merge(this.get('defaultGMapState'), ...arguments));
    },
    heading_changed: function() {
      this.sendAction('heading_changed', merge(this.get('defaultGMapState'), ...arguments));
    },
    maptypeid_changed: function() {
      this.sendAction('maptypeid_changed', merge(this.get('defaultGMapState'), ...arguments));
    },
    projection_changed: function() {
      this.sendAction('projection_changed', merge(this.get('defaultGMapState'), ...arguments));
    }
  },


  /////////////
  // Helpers
  ////////////
  
  _areCoordsEqual: (a, b) => parseFloat(a).toFixed(12) === parseFloat(b).toFixed(12)
});
