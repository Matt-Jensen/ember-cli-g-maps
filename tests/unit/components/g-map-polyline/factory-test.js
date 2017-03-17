import googleMapPolyline from 'dummy/components/g-map-polyline/factory';
import {module, test} from 'qunit';
import {assign} from 'ember-platform';
import {createGoogleMap} from '../../../helpers/google-maps';

module('Unit | Factory | Google Map Polyline');

const DEFAULTS  = {
  path: [{lat: 1, lng: 1}]
};

const SVG_NOTATION = 'M10 10 H 90 V 90 H 10 L 10 10';

test('it returns a Google Map Polyline instance as content', function(assert) {
  const instance = googleMapPolyline(createGoogleMap(), assign({}, DEFAULTS));
  assert.ok(instance.content instanceof google.maps.Polyline);
});

test('it returns the configured clickable setting', function(assert) {
  const expected = {clickable: false};
  const instance = googleMapPolyline(createGoogleMap(), assign(expected, DEFAULTS));

  assert.equal(instance.get('clickable'), expected.clickable, 'resolves configured clickable');
});

test('it returns the configured draggable setting', function(assert) {
  const expected = {draggable: true};
  const instance = googleMapPolyline(createGoogleMap(), assign(expected, DEFAULTS));

  assert.equal(instance.get('draggable'), expected.draggable, 'resolves configured draggable');
});

test('it returns the configured editable setting', function(assert) {
  const expected = {editable: true};
  const instance = googleMapPolyline(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('editable'), expected.editable, 'resolves configured editable');
});

test('it returns the configured geodesic setting', function(assert) {
  const expected = {geodesic: true};
  const instance = googleMapPolyline(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('geodesic'), expected.geodesic, 'resolves configured geodesic');
});

test('it returns undefined if icons is not explicitly set', function(assert) {
  const instance = googleMapPolyline(createGoogleMap(), assign({}, DEFAULTS));
  const actual = instance.get('icons');

  assert.strictEqual(actual, undefined);
});

test('it returns the same icons configuration from via get', function(assert) {
  const instance = googleMapPolyline(createGoogleMap(), assign({}, DEFAULTS));
  const expected = {
    icon: {path: SVG_NOTATION},
    fixedRotation: true,
    offset: '50%',
    repeat: '50%'
  };

  instance.set('icons', expected);
  const actual = instance.get('icons');

  assert.deepEqual(actual, expected);
});

test('it returns the configured path setting', function(assert) {
  const expected = {
    path: [{lat: 2, lng: 2}]
  };
  const instance = googleMapPolyline(createGoogleMap(), expected);
  assert.deepEqual(instance.get('path'), expected.path, 'resolves configured path');
});

test('it returns the configured strokeColor setting', function(assert) {
  const expected = {strokeColor: '#000000'};
  const instance = googleMapPolyline(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('strokeColor'), expected.strokeColor, 'resolves configured strokeColor');
});

test('it returns the configured strokeOpacity setting', function(assert) {
  const expected = {strokeOpacity: 0.85};
  const instance = googleMapPolyline(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('strokeOpacity'), expected.strokeOpacity, 'resolves configured strokeOpacity');
});

test('it returns the configured strokeWeight setting', function(assert) {
  const expected = {strokeWeight: 20};
  const instance = googleMapPolyline(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('strokeWeight'), expected.strokeWeight, 'resolves configured strokeWeight');
});

test('it returns the configured visible setting', function(assert) {
  const expected = {visible: false};
  const instance = googleMapPolyline(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('visible'), expected.visible, 'resolves configured visible');
});

test('it returns the configured zIndex setting', function(assert) {
  const expected = {zIndex: 100};
  const instance = googleMapPolyline(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(instance.get('zIndex'), expected.zIndex, 'resolves configured zIndex');
});
