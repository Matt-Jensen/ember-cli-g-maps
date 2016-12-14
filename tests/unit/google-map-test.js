import googleMap from 'ember-cli-g-maps/google-map';
import { isPresent } from 'ember-utils';
import { module, test } from 'qunit';

module('Unit | Proxy | Google Map');

test('it returns a Google Map instance as content', function(assert) {
  const map = googleMap(document.createElement('div'));
  assert.ok(map.content instanceof google.maps.Map);
});

test('it set map default options', function(assert) {
  const map = googleMap(document.createElement('div'));
  assert.ok(isPresent(map.content.minZoom), 'set default min zoom');
  assert.ok(isPresent(map.content.maxZoom), 'set default max zoom');
  assert.ok(isPresent(map.content.clickableIcons), 'set default clickable icons');
  assert.ok(isPresent(map.content.tilt), 'set default tilt');
});

test('it returns the center of the Map instance', function(assert) {
  const map = googleMap(document.createElement('div'));
  map.content.setCenter({ lat: 1, lng: 1 });

  const center = map.get('center');
  assert.equal(center.lat, 1, 'resolves correct latitude');
  assert.equal(center.lng, 1, 'resolves correct longitude');
});

test('it returns the center of the Map instance', function(assert) {
  const expected = {lat: 2, lng: 2};
  const map = googleMap(document.createElement('div'));
  map.content.setCenter({ lat: 1, lng: 1 });

  map.set('center', expected);

  assert.equal(map.get('center.lat'), expected.lat, 'updated latitude of map');
  assert.equal(map.get('center.lng'), expected.lat, 'updated longitude of map');
});

test('it only allows setting a valid min zoom', function(assert) {
  const map = googleMap(document.createElement('div'), {maxZoom: 5});
  assert.throws(() => map.set('minZoom', 5), 'does not allow min zoom above max zoom');
  assert.equal(map.set('minZoom', 4), map.content.minZoom, 'updated min zoom of map')
});

test('it only allows setting a valid max zoom', function(assert) {
  const map = googleMap(document.createElement('div'), {minZoom: 5});
  assert.throws(() => map.set('maxZoom', 5), 'does not allow max zoom below min zoom');
  assert.equal(map.set('maxZoom', 6), map.content.maxZoom, 'updated max zoom of map')
});

test('it returns the zoom level', function(assert) {
  const expected = 4;
  const map = googleMap(document.createElement('div'));

  map.content.setZoom(expected);

  assert.equal(map.get('zoom'), expected, 'resolves correct zoom level');
});

test('it throws if setting invalid zoom level', function(assert) {
  const map = googleMap(document.createElement('div'), {minZoom: 1, maxZoom: 10});
  assert.throws(() => map.set('zoom', 0), 'does not set below minimum');
  assert.throws(() => map.set('zoom', 11), 'does not set above maximum');
});

test('it updates map instance zoom with valid zoom level', function(assert) {
  const expected = 4;
  const map = googleMap(document.createElement('div'));
  map.content.setZoom(1);

  map.set('zoom', expected);

  assert.equal(map.content.getZoom(), expected, 'updated zoom of map');
});

test('it returns the map type id', function(assert) {
  const map = googleMap(document.createElement('div'));
  assert.equal(map.get('mapTypeId'), map.content.getMapTypeId().toUpperCase(), 'resolves correct map type');
});

test('it allows setting a valid map type id', function(assert) {
  const expected = 'SATELLITE';
  const map = googleMap(document.createElement('div'));

  assert.throws(() => map.set('mapTypeId', 'invalid'), 'only accpets valid map type ids');

  map.set('mapTypeId', expected.toLowerCase());
  assert.equal(expected, map.content.getMapTypeId().toUpperCase(), 'resolves new map type id');
});

test('it allows setting a valid clickable icons', function(assert) {
  const expected = false;
  const map = googleMap(document.createElement('div'), { clickableIcons: true });

  assert.throws(() => map.set('clickableIcons', 'non-boolean'), 'only accpets boolean value');

  map.set('clickableIcons', expected);
  assert.equal(expected, map.content.getClickableIcons(), 'resolves new clickable icons');
});

test('it only allows setting a valid tilt perspective', function(assert) {
  const expected = 45;
  const map = googleMap(document.createElement('div'), {tilt: 0});
  assert.throws(() => map.set('tilt', 32), 'does not allow invalid tilt values');

  map.set('tilt', expected);
  assert.equal(expected, map.content.getTilt(), 'updated tilt of map')
});
