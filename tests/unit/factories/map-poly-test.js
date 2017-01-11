import RSVP from 'rsvp';
import mapPoly from 'ember-cli-g-maps/factories/map-poly';
import {pathDiff} from 'ember-cli-g-maps/factories/map-poly';
import {module, test} from 'qunit';
import {assign} from 'ember-platform';

module('Unit | Factory | mapPoly');

test('it requires correct configuration', function(assert) {
  assert.throws(() => mapPoly({}), 'requires component configuration');
  assert.throws(() => mapPoly({component: {}}), 'requires bound options');
  assert.throws(() => mapPoly({component: {}, bound: []}), 'requires an googleMapsInstanceScope');
  assert.throws(() => mapPoly({bound: [], component: {}, googleMapsInstanceScope: 'scope'}), 'requires insertGoogleMapInstance');
  assert.ok(mapPoly({
      googleMapsInstanceScope: 'scope',
      bound: [],
      component: {
        insertGoogleMapInstance() {}
      }
    }),
    'accepts valid configuration'
  );
});

test('it invokes `insertGoogleMapInstance` with configured options', function(assert) {
  const expected = {fillOpacity: 0.85, random: true};
  const instance = mapPoly({
    googleMapsInstanceScope: 'scope',
    bound: ['fillOpacity', 'random'],
    component: {
      insertGoogleMapInstance({fillOpacity, random}) {
        assert.equal(random, expected.random, 'received configured random option');
        assert.equal(fillOpacity, expected.fillOpacity, 'received configured fillOpacity option');
      }
    }
  });

  // Stub event binding
  instance.bindGoogleMapsInstanceEvents = () => {};

  instance._super = () => {};
  instance._loadGoogleMaps = () => RSVP.Promise.resolve();
  instance.fillOpacity = expected.fillOpacity;
  instance.random = expected.random;

  return instance._mapPolyDidInsertElement();
});

test('it calls set on Google Map instance path property with update', function(assert) {
  const newState = {
    path: [{lat: 1, lng: 0}]
  };

  const oldState = {
    path: [{lat: 0, lng: 0}]
  };

  const instance = mapPoly({
    googleMapsInstanceScope: 'scope',
    path: 'path',
    bound: [],
    component: {
      insertGoogleMapInstance() {}
    }
  });

  instance.scope = {
    set(key, value) {
      assert.equal(value, newState[key], `received update of ${key}`);
    },

    get(key) {
      return oldState[key];
    }
  };

  assign(instance, newState);
  instance._mapPolyDidUpdateAttrs();
});

test('it returns path strategies in expected order', function(assert) {
  const expected = [{lat: 1, lng: 1}];
  const notExpected = [{lat: 0, lng: 0}];
  const defaults = expected;

  const instance = mapPoly({
    googleMapsInstanceScope: 'scope',
    center: 'point',
    bound: [],
    defaults,
    component: {
      insertGoogleMapInstance() {}
    }
  });

  instance.path = expected;
  instance.options = {path: notExpected};

  assert.deepEqual(instance._mapPolyGetPath(), expected, 'selected top-level path');

  delete instance.path;
  instance.options.path = expected;

  assert.deepEqual(instance._mapPolyGetPath(), expected, 'selected options.path');
});

module('Unit | Factory | mapPoly | pathDiff');

test('it dectects any updates to path', function(assert) {
  assert.equal(pathDiff([{lat: 1, lng: 1}], [{lat: 1, lng: 1}]), false, 'detects no difference');
  assert.equal(pathDiff([{lat: 1, lng: 1}], []), true, 'detects difference');
  assert.equal(pathDiff([{lat: 1, lng: 1}], [{lat: 1.1, lng: 1}]), true, 'detects difference');
  assert.equal(pathDiff([{lat: 1, lng: 1}], [{lat: 1, lng: 1}, {lat: 2, lng: 2}]), true, 'detects difference');
});
