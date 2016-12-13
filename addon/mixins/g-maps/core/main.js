import Ember from 'ember';
import loadGoogleMaps from 'ember-cli-g-maps/utils/load-google-maps';

const { merge, uuid, computed } = Ember;
const { bind } = Ember.run;

export default Ember.Mixin.create(Ember.Evented, {
  map: null,
  name: null,
  lat: 33.5205556,
  lng: -86.8025,
  zoom: 0,
  mapType: 'ROADMAP',
  showMapTypeControl: true,
  clickableIcons: true,
  draggable: true,
  disableDefaultUI: false,
  disableDoubleClickZoom: false,
  scrollwheel: true,
  showZoomControl: true,
  showScaleControl: true,
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

  didInsertElement() {
    this._super(...arguments);

    const config = this.getProperties(
      'lat',
      'lng',
      'zoom',
      'styles',
      'mapType',
      'showMapTypeControl',
      'scaleControl',
      'showScaleControl',
      'disableDefaultUI',
      'clickableIcons'
    );

    // Map symantic names to Google Map Options
    config.zoomControl = config.showZoomControl;
    config.mapTypeControl = config.showMapTypeControl;
    config.scaleControl = config.showScaleControl;

    loadGoogleMaps()
      .then(() => {

        // Create Gmap Instance
        const map = new GMaps(
          merge(config, {
            div: `#${this.element.id}`
          })
        );

        this.set('map', map);

        this._addMapEvents();

        if (!this.get('name')) {
          this.set('name', `ember-cli-g-map-${uuid()}`);
        }

        // Register gMap instance in gMap service
        this.get('gMap').maps.add(this.get('name'), map.map);

        /*
         * Some test helpers require access to the map instance
         */
        if (this.get('_isTestEnv')) {
          this.element.__GOOGLE_MAP__ = map.map;
        }

        // When map instance has finished loading
        google.maps.event.addListenerOnce(map.map, 'idle', Ember.run.bind(this, this._onMapLoad));
      })
      .catch(() => {
        Ember.Logger.error('Failed to load google maps via Ember-cli-g-maps');
      });
  },

  // TODO write integration test coverage
  willDestroyElement() {
    this._super(...arguments);

    this._removeMapEvents();

    // TODO: remove for v1.x
    this.get('gMap').maps.remove(this.get('name'));

    // Run after Mixin willDestroyElement
    Ember.run.later(() => this.get('map').destroy());

    if (this.get('_isTestEnv')) {
      this.element.__GOOGLE_MAP__ = null;
    }
  },

  /**
   * @type {Boolean}
   */
  _isTestEnv: computed(function() {
    return (this.container.lookupFactory('config:environment').environment === 'test');
  }),

  _addMapEvents() {
    const events = this.get('_gmapEvents');
    const sendEvent = (name, evt) => this.send(name, evt);

    for (let i = 0, l = events.length; i < l; i++ ) {

      // If map event NOT defined on component continue
      if (!this.get(events[i])) {
        continue;
      }

      // Add GMaps event listener on google map instance
      GMaps.on(events[i], this.get('map.map'), bind(this, sendEvent, events[i]));
    }
  },

  _removeMapEvents() {
    const events = this.get('_gmapEvents');

    for(let i = 0, l = events.length; i < l; i++ ) {

      // If map event NOT defined on component continue
      if( !this.get(events[i]) ) {
        continue;
      }

      GMaps.off(events[i], this.get('map.map'));
    }
  },

  _onMapLoad(e) {
    if (this.get('isDestroyed')) {
      return false;
    }

    this.set('isMapLoaded', true);
    this.trigger('ember-cli-g-map-loaded');
    this.send('loaded', e);
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
      const googleMapInstance = this.get('map.map');
      this.sendAction('maptypeid_changed', merge(this.get('defaultGMapState'), { mapType: googleMapInstance.getMapTypeId() }, ...arguments));
    },

    projection_changed: function() {
      this.sendAction('projection_changed', merge(this.get('defaultGMapState'), ...arguments));
    }
  }
});
