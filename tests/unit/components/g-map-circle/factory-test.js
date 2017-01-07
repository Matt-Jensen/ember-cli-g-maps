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

test('it allows valid updates of the circle center', function(assert) {
  const expected = {lat: 2, lng: 2};
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => circle.set('center', [-34, -90]), 'only accepts latLng literal');
  assert.throws(() => circle.set('center', {lat: 34}), 'requires a `lng` property');
  assert.throws(() => circle.set('center', {lng: -90}), 'requires a `lat` property');

  circle.set('center', expected);
  assert.deepEqual(circle.get('center'), expected, 'updated circle center');
});

test('it returns the configured clickable setting', function(assert) {
  const expected = {clickable: false};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('clickable'), expected.clickable, 'resolves configured clickable');
});

test('it only allows setting a valid clickable value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => circle.set('clickable', 'non-boolean'), 'rejects non-boolean value');

  circle.set('clickable', false);
  circle.notifyPropertyChange('clickable');
  assert.equal(circle.get('clickable'), false, 'updated clickable');
});

test('it allows setting clickable to false with any falsey value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));
  circle.set('clickable', NaN);
  circle.notifyPropertyChange('clickable');
  assert.equal(circle.get('clickable'), false, 'updated clickable with `NaN`');
});

test('it returns the configured draggable setting', function(assert) {
  const expected = {draggable: true};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('draggable'), expected.draggable, 'resolves configured draggable');
});

test('it only allows setting a valid draggable value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => circle.set('draggable', 'non-boolean'), 'rejects non-boolean value');

  circle.set('draggable', true);
  circle.notifyPropertyChange('draggable');
  assert.equal(circle.get('draggable'), true, 'updated draggable');
});

test('it allows setting draggable to false with any falsey value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({draggable: true}, DEFAULTS));
  circle.set('draggable', null);
  circle.notifyPropertyChange('draggable');
  assert.equal(circle.get('draggable'), false, 'updated draggable with `null`');
});

test('it returns the configured editable setting', function(assert) {
  const expected = {editable: true};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('editable'), expected.editable, 'resolves configured editable');
});

test('it only allows setting a valid editable value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => circle.set('editable', 'non-boolean'), 'rejects non-boolean value');

  circle.set('editable', true);
  circle.notifyPropertyChange('editable');
  assert.equal(circle.get('editable'), true, 'updated editable');
});

test('it allows setting editable to false with any falsey value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({editable: true}, DEFAULTS));
  circle.set('editable', NaN);
  circle.notifyPropertyChange('editable');
  assert.equal(circle.get('editable'), false, 'updated editable with `NaN`');
});

test('it returns the configured fillColor setting', function(assert) {
  const expected = {fillColor: '#000000'};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('fillColor'), expected.fillColor, 'resolves configured fillColor');
});

test('it only allows setting a valid fillColor value', function(assert) {
  const expected = '#000000';
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => circle.set('fillColor', true), 'rejects non-string value');

  circle.set('fillColor', expected);
  circle.notifyPropertyChange('fillColor');
  assert.equal(circle.get('fillColor'), expected, 'updated fillColor');
});

test('it allows setting fillColor to default with any falsey value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));
  const expected = circle.get('fillColor');

  circle.set('fillColor', '#D43029');
  circle.set('fillColor', null);
  circle.notifyPropertyChange('fillColor');
  assert.equal(circle.get('fillColor'), expected, 'updated fillColor with `null`');
});

test('it returns the configured fillOpacity setting', function(assert) {
  const expected = {fillOpacity: 0.85};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('fillOpacity'), expected.fillOpacity, 'resolves configured fillOpacity');
});

test('it only allows setting a valid fillOpacity value', function(assert) {
  const expected = 0.85;
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => circle.set('fillOpacity', true), 'rejects non-numeric value');
  assert.throws(() => circle.set('fillOpacity', 1.1), 'rejects opacity greater than 1');
  assert.throws(() => circle.set('fillOpacity', -0.1), 'rejects opacity less than 1');

  circle.set('fillOpacity', expected);
  circle.notifyPropertyChange('fillOpacity');
  assert.equal(circle.get('fillOpacity'), expected, 'updated fillOpacity');
});

test('it allows reseting fillOpacity to default with any falsey value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));
  const expected = circle.get('fillOpacity');

  circle.set('fillOpacity', 0.85);
  circle.set('fillOpacity', null);
  circle.notifyPropertyChange('fillOpacity');
  assert.equal(circle.get('fillOpacity'), expected, 'reset fillOpacity with `null`');
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

test('it only allows setting a valid strokeColor value', function(assert) {
  const expected = '#000000';
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => circle.set('strokeColor', true), 'rejects non-string value');

  circle.set('strokeColor', expected);
  circle.notifyPropertyChange('strokeColor');
  assert.equal(circle.get('strokeColor'), expected, 'updated strokeColor');
});

