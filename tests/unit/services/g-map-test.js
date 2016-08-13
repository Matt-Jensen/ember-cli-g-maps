import gMapService from 'ember-cli-g-maps/services/g-map';
import { module, test } from 'qunit';
import sinon from 'sinon';

const originalGoogleMap = google.maps.Map;

module('Unit | Service | g-map', {
  beforeEach() {
    google.maps.Map = function GoogleMapStub() {};
  },

  afterEach() {
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
