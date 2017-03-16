import gMapService from 'ember-cli-g-maps/services/g-map';
import { module, test } from 'qunit';
import sinon from 'sinon';

const originalGoogleMap = google.maps.Map;

module('Unit | Service | g-map', {
  beforeEach() {
    google.maps.Map = function GoogleMapStub() {};
  },

  afterEach() {
    const gMap = gMapService.create();

    gMap.removeAll();

    google.maps.Map = originalGoogleMap;
  }
});

test('it should add a map that can be selected by name', (assert) => {
  const msg = 'added map that was selected by name';
  const name = 'test-1';
  const gMap = gMapService.create();
  const expected = new google.maps.Map();

  const result = gMap.maps.add(name, expected);
  assert.equal(typeof result, 'object', 'returns added item');

  const actual = gMap.maps.select(name).map;
  assert.equal(actual, expected, msg);
});

test('it should throw an error when name is not a string', (assert) => {
  const msg = 'error thrown when invalid name';
  const gMap = gMapService.create();

  assert.throws(() => gMap.maps.add(42, new google.maps.Map()), Error, msg);
});

test('it should throw an error when map is not a `google.maps.Map` instance', (assert) => {
  const msg = 'error thrown when invalid map';
  const gMap = gMapService.create();

  assert.throws(() => gMap.maps.add('error', {}), Error, msg);
});

test('it should throw an error when name already in use', (assert) => {
  const msg = 'error thrown when duplicate name';
  const name = 'duplicate';
  const gMap = gMapService.create();

  // Add name once
  gMap.addMap(name, new google.maps.Map());

  // Add name again
  assert.throws(() => gMap.maps.add(name, new google.maps.Map()), Error, msg);
});

test('it should remove a map by name', (assert) => {
  const msg = 'removed map is not selectable';
  const name = 'test-2';
  const myMap = new google.maps.Map();
  const gMap = gMapService.create();
  const expected = undefined; // jshint ignore:line

  // Assert map added
  gMap.maps.add(name, myMap);
  assert.ok(gMap.maps.select(name));

  assert.equal(gMap.maps.remove(name), true, 'remove is successful');

  const actual = gMap.maps.select(name);
  assert.equal(actual, expected, msg);
});

test('it should trigger a refresh on an added map', (assert) => {
  const msg = 'should trigger Google Maps "resize" event on map';

  // Setup and add map
  const name = 'test-3';
  const myMap = new google.maps.Map();
  const gMap = gMapService.create();
  gMap.maps.add(name, myMap);

  // Stub Google Maps event trigger
  const triggerSpy = sinon.spy();
  const originalTrigger = google.maps.event.trigger;
  google.maps.event.trigger = triggerSpy;

  // Trigger + test
  assert.equal(gMap.maps.refresh(name), true, 'refresh is successful');
  assert.ok(triggerSpy.calledWith(myMap, 'resize'), msg);

  // Cleanup
  google.maps.event.trigger = originalTrigger;
});

test('it should offer convenience methods for adding/selecting maps', (assert) => {
  const msg = 'added map that was selected by name';
  const name = 'test-4';
  const gMap = gMapService.create();
  const expected = new google.maps.Map();
  const result = gMap.addMap(name, expected);

  assert.equal(typeof result, 'object', 'returns added item');

  const actual = gMap.selectMap(name);

  assert.equal(actual, expected, msg);
});

test('it should auto-name maps when no name provided', (assert) => {
  const msg = 'added map that was selected by name';
  const gMap = gMapService.create();
  const expected = new google.maps.Map();
  const result = gMap.addMap(expected);
  const name = result.name;

  assert.equal(typeof result, 'object', 'returns added item');

  const actual = gMap.selectMap(name);

  assert.equal(actual, expected, msg);
});

test('.selectMap should return null when no matches found', (assert) => {
  const msg = 'null returned for name without a match';
  const gMap = gMapService.create();
  const myMap = new google.maps.Map();
  const expected = null;

  gMap.addMap(myMap);

  const actual = gMap.selectMap('my-bogus-name');

  assert.strictEqual(actual, expected, msg);
});

test('it should offer convenience methods for removing maps', (assert) => {
  const msg = 'removed map is not selectable';
  const myMap = new google.maps.Map();
  const gMap = gMapService.create();
  const expected = null;

  // Assert map added
  const name = gMap.addMap(myMap).name;

  assert.ok(gMap.selectMap(name));
  assert.equal(gMap.removeMap(name), true, 'remove is successful');

  const actual = gMap.selectMap(name);
  assert.strictEqual(actual, expected, msg);
});

test('.removeMap should return false when provided an invalid name', (assert) => {
  const msg = 'remove successful for name without a match';
  const gMap = gMapService.create();
  const myMap = new google.maps.Map();
  const expected = false;

  gMap.addMap(myMap);

  const actual = gMap.removeMap('my-bogus-name');

  assert.strictEqual(actual, expected, msg);
});

test('it should offer convenience method for refreshing maps', (assert) => {
  const msg = 'should trigger Google Maps "resize" event on map';

  // Setup and add map
  const name = 'test-5';
  const myMap = new google.maps.Map();
  const gMap = gMapService.create();

  gMap.addMap(name, myMap);

  // Stub Google Maps event trigger
  const triggerSpy = sinon.spy();
  const originalTrigger = google.maps.event.trigger;
  google.maps.event.trigger = triggerSpy;

  // Trigger + test
  assert.equal(gMap.refreshMap(name), true, 'refresh is successful');
  assert.ok(triggerSpy.calledWith(myMap, 'resize'), msg);

  // Cleanup
  google.maps.event.trigger = originalTrigger;
});

test('.list() should list map names', (assert) => {
  const msg = 'listed map names';
  const gMap = gMapService.create();
  const expected = ['map-1', 'map-2', 'map-3', 'map-4', 'map-5', 'map-6'];

  for (let i = 0; i < 6; i++) {
    let myMap = new google.maps.Map();

    gMap.addMap(myMap);
  }

  const actual = gMap.list();

  assert.deepEqual(actual, expected, msg);
});

test('.removeAll() should remove all maps', (assert) => {
  const msg = 'removeAll removes all maps';
  const gMap = gMapService.create();
  const expected = 0;

  for (let i = 0; i < 6; i++) {
    let myMap = new google.maps.Map();

    gMap.addMap(myMap);
  }

  assert.equal(gMap.list().length, 6, 'list length greater than 0');

  gMap.removeAll();

  const actual = gMap.list().length;

  assert.equal(actual, expected, msg);
});
