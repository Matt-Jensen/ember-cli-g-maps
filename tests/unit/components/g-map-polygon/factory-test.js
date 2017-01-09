import googleMapPolygon from 'dummy/components/g-map-polygon/factory';
import {module, test} from 'qunit';
import {assign} from 'ember-platform';
import {createGoogleMap} from '../../../helpers/google-maps';

module('Unit | Factory | Google Map Polygon');

const DEFAULTS  = {
  path: [{lat: 1, lng: 1}]
};

test('it returns a Google Map Polygon instance as content', function(assert) {
  const instance = googleMapPolygon(createGoogleMap(), assign({}, DEFAULTS));
  assert.ok(instance.content instanceof google.maps.Polygon);
});

test('it returns the configured clickable setting', function(assert) {
  const expected = {clickable: false};
  const instance = googleMapPolygon(createGoogleMap(), assign(expected, DEFAULTS));

  assert.equal(instance.get('clickable'), expected.clickable, 'resolves configured clickable');
});

test('it returns the configured draggable setting', function(assert) {
  const expected = {draggable: true};
  const instance = googleMapPolygon(createGoogleMap(), assign(expected, DEFAULTS));

  assert.equal(instance.get('draggable'), expected.draggable, 'resolves configured draggable');
});

test('it returns the configured editable setting', function(assert) {
  const expected = {editable: true};
  const instance = googleMapPolygon(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('editable'), expected.editable, 'resolves configured editable');
});

test('it returns the configured fillColor setting', function(assert) {
  const expected = {fillColor: '#000000'};
  const instance = googleMapPolygon(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('fillColor'), expected.fillColor, 'resolves configured fillColor');
});

test('it returns the configured fillOpacity setting', function(assert) {
  const expected = {fillOpacity: 0.85};
  const instance = googleMapPolygon(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('fillOpacity'), expected.fillOpacity, 'resolves configured fillOpacity');
});

test('it returns the configured geodesic setting', function(assert) {
  const expected = {geodesic: true};
  const instance = googleMapPolygon(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('geodesic'), expected.geodesic, 'resolves configured geodesic');
});

test('it returns the configured path setting', function(assert) {
  const expected = {
    path: [{lat: 2, lng: 2}]
  };
  const instance = googleMapPolygon(createGoogleMap(), expected);
  assert.deepEqual(instance.get('path'), expected.path, 'resolves configured path');
});

test('it only allows setting a valid path value', function(assert) {
  const expected = [{lat: 2, lng: 2}];
  const instance = googleMapPolygon(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => instance.set('path', true), 'rejects non-array path');
  assert.throws(() => instance.set('path', []), 'rejects array without coordinates');
  assert.throws(() => instance.set('path', [1, 2]), 'rejects array without LatLng literals');
  assert.throws(() => instance.set('path', [{lat: 1}]), 'rejects valid LatLng literal');

  instance.set('path', expected);
  assert.deepEqual(instance.get('path'), expected, 'updated path');
});

test('it returns the configured strokeColor setting', function(assert) {
  const expected = {strokeColor: '#000000'};
  const instance = googleMapPolygon(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('strokeColor'), expected.strokeColor, 'resolves configured strokeColor');
});

test('it returns the configured strokeOpacity setting', function(assert) {
  const expected = {strokeOpacity: 0.85};
  const instance = googleMapPolygon(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('strokeOpacity'), expected.strokeOpacity, 'resolves configured strokeOpacity');
});

test('it returns the configured strokePosition setting', function(assert) {
  const expected = {strokePosition: 'INSIDE'};
  const instance = googleMapPolygon(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('strokePosition'), expected.strokePosition, 'resolves configured strokePosition');
});

test('it returns the configured strokeWeight setting', function(assert) {
  const expected = {strokeWeight: 20};
  const instance = googleMapPolygon(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('strokeWeight'), expected.strokeWeight, 'resolves configured strokeWeight');
});

test('it returns the configured visible setting', function(assert) {
  const expected = {visible: false};
  const instance = googleMapPolygon(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('visible'), expected.visible, 'resolves configured visible');
});

test('it returns the configured zIndex setting', function(assert) {
  const expected = {zIndex: 100};
  const instance = googleMapPolygon(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('zIndex'), expected.zIndex, 'resolves configured zIndex');
});
