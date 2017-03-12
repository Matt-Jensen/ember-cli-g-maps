import mapIcon from 'dummy/factories/map-icon';
import {assign as emberAssign} from 'ember-platform';
import {module, test} from 'qunit';

const ICON_URL = 'beachflag.png';

module('Unit | Factory | mapIcon');

test('it does not change its\' configuration arugment', function(assert) {
  const actual = {
    anchor: {x: 1, y: 1},
    labelOrigin: {x: 1, y: 1},
    origin: {x: 1, y: 1},
    scaledSize: {width: 9, height: 9, widthUnit: 'px', heightUnit: 'em'},
    size: {width: 9, height: 9, widthUnit: 'px', heightUnit: 'em'},
    url: ICON_URL
  };

  const expected = emberAssign({}, actual);

  mapIcon(actual);
  assert.deepEqual(actual, expected, 'config remains unchanged');
});

test('it rejects a non-point literal as `anchor`, `labelOrigin`, or `origin`', function(assert) {
  assert.throws(() => mapIcon({url: '', anchor: {}}));
  assert.throws(() => mapIcon({url: '', labelOrigin: {}}));
  assert.throws(() => mapIcon({url: '', origin: {}}));
});

test('it rejects a non-size literal as `scaledSize` or `size`', function(assert) {
  assert.throws(() => mapIcon({url: '', scaledSize: {}}));
  assert.throws(() => mapIcon({url: '', size: {}}));
});

test('it converts anchor literal to a google.maps.Point instance', function(assert) {
  const instance = mapIcon({anchor: {x: 1, y: 1}, url: ICON_URL});
  assert.ok(instance.anchor instanceof google.maps.Point, 'anchor is a Google Maps Point');
});

test('it converts labelOrigin literal to a Point instance', function(assert) {
  const instance = mapIcon({labelOrigin: {x: 1, y: 1}, url: ICON_URL});
  assert.ok(instance.labelOrigin instanceof google.maps.Point, 'labelOrigin is a Google Maps Point');
});

test('it converts origin literal to a Point instance', function(assert) {
  const instance = mapIcon({origin: {x: 1, y: 1}, url: ICON_URL});
  assert.ok(instance.origin instanceof google.maps.Point, 'origin is a Google Maps Point');
});

test('it converts scaledSize literal to a size instance', function(assert) {
  const instance = mapIcon({scaledSize: {width: 1, height: 1, widthUnit: 'px', heightUnit: 'px'}, url: ICON_URL});
  assert.ok(instance.scaledSize instanceof google.maps.Size, 'scaledSize is a Google Maps Size');
});

test('it converts size literal to a size instance', function(assert) {
  const instance = mapIcon({size: {width: 1, height: 1, widthUnit: 'px', heightUnit: 'px'}, url: ICON_URL});
  assert.ok(instance.size instanceof google.maps.Size, 'size is a Google Maps Size');
});

test('it returns its\' original config via toJSON', function(assert) {
  const expected = {
    anchor: {x: 1, y: 1},
    labelOrigin: {x: 1, y: 1},
    origin: {x: 1, y: 1},
    scaledSize: {width: 9, height: 9},
    size: {width: 9, height: 9, widthUnit: 'px', heightUnit: 'em'},
    url: ICON_URL
  };

  const instance = mapIcon(expected);
  const actual = instance.toJSON();

  assert.deepEqual(actual, expected, 'toJSON response matches config');
});
