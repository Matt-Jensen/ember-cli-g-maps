import Ember from 'ember';
import GMapsCoreMixin from 'ember-cli-g-maps/mixins/g-maps/core';
import { module, test } from 'qunit';
import sinon from 'sinon';

const { merge } = Ember;

let sourceGoogleMapsAddListenerOnce;
const emberTestingDiv = document.getElementById('ember-testing');

function createSubject() {
  let mapDiv = document.createElement('div');
  mapDiv.id = `map-id-${Ember.uuid()}`;
  emberTestingDiv.appendChild(mapDiv);

  const GMapsCoreObject = Ember.Object.extend(GMapsCoreMixin, Ember.Evented, {
    element: mapDiv,

    _mapDiv: mapDiv,

    // Mock gMap service
    gMap: {
      maps: {
        add: function() {
          return {
            onLoad: new Ember.RSVP.Promise(() => {})
          };
        },
        remove: function() {}
      }
    },

    map: {
      map: {
        getBounds: function() {
          return {
            getNorthEast: function() {
              return {
                lat: function() { return 1; },
                lng: function() { return 1; }
              };
            },
            getSouthWest: function() {
              return {
                lat: function() { return 2; },
                lng: function() { return 2; }
              };
            }
          };
        }
      }
    },

    send: function() {}
  });

  return GMapsCoreObject.create();
}

function removeSubject(subject) {
  const gm = subject.get('map');

  // Clean up any instantiated GMaps
  Ember.run.later(() => {
    if(gm && gm.map && typeof gm.destroy === 'function') { gm.destroy(); }
  }, 10); // run after `_destroyGMap` if needed

  emberTestingDiv.removeChild(subject._mapDiv);
}

module('Unit | Mixin | g maps/core', {
  beforeEach: function() {
    sourceGoogleMapsAddListenerOnce = google.maps.event.addListenerOnce;
    google.maps.event.addListenerOnce = function addListenerOnce(map, eventName, invoke) {
      invoke();
    };
  },
  afterEach: function() {
    google.maps.event.addListenerOnce = sourceGoogleMapsAddListenerOnce;
  }
});


///////////////
// Init Core
//////////////

test('`_initGMap` should invoke on `didInsertElement` event', function(assert) {
  const subject = createSubject();

  subject._initGMap = sinon.spy();
  subject.trigger('didInsertElement');
  assert.ok(subject._initGMap.called);

  Ember.run.later(() => removeSubject(subject));
});

test('`_initGMap` should create a GMap instance with main config properties', function(assert) {
  const subject = createSubject();
  const config = {
    lat: 1,
    lng: 1,
    zoom: 10,
    mapType: 'satellite',
    mapTypeControl: false,
    zoomControl: false,
    scaleControl: false,
    disableDefaultUI: true
  };

  subject.setProperties(config);
  subject._initGMap();

  const googleMap = subject.get('googleMap');

  const zoom = googleMap.zoom;
  const center = googleMap.getCenter();
  const mapType = googleMap.getMapTypeId();
  const mapTypeControl = googleMap.mapTypeControl;
  const zoomControl = googleMap.zoomControl;
  const scaleControl = googleMap.scaleControl;
  const disableDefaultUI = googleMap.disableDefaultUI;

  assert.equal(center.lat(), config.lat, 'Map lat should be same as config');
  assert.equal(center.lng(), config.lng, 'Map lng should be same as config');
  assert.equal(zoom, config.zoom, 'Map zoom should be same as config');
  assert.equal(mapType, config.mapType, 'Map type should be same as config');
  assert.equal(mapTypeControl, config.mapTypeControl, 'Map Type Control should be same as config');
  assert.equal(zoomControl, config.zoomControl, 'Map Zoom Control should be same as config');
  assert.equal(scaleControl, config.scaleControl, 'Map Scale Control should be same as config');
  assert.equal(disableDefaultUI, config.disableDefaultUI, 'Map disable default UI should be same as config');

  Ember.run.later(() => removeSubject(subject));
});

test('`_initGMap` should set all configured gmap events', function(assert) {
  const subject = createSubject();

  const noop            = function() {};
  const addedEvents     = [];
  const originalGMapsOn = GMaps.on;
  const supportedEvents = subject._gmapEvents;
  subject._addGMapPersisters = function() {};

  GMaps.on = function(event) {
    addedEvents.push(event);
  };

  // Add all supported events
  supportedEvents.forEach((e) => subject.set(e, noop));

  subject._initGMap();
  assert.equal(addedEvents.length, supportedEvents.length);

  GMaps.on = originalGMapsOn;

  Ember.run.later(() => removeSubject(subject));
});

test('`_initGMap` should set a given name if provided', function(assert) {
  const subject = createSubject();

  subject.set('name', 'my-cool-map');
  subject._initGMap();

  assert.equal(subject.get('name'), 'my-cool-map');

  Ember.run.later(() => removeSubject(subject));
});

test('`_initGMap` should automatically set a `name` if none provided', function(assert) {
  const subject = createSubject();

  subject._initGMap();
  assert.ok(subject.get('name').length);

  Ember.run.later(() => removeSubject(subject));
});

