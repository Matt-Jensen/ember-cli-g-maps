/* globals GMaps: true, google: true */
import Ember            from 'ember';
import GMapsCoreMixin   from 'ember-cli-g-maps/mixins/g-maps/core';
import { module, test } from 'qunit';
import sinon            from 'sinon';

const { merge } = Ember;

let subject, mapDiv;
const mapID = 'test-map';
const emberTestingDiv = document.getElementById('ember-testing');

module('Unit | Mixin | g maps/core', {
  beforeEach: function() {
    mapDiv = document.createElement('div');
    mapDiv.id = mapID;
    emberTestingDiv.appendChild(mapDiv);
    const GMapsCoreObject = Ember.Object.extend(GMapsCoreMixin, Ember.Evented, {
      element: mapDiv,

      // Mock gMap service
      gMap: {
        maps: { 
          add: function() {
            return {
              onLoad: new Promise((resolve) => {})
            };
          },
          remove: function() {}
        }
      },

      send: function() {}
    });
    subject = GMapsCoreObject.create();
  },
  afterEach: function() {
    const gm = subject.get('map');
    emberTestingDiv.removeChild(mapDiv);

    // Clean up any instantiated GMaps
    Ember.run.later(() => {
      if(gm && gm.map) { gm.destroy(); }
    }, 10); // run after `_destroyGMap` if needed
  }
});


///////////////
// Init Core
//////////////

test('`_initGMap` should invoke on `didInsertElement` event', function(assert) {
  subject._initGMap = sinon.spy();
  subject.trigger('didInsertElement');
  assert.ok(subject._initGMap.called);
});

test('`_initGMap` should create a GMap instance with main config properties', function(assert) {
  const config = { lat: 1, lng: 1, zoom: 10 };

  subject.setProperties(config);
  subject._initGMap();

  const zoom = subject.get('map').map.zoom;
  const { A, F } = subject.get('map').map.getCenter();

  assert.equal(A, config.lat);
  assert.equal(F, config.lng);
  assert.equal(zoom, config.zoom);
});

test('`_initGMap` should set all configured gmap events', function(assert) {
  const noop            = function() {};
  const addedEvents     = [];
  const originalGMapsOn = GMaps.on;
  const supportedEvents = subject.get('_gmapEvents');

  GMaps.on = function(event) {
    addedEvents.push(event);
  };

  // Add all supported events
  supportedEvents.forEach((e) => subject.set(e, noop));

  subject._initGMap();
  
  assert.deepEqual(addedEvents, supportedEvents);

  GMaps.on = originalGMapsOn;
});

test('`_initGMap` should set a given name if provided', function(assert) {
  subject.set('name', 'my-cool-map');
  subject._initGMap();

  assert.equal(subject.get('name'), 'my-cool-map');
});

test('`_initGMap` should automatically set a `name` if none provided', function(assert) {
  subject._initGMap();
  assert.ok(subject.get('name').length);
});

test('`_initGMap` should add a map to the `gMap` service with same `name`', function(assert) {
  assert.expect(1);
  subject.set('name', 'Marmaduke');

  subject.gMap.maps.add = function(name) {
    assert.equal(name, 'Marmaduke');
    return { onLoad: new Promise(() => {}) };
  };

  subject._initGMap();
});


/////////////////
// Destroy Core
/////////////////

test('`_destroyGMap` should invoke on `willDestroyElement` event', function(assert) {
  subject._destroyGMap = sinon.spy();
  subject.trigger('willDestroyElement');
  assert.ok(subject._destroyGMap.called);
});

test('`_destroyGMap` should remove all bound GMap events', function(assert) {
  const noop             = function() {};
  const removedEvents    = [];
  const originalGMapsOff = GMaps.off;
  const supportedEvents  = subject.get('_gmapEvents');

  GMaps.off = function(event) {
    removedEvents.push(event);
  };

  // Add all supported events
  supportedEvents.forEach((e) => subject.set(e, noop));
  subject._initGMap();
  subject._destroyGMap();

  assert.deepEqual(removedEvents, supportedEvents);

  GMaps.off = originalGMapsOff;
});

test('`_destroyGMap` should remove gMap instance added to gMap service', function(assert) {
  assert.expect(1);

  subject.set('name', 'may-test-map')
  subject.gMap.maps.remove = function(name) {
    assert.equal(name, 'may-test-map');
  };
  subject._initGMap();
  subject._destroyGMap();
});


//////////////////
// Sync Lat Lng
/////////////////

test('`_syncCenter` should not sync `lat` & `lng` if `isMapLoaded` is false', function(assert) {
  subject.setProperties({ lat: 1, lng: 1, isMapLoaded: false });
  assert.equal(subject._syncCenter(), false);
});

test('`_syncCenter` should not sync if `map.{lat,lng}` equals `subject.{lat,lng}`', function(assert) {
  const config = { lat: 1, lng: 1, isMapLoaded: false };
  subject.setProperties(config);
  subject._initGMap();
  subject.setProperties({
    isMapLoaded: true,
    map: merge(subject.get('map'), {
      getCenter: function() { return { A: config.lat, F: config.lng }; },
      setCenter: sinon.spy()
    })
  });
  subject._syncCenter();
  assert.equal(subject.map.setCenter.called, false);
});

test('`_syncCenter` should sync map instance if out of sync with subject', function(assert) {
  const config = { lat: 1, lng: 1, isMapLoaded: false };
  subject.setProperties(config);
  subject._initGMap();
  subject.setProperties({
    isMapLoaded: true,
    map: merge(subject.get('map'), {
      getCenter: function() { return { A: 2, F: 2 }; },
      setCenter: sinon.spy()
    })
  });
  subject._syncCenter();
  assert.ok(subject.map.setCenter.called);
});