test('it allows setting strokeColor to none with any falsey value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));
  const expected = circle.get('strokeColor');

  circle.set('strokeColor', '#D43029');
  circle.set('strokeColor', null);
  circle.notifyPropertyChange('strokeColor');
  assert.equal(circle.get('strokeColor'), expected, 'updated strokeColor with `null`');
});

test('it returns the configured strokeOpacity setting', function(assert) {
  const expected = {strokeOpacity: 0.85};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('strokeOpacity'), expected.strokeOpacity, 'resolves configured strokeOpacity');
});

test('it only allows setting a valid strokeOpacity value', function(assert) {
  const expected = 0.85;
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => circle.set('strokeOpacity', true), 'rejects non-numeric value');
  assert.throws(() => circle.set('strokeOpacity', 1.1), 'rejects opacity greater than 1');
  assert.throws(() => circle.set('strokeOpacity', -0.1), 'rejects opacity less than 1');

  circle.set('strokeOpacity', expected);
  circle.notifyPropertyChange('strokeOpacity');
  assert.equal(circle.get('strokeOpacity'), expected, 'updated strokeOpacity');
});

test('it allows reseting strokeOpacity to default with any falsey value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));
  const expected = circle.get('strokeOpacity');
  circle.set('strokeOpacity', 0.85);
  circle.set('strokeOpacity', null);
  circle.notifyPropertyChange('strokeOpacity');
  assert.equal(circle.get('strokeOpacity'), expected, 'reset strokeOpacity with `null`');
});

test('it returns the configured strokePosition setting', function(assert) {
  const expected = {strokePosition: 'INSIDE'};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('strokePosition'), expected.strokePosition, 'resolves configured strokePosition');
});

test('it only allows setting a valid strokePosition value', function(assert) {
  const expected = 'INSIDE';
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => circle.set('strokePosition', true), 'rejects non-string value');
  assert.throws(() => circle.set('strokePosition', 'NON-POSITION'), 'rejects an invalid stroke position');

  circle.set('strokePosition', expected);
  circle.notifyPropertyChange('strokePosition');
  assert.equal(circle.get('strokePosition'), expected, 'updated strokePosition');
});

test('it allows reseting strokePosition to default with any falsey value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));
  const expected = circle.get('strokePosition');
  circle.set('strokePosition', 'INSIDE');
  circle.set('strokePosition', null);
  circle.notifyPropertyChange('strokePosition');
  assert.equal(circle.get('strokePosition'), expected, 'reset strokePosition with `null`');
});

test('it returns the configured strokeWeight setting', function(assert) {
  const expected = {strokeWeight: 20};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('strokeWeight'), expected.strokeWeight, 'resolves configured strokeWeight');
});

test('it only allows setting a valid strokeWeight value', function(assert) {
  const expected = 20;
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => circle.set('strokeWeight', true), 'rejects non-numeric value');

  circle.set('strokeWeight', expected);
  assert.equal(circle.get('strokeWeight'), expected, 'updated strokeWeight');
});

test('it allows reset strokeWeight to default with any falsey value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));
  const expected = circle.get('strokeWeight');

  circle.set('strokeWeight', 30);
  circle.set('strokeWeight', NaN);
  circle.notifyPropertyChange('strokeWeight');
  assert.equal(circle.get('strokeWeight'), expected, 'reset strokeWeight with `NaN`');
});

test('it returns the configured visible setting', function(assert) {
  const expected = {visible: false};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('visible'), expected.visible, 'resolves configured visible');
});

test('it only allows setting a valid visible value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => circle.set('visible', 'non-boolean'), 'rejects non-boolean value');

  circle.set('visible', false);
  circle.notifyPropertyChange('visible');
  assert.equal(circle.get('visible'), false, 'updated visible');
});

test('it allows setting visible to false with any falsey value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));
  circle.set('visible', NaN);
  circle.notifyPropertyChange('visible');
  assert.equal(circle.get('visible'), false, 'updated visible with `NaN`');
});

test('it returns the configured zIndex setting', function(assert) {
  const expected = {zIndex: 100};
  const circle = googleMapCircle(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(circle.get('zIndex'), expected.zIndex, 'resolves configured zIndex');
});

test('it only allows setting a valid zIndex value', function(assert) {
  const expected = 100;
  const circle = googleMapCircle(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => circle.set('zIndex', true), 'rejects non-numeric value');
  assert.throws(() => circle.set('zIndex', 100.1), 'rejects floating point numbers');

  circle.set('zIndex', expected);
  assert.equal(circle.get('zIndex'), expected, 'updated zIndex');
});

test('it allows setting zIndex to false with any falsey value', function(assert) {
  const circle = googleMapCircle(createGoogleMap(), assign({zIndex: 9}, DEFAULTS));
  circle.set('zIndex', NaN);
  circle.notifyPropertyChange('zIndex');
  assert.equal(circle.get('zIndex'), undefined, 'updated zIndex with `NaN`');
});
