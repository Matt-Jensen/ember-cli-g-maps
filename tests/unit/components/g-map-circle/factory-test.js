import googleMapCircle from 'ember-cli-g-maps/components/g-map-circle/factory';
import {module, test} from 'qunit';
import {assign} from 'ember-platform';
import {createGoogleMap} from '../../../helpers/google-maps';

module('Unit | Factory | Google Map Circle');

const DEFAULTS  = {
  center: {lat: 1, lng: 1},
  radius: 10000
};

test('it returns a Google Map Circle instance as content', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));
  assert.ok(circle.content instanceof google.maps.Circle);
});

test('it returns the configured center of the circle instance', function(assert) {
  const expected = DEFAULTS.center;
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));
  assert.deepEqual(circle.get('center'), expected, 'resolves correct center');
});

test('it returns the configured clickable setting', function(assert) {
  const expected = {clickable: false};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('clickable'), expected.clickable, 'resolves configured clickable');
});

test('it returns the configured draggable setting', function(assert) {
  const expected = {draggable: true};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('draggable'), expected.draggable, 'resolves configured draggable');
});

test('it returns the configured editable setting', function(assert) {
  const expected = {editable: true};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('editable'), expected.editable, 'resolves configured editable');
});

test('it returns the configured fillColor setting', function(assert) {
  const expected = {fillColor: '#000000'};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('fillColor'), expected.fillColor, 'resolves configured fillColor');
});

test('it returns the configured fillOpacity setting', function(assert) {
  const expected = {fillOpacity: 0.85};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('fillOpacity'), expected.fillOpacity, 'resolves configured fillOpacity');
});

test('it returns the configured radius setting', function(assert) {
  const expected = {radius: 1000};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('radius'), expected.radius, 'resolves configured radius');
});

test('it only allows setting a valid radius value', function(assert) {
  const expected = 1000;
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => circle.set('radius', true), 'rejects non-numeric value');

  circle.set('radius', expected);
  assert.equal(circle.get('radius'), expected, 'updated radius');
});

test('it returns the configured strokeColor setting', function(assert) {
  const expected = {strokeColor: '#000000'};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('strokeColor'), expected.strokeColor, 'resolves configured strokeColor');
});

test('it returns the configured strokeOpacity setting', function(assert) {
  const expected = {strokeOpacity: 0.85};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('strokeOpacity'), expected.strokeOpacity, 'resolves configured strokeOpacity');
});

test('it returns the configured strokePosition setting', function(assert) {
  const expected = {strokePosition: 'INSIDE'};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('strokePosition'), expected.strokePosition, 'resolves configured strokePosition');
});

test('it returns the configured strokeWeight setting', function(assert) {
  const expected = {strokeWeight: 20};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('strokeWeight'), expected.strokeWeight, 'resolves configured strokeWeight');
});

test('it returns the configured visible setting', function(assert) {
  const expected = {visible: false};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('visible'), expected.visible, 'resolves configured visible');
});

test('it returns the configured zIndex setting', function(assert) {
  const expected = {zIndex: 100};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('zIndex'), expected.zIndex, 'resolves configured zIndex');
});
