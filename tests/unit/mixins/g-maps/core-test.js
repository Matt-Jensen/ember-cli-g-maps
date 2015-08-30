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
              onLoad: new Promise(() => {})
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
      if(gm && gm.map && typeof gm.destroy === 'function') { gm.destroy(); }
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

  subject.set('name', 'may-test-map');
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
  subject.setProperties({ mapType: 'SATELITE', isMapLoaded: false });
  assert.equal(subject._syncMapType(), false);
});

test('`_syncMapType` should not sync `mapType` if `mapType` is undefined', function(assert) {
  subject.set('isMapLoaded', false);
  subject._syncCenter = function() {};
  subject._initGMap();
  subject.setProperties({
    mapType: undefined,
    isMapLoaded: true,
    map: merge(subject.get('map'), {
      getCenter: function() { return { A: 1, F: 1 }; }
    })
  });
  assert.equal(subject._syncMapType(), false);
});

test('`_syncMapType` should sync set `mapType` if `isMapLoaded` is true', function(assert) {
  subject.set('isMapLoaded', false);
  subject._syncCenter = function() {};
  subject._initGMap();
  subject.setProperties({
    mapType: 'SATELITE',
    isMapLoaded: true,
    map: merge(subject.get('map'), {
      getCenter: function() { return { A: 1, F: 1 }; },
      map: {
        setOptions: function() {},
        getMapTypeId: function() { return 'ROADMAP'; },
        setMapTypeId: sinon.spy()
      }
    })
  });

  assert.ok(subject.get('map').map.setMapTypeId.called);
});


/////////////////////////////
// GMap Persistence Events
////////////////////////////

test('`_addGMapPersisters` should add GMap events on `ember-cli-g-map-loaded`', function(assert) {
  const addedEvents = [];
  const persistEvents = ['center_changed', 'zoom_changed'];
  const originalGMapsOn = GMaps.on;
  subject.set('map', { map: {} });

  GMaps.on = function(e) {
    addedEvents.push(e);
  };

  subject.trigger('ember-cli-g-map-loaded');
  assert.deepEqual(addedEvents, persistEvents);

  GMaps.on = originalGMapsOn;
});

test('`_addGMapPersisters` should call `_onCenterChanged` on GMap event: `center_changed` fire', function(assert) {
  assert.expect(1);
  const originalRunDebounce = Ember.run.debounce;

  Ember.run.debounce = function(target, func) {
    func.call(target);
  };

  subject._initGMap();
  subject._onCenterChanged = function() {
    assert.ok(true);
  };
  subject._addGMapPersisters();
  GMaps.fire('center_changed', subject.get('map').map);

  Ember.run.debounce = originalRunDebounce;
});

test('`_addGMapPersisters` should call `_onZoomChanged` on GMap event: `zoom_changed` fire', function(assert) {
  assert.expect(1);
  const originalRunLater = Ember.run.later;

  Ember.run.later = function(func) { return func(); };

  subject._initGMap();
  subject._onZoomChanged = function() {
    assert.ok(true);
  };
  subject._addGMapPersisters();
  GMaps.fire('zoom_changed', subject.get('map').map);

  Ember.run.later = originalRunLater;
});


///////////////////////
// On Center Changed
//////////////////////

test('`_onCenterChanged` should not sync if same as subject `lat`,`lng`', function(assert) {
  subject.setProperties({
    lat: 1, lng: 1, isMapLoaded: false,
    map: {
      getCenter: function() { return { A: 1, F: 1 }; }
    }
  });

  assert.equal(subject._onCenterChanged(), false);
});

test('`_onCenterChanged` should sync new `lat` & `lng` to subject', function(assert) {
  subject.setProperties({
    lat: 1, lng: 1, isMapLoaded: false,
    map: {
      getCenter: function() { return { A: 2, F: 2 }; }
    }
  });

  subject.setProperties = sinon.spy();

  subject._onCenterChanged();
  assert.ok(subject.setProperties.called);
});


/////////////////////
// On Zoom Changed
////////////////////

test('`_onZoomChanged` should not sync if same as subject `zoom`', function(assert) {
  subject.setProperties({
    zoom: 10, isMapLoaded: false,
    map: { map: { zoom: 10 } }
  });

  assert.equal(subject._onZoomChanged(), false);
});

test('`_onZoomChanged` should sync new `zoom`, `lat`, and `zoom` to subject', function(assert) {
  subject.setProperties({
    lat: 1, lng: 1, zoom: 1, 
    isMapLoaded: false,
    map: { 
      map: { zoom: 10 },
      getCenter: function() { return { A: 2, F: 2 }; }
    }
  });

  subject._onZoomChanged();

  assert.equal(subject.get('lat'), 2);
  assert.equal(subject.get('lng'), 2);
  assert.equal(subject.get('zoom'), 10);
});


////////////////////////
// Default GMap State
/////////////////////// 

test('`defaultGMapState` should return the current map bounds', function(assert) {
  subject.setProperties({
    map: {
      map: {
        getBounds: function() {
          return {
            Da: { j: 1, A: 1 },
            va: { j: 2, A: 2 }
          };
        }
      }
    }
  });

  assert.deepEqual(subject.get('defaultGMapState').bounds, [
    { lat: 1, lng: 2 },
    { lat: 1, lng: 2 },
    { lat: 1, lng: 2 },
    { lat: 1, lng: 2 }
  ]);
});

