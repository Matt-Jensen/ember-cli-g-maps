import RSVP from 'rsvp';
import mapPoint from 'ember-cli-g-maps/factories/map-point';
import {module, test} from 'qunit';
import {assign} from 'ember-platform';

module('Unit | Factory | map point');

test('it requires correct configuration', function(assert) {
  assert.throws(() => mapPoint({}), 'requires component configuration');
  assert.throws(() => mapPoint({component: {}}), 'requires bound options');
  assert.throws(() => mapPoint({component: {}, bound: []}), 'requires an googleMapsInstanceScope');
  assert.throws(() => mapPoint({bound: [], component: {}, googleMapsInstanceScope: 'scope'}), 'requires insertGoogleMapInstance');
  assert.ok(mapPoint({
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
  const expected = {lat: 1, lng: 1};
  const instance = mapPoint({
    googleMapsInstanceScope: 'scope',
    bound: ['center', 'random'],
    component: {
      insertGoogleMapInstance({center, random}) {
        assert.ok(random, 'received configured random option');
        assert.deepEqual(center, expected, 'received configured center option');
      }
    }
  });

  // Stub event binding
  instance.bindGoogleMapsInstanceEvents = () => {};

  instance._super = () => {};
  instance._loadGoogleMaps = () => RSVP.Promise.resolve();
  instance.lat = expected.lat;
  instance.lng = expected.lng;
  instance.random = true;

  return instance._mapPointDidInsertElement();
});

test('it calls set on Google Map instance center property with updated center', function(assert) {
  const newState = {
    point: {lat: 1, lng: 1}
  };

  const oldState = {
    point: {lat: 0, lng: 0}
  };

  const instance = mapPoint({
    googleMapsInstanceScope: 'scope',
    center: 'point',
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
  instance._mapPointDidUpdateAttrs();
});

test('it returns centering strategies in expected order', function(assert) {
  const expected = {lat: 1, lng: 1};
  const notExpected = {lat: 0, lng: 0};
  const defaults = expected;

  const instance = mapPoint({
    googleMapsInstanceScope: 'scope',
    center: 'point',
    bound: [],
    defaults,
    component: {
      insertGoogleMapInstance() {}
    }
  });

  instance.options = {};
  instance.options.point = expected;
  instance.options.lat = notExpected.lat;
  instance.options.lng = notExpected.lng;
  instance.point = notExpected;

  assert.deepEqual(instance._mapPointGetCenter(), expected, 'selected options.center');

  delete instance.options.point;
  instance.options.lat = expected.lat;
  instance.options.lng = expected.lng;

  assert.deepEqual(instance._mapPointGetCenter(), expected, 'selected options.{lat,lng}');

  delete instance.options.lat;
  delete instance.options.lng;
  instance.point = expected;

  assert.deepEqual(instance._mapPointGetCenter(), expected, 'selected top level center/lat/lng');

  delete instance.point;
  assert.deepEqual(instance._mapPointGetCenter(), expected, 'selected fallback lat/lng');
});