test('`_initGMap` should add a map to the `gMap` service with same `name`', function(assert) {
  const subject = createSubject();

  assert.expect(1);
  subject.set('name', 'Marmaduke');

  subject.gMap.maps.add = function(name) {
    assert.equal(name, 'Marmaduke');
    return { onLoad: new Ember.RSVP.Promise(() => {}) };
  };

  subject._initGMap();

  Ember.run.later(() => removeSubject(subject));
});

test('`_initGMap` should addListenerOnce `idle` event via google.maps.event', function(assert) {
  const subject = createSubject();

  assert.expect(1);

  // Assert ok if idle event was ever subscribed
  google.maps.event.addListenerOnce = function(map, eventName) {
    if(eventName === 'idle') { assert.ok(true); }
  };

  subject._initGMap();
  Ember.run.later(() => removeSubject(subject));
});

test('`_initGMap` load should set `isMapLoaded` and trigger `ember-cli-g-map-loaded`', function(assert) {
  const subject = createSubject();

  assert.expect(2);
  subject.trigger = sinon.spy();
  subject._initGMap();

  assert.equal(true, subject.isMapLoaded);
  assert.equal('ember-cli-g-map-loaded', subject.trigger.args[0][0]);

  Ember.run.later(() => removeSubject(subject));
});

test('`_initGMap` load should send `loaded` event', function(assert) {
  const subject = createSubject();

  subject.send = sinon.spy();
  subject._initGMap();

  assert.equal('loaded', subject.send.args[0][0]);

  Ember.run.later(() => removeSubject(subject));
});

/////////////////
// Destroy Core
/////////////////

test('`_destroyGMap` should invoke on `willDestroyElement` event', function(assert) {
  const subject = createSubject();

  subject._destroyGMap = sinon.spy();
  subject.trigger('willDestroyElement');
  assert.ok(subject._destroyGMap.called);

  Ember.run.later(() => removeSubject(subject));
});

test('`_destroyGMap` should remove all bound GMap events', function(assert) {
  const subject = createSubject();

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
  Ember.run.later(() => removeSubject(subject));
});

test('`_destroyGMap` should remove gMap instance added to gMap service', function(assert) {
  const subject = createSubject();

  assert.expect(1);

  subject.set('name', 'may-test-map');
  subject.gMap.maps.remove = function(name) {
    assert.equal(name, 'may-test-map');
    removeSubject(subject);
  };
  subject._initGMap();
  subject._destroyGMap();
});

/////////////////////////////
// GMap Persistence Events
////////////////////////////

// // TODO: Replace with integration test
// test('`_addGMapPersisters` should call `_onCenterChanged` on GMap event: `center_changed` fire', function(assert) {
//   assert.expect(1);
//
//   const subject = createSubject();
//   const originalRunDebounce = Ember.run.debounce;
//
//   subject.trigger = function() {};
//   Ember.run.debounce = function(target, func) {
//     func.call(target);
//   };
//
//   subject._initGMap();
//   subject._onCenterChanged = function() {
//     assert.ok(true);
//     removeSubject(subject);
//   };
//   subject._addGMapPersisters();
//   GMaps.fire('center_changed', subject.get('map').map);
//
//   Ember.run.debounce = originalRunDebounce;
// });

// TODO: Replace with integration test
// test('`_addGMapPersisters` should call `_onZoomChanged` on GMap event: `zoom_changed` fire', function(assert) {
//   assert.expect(1);
//
//   const subject = createSubject();
//   const originalRunLater = Ember.run.later;
//   Ember.run.later = function(func) { return func(); };
//
//   subject._initGMap();
//   subject._onZoomChanged = function() {
//     assert.ok(true);
//     removeSubject(subject);
//   };
//   subject._addGMapPersisters();
//   GMaps.fire('zoom_changed', subject.get('map').map);
//
//   Ember.run.later = originalRunLater;
// });


////////////////////////
// Default GMap State
///////////////////////

test('`defaultGMapState` should return the current map bounds', function(assert) {
  const subject = createSubject();

  subject.setProperties({
    map: {
      map: {
        getBounds: function() {
          return {
            getNorthEast: function() {
              return {
                lat: function() { return 1; },
                lng: function() { return 1; }
              };
            },
            getSouthWest: function() {
              return {
                lat: function() { return 2; },
                lng: function() { return 2; }
              };
            }
          };
        }
      }
    }
  });

  assert.deepEqual(subject.get('defaultGMapState').bounds, [
    { lat: 1, lng: 1, location: 'northeast' },
    { lat: 2, lng: 2, location: 'southwest' }
  ]);

  Ember.run.later(() => removeSubject(subject));
});

test('`defaultGMapState` should return `mapIdle` Promise to `idle`', function(assert) {
  assert.expect(2);

  const subject = createSubject();
  google.maps.event.addListenerOnce = sinon.spy();

  assert.ok(subject.get('defaultGMapState').mapIdle instanceof Ember.RSVP.Promise);
  assert.ok(google.maps.event.addListenerOnce.called);
});

test('`defaultGMapState` should return `mapTilesLoaded` Promise to `tilesloaded`', function(assert) {
  assert.expect(2);

  const subject = createSubject();
  google.maps.event.addListenerOnce = sinon.spy();

  assert.ok(subject.get('defaultGMapState').mapTilesLoaded instanceof Ember.RSVP.Promise);
  assert.ok(google.maps.event.addListenerOnce.called);
});


/////////////
// Actions
////////////

/* TODO fix race conditions:

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
*/
