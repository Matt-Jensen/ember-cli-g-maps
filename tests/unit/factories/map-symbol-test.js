import mapSymbol from 'ember-cli-g-maps/factories/map-symbol';
import {module, test} from 'qunit';

const SVG_NOTATION = 'M10 10 H 90 V 90 H 10 L 10 10';

module('Unit | Factory | mapSymbol');

test('it does not change its\' configuration arugment', function(assert) {
  const actual = {
    anchor: {x: 1, y: 1},
    fillColor: '#000000',
    fillOpacity: 1,
    labelOrigin: {x: 1, y: 1},
    path: 'circle',
    rotation: 90,
    scale: 2,
    strokeColor: '#000000',
    strokeOpacity: 0.5,
    strokeWeight: 3
  };

  const expected = Object.assign({}, actual);

  mapSymbol(actual);
  assert.deepEqual(actual, expected, 'config remains unchanged');
});

test('it rejects a non-point literal as `anchor` or `labelOrigin`', function(assert) {
  assert.throws(() => mapSymbol({path: '', anchor: {}}));
  assert.throws(() => mapSymbol({path: '', labelOrigin: {}}));
});

test('it converts anchor literal to a google.maps.Point instance', function(assert) {
  const instance = mapSymbol({anchor: {x: 1, y: 1}, path: 'circle'});
  assert.ok(instance.anchor instanceof google.maps.Point, 'anchor is a Google Maps Point');
});

test('it converts labelOrigin literal to a google.maps.Point instance', function(assert) {
  const instance = mapSymbol({labelOrigin: {x: 1, y: 1}, path: 'circle'});
  assert.ok(instance.labelOrigin instanceof google.maps.Point, 'labelOrigin is a Google Maps Point');
});

test('it sets path with the SymbolPath id matching the given name', function(assert) {
  const path = 'CIRCLE';
  const expected = google.maps.SymbolPath[path];
  const instance = mapSymbol({path});
  assert.equal(instance.path, expected, 'path is a Symbol Path id');
});

test('it sets path with valid SVG notation path', function(assert) {
  const expected = SVG_NOTATION;
  const instance = mapSymbol({path: expected});
  assert.equal(instance.path, expected, 'path is in SVG notation');
});

test('it returns its\' original config via toJSON', function(assert) {
  const expected = {
    anchor: {x: 1, y: 1},
    fillColor: '#000000',
    fillOpacity: 1,
    labelOrigin: {x: 1, y: 1},
    path: 'CIRCLE',
    rotation: 90,
    scale: 2,
    strokeColor: '#000000',
    strokeOpacity: 0.5,
    strokeWeight: 3
  };

  const instance = mapSymbol(expected);
  const actual = instance.toJSON();

  assert.deepEqual(actual, expected, 'toJSON response matches config');
});