///////////////
// Sync Zoom
//////////////

test('`_syncZoom` should not sync `zoom` if `isMapLoaded` is false', function(assert) {
  subject.setProperties({ zoom: 10, isMapLoaded: false });
  assert.equal(subject._syncZoom(), false);
});

test('`_syncZoom` should sync zoom if `isMapLoaded` is true', function(assert) {
  const config = { zoom: 10, isMapLoaded: false };
  subject.setProperties(config);
  subject._syncCenter = function() {}; // avoid bindings
  subject._initGMap();
  subject.setProperties({
    isMapLoaded: true,
    map: merge(subject.get('map'), {
      setZoom: sinon.spy()
    })
  });
  subject._syncZoom();
  assert.ok(subject.map.setZoom.called);
});


////////////////////
// Sync Draggable
///////////////////

test('`_syncDraggable` should not sync `draggable` if `isMapLoaded` is false', function(assert) {
  subject.setProperties({ draggable: false, isMapLoaded: false });
  assert.equal(subject._syncDraggable(), false);
});

test('`_syncDraggable` should sync `draggable` if `isMapLoaded` is true', function(assert) {
  assert.expect(1);

  const config = { draggable: false, isMapLoaded: false };
  subject.setProperties(config);
  subject._syncCenter = subject._syncZoom = subject._syncMapType = function() {}; // avoid bindings

  subject._initGMap();
  subject.setProperties({
    isMapLoaded: true,
    map: merge(subject.get('map'), {
      map: {
        setOptions: function(option) {
          assert.equal(option.draggable, config.draggable);
        }
      }
    })
  });
});


///////////////////
// Sync Map Type
//////////////////

test('`_syncMapType` should not sync `mapType` if `isMapLoaded` is false', function(assert) {
  subject.setProperties({ mapType: 'SATELITE',  isMapLoaded: false });
  assert.equal(subject._syncMapType(), false);
});
// test('`_syncMapType` should not sync `mapType` if `mapType` is undefined', function(assert) {});
// test('`_syncMapType` should sync set `mapType` if `isMapLoaded` is true', function(assert) {});


/////////////////////////////
// GMap Persistence Events
////////////////////////////

// test('`_addGMapPersisters` should add GMap events on `ember-cli-g-map-loaded`', function(assert) {
  // `center_changed`
  // `zoom_changed`
// });
// test('`_addGMapPersisters` should call `_onCenterChanged` on GMap event: `center_changed` fire', function(assert) {});
// test('`_addGMapPersisters` should call `_onZoomChanged` on GMap event: `zoom_changed` fire', function(assert) {});


///////////////////////
// On Center Changed
//////////////////////

// test('`_onCenterChanged` should not sync if same as subject `lat`,`lng`', function(assert) {});
// test('`_onCenterChanged` should sync new `lat` & `lng` to subject', function(assert) {});


/////////////////////
// On Zoom Changed
////////////////////

// test('`_onZoomChanged` should not sync if same as subject `zoom`', function(assert) {});
// test('`_onZoomChanged` should sync new `zoom`, `lat`, and `zoom` to subject', function(assert) {});


////////////////////////
// Default GMap State
/////////////////////// 

// test('`defaultGMapState` should return the current map bounds', function(assert) {});
// test('`defaultGMapState` should return a `mapIdle` Promise', function(assert) {});
// test('`defaultGMapState` should return a `mapTilesLoaded` Promise', function(assert) {});


/////////////
// Actions
////////////

// test('it should send `idle` on GMap event: `idle` fire', function(assert) {});
// test('it should send `drag` on GMap event: `drag` fire', function(assert) {});
// test('it should send `click` on GMap event: `click` fire', function(assert) {});
// test('it should send `resize` on GMap event: `resize` fire', function(assert) {});
// test('it should send `dragend` on GMap event: `dragend` fire', function(assert) {});
// test('it should send `dblclick` on GMap event: `dblclick` fire', function(assert) {});
// test('it should send `mouseout` on GMap event: `mouseout` fire', function(assert) {});
// test('it should send `dragstart` on GMap event: `dragstart` fire', function(assert) {});
// test('it should send `mousemove` on GMap event: `mousemove` fire', function(assert) {});
// test('it should send `mouseover` on GMap event: `mouseover` fire', function(assert) {});
// test('it should send `rightclick` on GMap event: `rightclick` fire', function(assert) {});
// test('it should send `tilesloaded` on GMap event: `tilesloaded` fire', function(assert) {});
// test('it should send `tilt_changed` on GMap event: `tilt_changed` fire', function(assert) {});
// test('it should send `zoom_changed` on GMap event: `zoom_changed` fire', function(assert) {});
// test('it should send `bounds_changed` on GMap event: `bounds_changed` fire', function(assert) {});
// test('it should send `center_changed` on GMap event: `center_changed` fire', function(assert) {});
// test('it should send `heading_changed` on GMap event: `heading_changed` fire', function(assert) {});
// test('it should send `maptypeid_changed` on GMap event: `maptypeid_changed` fire', function(assert) {});
// test('it should send `projection_changed` on GMap event: `projection_changed` fire', function(assert) {});


/////////////
// Helpers
////////////

// test('`_areCoordsEqual` should correctly compare 2 numbers within 12 digits', function(assert) {});
