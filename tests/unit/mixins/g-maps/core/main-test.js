import Ember from 'ember';
import coreMainMixin from 'ember-cli-g-maps/mixins/g-maps/core/main';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/core/main');

test('_addMapEvents should not add unactive `_gmapEvents`', function(assert) {
  const coreMainObject = Ember.Object.extend(coreMainMixin);
  const subject = coreMainObject.create();

  const addedEvents = [];
  const originalGMapsOn = GMaps.on;

  GMaps.on = function(event) {
    addedEvents.push(event);
  };

  subject._addMapEvents();
  assert.deepEqual(addedEvents, [], 'should not add unactive events');

  GMaps.on = originalGMapsOn;
});

test('_addMapEvents should add active `_gmapEvents`', function(assert) {
  const coreMainObject = Ember.Object.extend(coreMainMixin);
  const subject = coreMainObject.create();

  const noop = function() {};
  const addedEvents = [];
  const originalGMapsOn = GMaps.on;
  const events = subject._gmapEvents;

  GMaps.on = function(event) {
    addedEvents.push(event);
  };

  // Add all supported events
  events.forEach((e) => subject.set(e, noop));

  subject._addMapEvents();
  assert.deepEqual(addedEvents, events, 'should add all active events');

  GMaps.on = originalGMapsOn;
});

test('_removeMapEvents should not remove unactive `_gmapEvents`', function(assert) {
  const coreMainObject = Ember.Object.extend(coreMainMixin);
  const subject = coreMainObject.create();

  const addedEvents = [];
  const originalGMapsOn = GMaps.on;

  GMaps.off = function(event) {
    addedEvents.push(event);
  };

  subject._removeMapEvents();
  assert.deepEqual(addedEvents, [], 'should not remove unactive events');

  GMaps.off = originalGMapsOn;
});

test('_removeMapEvents should remove active `_gmapEvents`', function(assert) {
  const coreMainObject = Ember.Object.extend(coreMainMixin);
  const subject = coreMainObject.create();

  const noop = function() {};
  const addedEvents = [];
  const originalGMapsOn = GMaps.off;
  const events = subject._gmapEvents;

  GMaps.off = function(event) {
    addedEvents.push(event);
  };

  // Add all supported events
  events.forEach((e) => subject.set(e, noop));

  subject._removeMapEvents();
  assert.deepEqual(addedEvents, events, 'should remove all active events');

  GMaps.off = originalGMapsOn;
});

test('_onMapLoad should do nothing if `isDestroyed` = true', function(assert) {
  const coreMainObject = Ember.Object.extend(coreMainMixin);
  const subject = coreMainObject.create();

  Ember.run(() => subject.destroy());

  assert.equal(subject._onMapLoad(), false, 'should return immediately');
});

test('_onMapLoad should trigger load actions if `isDestroyed` = falsey', function(assert) {
  assert.expect(2);

  const coreMainObject = Ember.Object.extend(coreMainMixin);
  const subject = coreMainObject.create();

  subject.send = event => subject.actions[event]();
  subject.actions = {
    loaded() {
      assert.ok(true, 'should send `loaded` action');
    }
  };

  subject._onMapLoad({});
  assert.equal(subject.get('isMapLoaded'), true, 'should set `isMapActive` to true');
});

test('`defaultGMapState` should return the current map bounds', function(assert) {
  const coreMainObject = Ember.Object.extend(coreMainMixin);
  const subject = coreMainObject.create();

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
});
