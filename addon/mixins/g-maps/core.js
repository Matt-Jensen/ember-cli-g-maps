import Ember from 'ember';

const { on, merge, uuid, computed } = Ember;

export default Ember.Mixin.create({
  map: null,
  googleMap: computed.oneWay('map.map'),
  name: null,
  lat: 0,
  lng: 0,
  zoom: 0,
  mapType: 'ROADMAP',
  mapTypeControl: true,
  draggable: true,
  disableDefaultUI: false,
  disableDoubleClickZoom: false,
  scrollwheel: true,
  zoomControl: true,
  scaleControl: true,
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

  _initGMap: on('didInsertElement', function() {
    const events = this.get('_gmapEvents');
    const config = this.getProperties(
      'lat',
      'lng',
      'zoom',
      'mapType',
      'mapTypeControl',
      'scaleControl',
      'showScaleControl',
      'disableDefaultUI'
    );
    config.div = `#${this.element.id}`;

    const map = new GMaps( config );
    this.set('map', map);

    // Set GMap events
    for (let i = 0, l = events.length; i < l; i++ ) {

      // If map event defined on component
      if (!this.get(events[i])) { continue; }

      // Add GMaps event listener on google map instance
      GMaps.on(events[i], map.map, (e) => this.send(events[i], e));
    }

    if (!this.get('name')) {
      this.set('name', `ember-cli-g-map-${uuid()}`);
    }

    this.get('gMap').maps.add(this.get('name'), map.map);

    // When map instance has finished loading
    google.maps.event.addListenerOnce(map.map, 'idle', (e) => {
      if (this.get('isDestroyed')) { return; }
      this.set('isMapLoaded', true);
      this.trigger('ember-cli-g-map-loaded');
      this.send('loaded', e);
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

    // TODO: remove for v0.4.0
    this.get('gMap').maps.remove(this.get('name'));

    // Run after Mixin willDestroyElement
    Ember.run.later(() => this.get('map').destroy());
  }),

  /////////////////////////////////////////////////////////////
  // Map state info, generally required info to make requests
  /////////////////////////////////////////////////////////////

  defaultGMapState: computed('lat', 'lng', 'zoom', function() {
    const map    = this.get('map');
    const bounds = map.map.getBounds();
    const ne     = bounds.getNorthEast();
    const sw     = bounds.getSouthWest();

    return {
      map: this.get('name'),

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
    loaded: function() {
      this.sendAction('loaded', merge(this.get('defaultGMapState'), ...arguments));
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
      this.sendAction('tilt_changed', ...arguments);
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
      const googleMap = this.get('googleMap');
      this.sendAction('maptypeid_changed', merge(
        this.get('defaultGMapState'),
        { mapType: googleMap.getMapTypeId() },
        ...arguments
      ));
    },
    projection_changed: function() {
      this.sendAction('projection_changed', merge(this.get('defaultGMapState'), ...arguments));
    }
  }
});
