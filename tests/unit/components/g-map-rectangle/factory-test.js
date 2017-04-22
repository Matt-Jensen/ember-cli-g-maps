import googleMapRectangle from 'dummy/components/g-map-rectangle/factory';
import {module, test} from 'qunit';
import {assign} from 'ember-platform';
import {createGoogleMap} from '../../../helpers/google-maps';

module('Unit | Factory | Google Map Rectangle');

const DEFAULTS  = {bounds: {east: 1, north: 1, west: 1, south: 1}};

test('it returns a Google Map Rectangle instance as content', function(assert) {
  const instance = googleMapRectangle(createGoogleMap(), assign({}, DEFAULTS));
  assert.ok(instance.content instanceof google.maps.Rectangle);
});

test('it rejects improperly configured `bounds` settings', function(assert) {
  const invalidArrayLatLngLiterals = {bounds: [[1, 2], [{}, 3]]};
  const invalidLatLngLiterals = {bounds: [{lat: 1, lng: 2}]};
  const invalidLatLngBoundsLiteral = {bounds: {east: 2, north: 3, west: 4}};

  assert.throws(() => googleMapRectangle(createGoogleMap(), invalidArrayLatLngLiterals));
  assert.throws(() => googleMapRectangle(createGoogleMap(), invalidLatLngLiterals));
  assert.throws(() => googleMapRectangle(createGoogleMap(), invalidLatLngBoundsLiteral));
});

test('it returns the configured LatLngBoundsLiteral as `bounds` setting', function(assert) {
  const expected = {bounds: {east: 2, north: 3, west: 4, south: 5}};
  const instance = googleMapRectangle(createGoogleMap(), expected);
  assert.deepEqual(instance.get('bounds'), expected.bounds, 'resolves configured bounds as LatLngBoundsLiteral');
});

test('it returns the configured ArrayLatLngLiterals as `bounds` setting', function(assert) {
  const expected = {bounds: [[3, 2], [5, 4]]};
  const instance = googleMapRectangle(createGoogleMap(), expected);
  assert.deepEqual(instance.get('bounds'), expected.bounds, 'resolves configured bounds as ArrayLatLngLiterals');
});

test('it returns the configured LatLngLiterals as `bounds` setting', function(assert) {
  const expected = {bounds: [{lat: 3, lng: 2}, {lat: 5, lng: 4}]};
  const instance = googleMapRectangle(createGoogleMap(), expected);
  assert.deepEqual(instance.get('bounds'), expected.bounds, 'resolves configured bounds as LatLngLiterals');
});

test('it returns the configured clickable setting', function(assert) {
  const expected = {clickable: false};
  const instance = googleMapRectangle(createGoogleMap(), assign(expected, DEFAULTS));

  assert.equal(instance.get('clickable'), expected.clickable, 'resolves configured clickable');
});

test('it returns the configured draggable setting', function(assert) {
  const expected = {draggable: true};
  const instance = googleMapRectangle(createGoogleMap(), assign(expected, DEFAULTS));

  assert.equal(instance.get('draggable'), expected.draggable, 'resolves configured draggable');
});

test('it returns the configured editable setting', function(assert) {
  const expected = {editable: true};
  const instance = googleMapRectangle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('editable'), expected.editable, 'resolves configured editable');
});

test('it returns the configured fillColor setting', function(assert) {
  const expected = {fillColor: '#000000'};
  const instance = googleMapRectangle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('fillColor'), expected.fillColor, 'resolves configured fillColor');
});

test('it returns the configured fillOpacity setting', function(assert) {
  const expected = {fillOpacity: 0.85};
  const instance = googleMapRectangle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('fillOpacity'), expected.fillOpacity, 'resolves configured fillOpacity');
});

test('it returns the configured strokeColor setting', function(assert) {
  const expected = {strokeColor: '#000000'};
  const instance = googleMapRectangle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('strokeColor'), expected.strokeColor, 'resolves configured strokeColor');
});

test('it returns the configured strokeOpacity setting', function(assert) {
  const expected = {strokeOpacity: 0.85};
  const instance = googleMapRectangle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('strokeOpacity'), expected.strokeOpacity, 'resolves configured strokeOpacity');
});

test('it returns the configured strokePosition setting', function(assert) {
  const expected = {strokePosition: 'INSIDE'};
  const instance = googleMapRectangle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('strokePosition'), expected.strokePosition, 'resolves configured strokePosition');
});

test('it returns the configured strokeWeight setting', function(assert) {
  const expected = {strokeWeight: 20};
  const instance = googleMapRectangle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('strokeWeight'), expected.strokeWeight, 'resolves configured strokeWeight');
});

test('it returns the configured visible setting', function(assert) {
  const expected = {visible: false};
  const instance = googleMapRectangle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('visible'), expected.visible, 'resolves configured visible');
});

test('it returns the configured zIndex setting', function(assert) {
  const expected = {zIndex: 100};
  const instance = googleMapRectangle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('zIndex'), expected.zIndex, 'resolves configured zIndex');
});