test('`defaultGMapState` should return `mapIdle` Promise to `idle`', function(assert) {
  assert.expect(2);
  const addListenerOnce = google.maps.event.addListenerOnce;

  google.maps.event.addListenerOnce = function(map, eventName) {
    if(eventName === 'idle') { 
      assert.ok(true);
      google.maps.event.addListenerOnce = addListenerOnce;
    }
  };

  subject._initGMap(); // set google map instance
  assert.ok(subject.get('defaultGMapState').mapIdle instanceof Promise);
});

test('`defaultGMapState` should return `mapTilesLoaded` Promise to `tilesloaded`', function(assert) {
  assert.expect(2);
  const addListenerOnce = google.maps.event.addListenerOnce;

  google.maps.event.addListenerOnce = function(map, eventName) {
    if(eventName === 'tilesloaded') { 
      assert.ok(true);
      google.maps.event.addListenerOnce = addListenerOnce;
    }
  };

  subject._initGMap(); // set google map instance
  assert.ok(subject.get('defaultGMapState').mapTilesLoaded instanceof Promise);
});


/////////////
// Actions
////////////

test('it should sendAction `idle` on GMap event: `idle` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'idle');
  };
  subject.set('idle', function() {});
  subject._initGMap();
  GMaps.fire('idle', subject.get('map').map);
});

test('it should sendAction `drag` on GMap event: `drag` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'drag');
  };
  subject.set('drag', function() {});
  subject._initGMap();
  GMaps.fire('drag', subject.get('map').map);
});

test('it should sendAction `click` on GMap event: `click` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'click');
  };
  subject.set('click', function() {});
  subject._initGMap();
  GMaps.fire('click', subject.get('map').map);
});

test('it should sendAction `resize` on GMap event: `resize` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'resize');
  };
  subject.set('resize', function() {});
  subject._initGMap();
  GMaps.fire('resize', subject.get('map').map);
});

test('it should sendAction `dragend` on GMap event: `dragend` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'dragend');
  };
  subject.set('dragend', function() {});
  subject._initGMap();
  GMaps.fire('dragend', subject.get('map').map);
});

test('it should sendAction `dblclick` on GMap event: `dblclick` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'dblclick');
  };
  subject.set('dblclick', function() {});
  subject._initGMap();
  GMaps.fire('dblclick', subject.get('map').map);
});

test('it should sendAction `mouseout` on GMap event: `mouseout` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'mouseout');
  };
  subject.set('mouseout', function() {});
  subject._initGMap();
  GMaps.fire('mouseout', subject.get('map').map);
});

test('it should sendAction `dragstart` on GMap event: `dragstart` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'dragstart');
  };
  subject.set('dragstart', function() {});
  subject._initGMap();
  GMaps.fire('dragstart', subject.get('map').map);
});

test('it should sendAction `mousemove` on GMap event: `mousemove` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'mousemove');
  };
  subject.set('mousemove', function() {});
  subject._initGMap();
  GMaps.fire('mousemove', subject.get('map').map);
});

test('it should sendAction `mouseover` on GMap event: `mouseover` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'mouseover');
  };
  subject.set('mouseover', function() {});
  subject._initGMap();
  GMaps.fire('mouseover', subject.get('map').map);
});

test('it should sendAction `rightclick` on GMap event: `rightclick` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'rightclick');
  };
  subject.set('rightclick', function() {});
  subject._initGMap();
  GMaps.fire('rightclick', subject.get('map').map);
});

test('it should sendAction `tilesloaded` on GMap event: `tilesloaded` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'tilesloaded');
  };
  subject.set('tilesloaded', function() {});
  subject._initGMap();
  GMaps.fire('tilesloaded', subject.get('map').map);
});

test('it should sendAction `tilt_changed` on GMap event: `tilt_changed` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'tilt_changed');
  };
  subject.set('tilt_changed', function() {});
  subject._initGMap();
  GMaps.fire('tilt_changed', subject.get('map').map);
});

test('it should sendAction `zoom_changed` on GMap event: `zoom_changed` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'zoom_changed');
  };
  subject.set('zoom_changed', function() {});
  subject._initGMap();
  GMaps.fire('zoom_changed', subject.get('map').map);
});

test('it should sendAction `bounds_changed` on GMap event: `bounds_changed` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'bounds_changed');
  };
  subject.set('bounds_changed', function() {});
  subject._initGMap();
  GMaps.fire('bounds_changed', subject.get('map').map);
});

test('it should sendAction `center_changed` on GMap event: `center_changed` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'center_changed');
  };
  subject.set('center_changed', function() {});
  subject._initGMap();
  GMaps.fire('center_changed', subject.get('map').map);
});

test('it should sendAction `heading_changed` on GMap event: `heading_changed` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'heading_changed');
  };
  subject.set('heading_changed', function() {});
  subject._initGMap();
  GMaps.fire('heading_changed', subject.get('map').map);
});

test('it should sendAction `maptypeid_changed` on GMap event: `maptypeid_changed` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'maptypeid_changed');
  };
  subject.set('maptypeid_changed', function() {});
  subject._initGMap();
  GMaps.fire('maptypeid_changed', subject.get('map').map);
});

test('it should sendAction `projection_changed` on GMap event: `projection_changed` fire', function(assert) {
  assert.expect(1);
  subject.send = function(name, e) {
    subject.actions[name].call(subject, e);
  };
  subject.sendAction = function(name) {
    assert.equal(name, 'projection_changed');
  };
  subject.set('projection_changed', function() {});
  subject._initGMap();
  GMaps.fire('projection_changed', subject.get('map').map);
});


/////////////
// Helpers
////////////

test('`_areCoordsEqual` should correctly compare 2 numbers within 12 digits', function(assert) {
  assert.ok(subject._areCoordsEqual(4.234234232324, 4.2342342323235555));
});