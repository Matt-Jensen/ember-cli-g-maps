import RSVP from 'rsvp';
import mapPoint from 'ember-cli-g-maps/factories/map-point';
import {getCenter} from 'ember-cli-g-maps/factories/map-point';
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

test('it invokes `updateGoogleMapInstance` with updated properties', function(assert) {
  assert.expect(2);

  const newState = {
    updatedValue: 1,
    updatedObj: {updated: true},
    notUpdated: 0
  };

  const oldState = {
    updatedValue: 0,
    updatedObj: {updated: false},
    notUpdated: 0
  };

  const instance = mapPoint({
    googleMapsInstanceScope: 'scope',
    bound: ['updatedValue', 'updatedObj', 'notUpdated', 'notDefined'],
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

  instance._super = () => {};
  assign(instance, newState);

  instance._mapPointDidUpdateAttrs();
});

module('Unit | Factory | map point | getCenter');

test('it returns centering strategies in expected order', function(assert) {
  let actual;
  const expected = {lat: 1, lng: 1};
  const notExpected = {lat: 0, lng: 0};

  actual = getCenter({center: expected}, notExpected, notExpected);
  assert.deepEqual(actual, expected, 'selected options.center');

  actual = getCenter({lat: expected.lat, lng: expected.lng}, notExpected, notExpected);
  assert.deepEqual(actual, expected, 'selected options.{lat,lng}');

  actual = getCenter({}, expected, notExpected);
  assert.deepEqual(actual, expected, 'selected top level center/lat/lng');

  actual = getCenter({}, {}, expected);
  assert.deepEqual(actual, expected, 'selected default lat/lng');
});
