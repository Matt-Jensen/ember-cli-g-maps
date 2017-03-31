import mapIconSequence from 'dummy/factories/map-icon-sequence';
import {assign} from 'ember-platform';
import {module, test} from 'qunit';

const SVG_NOTATION = 'M10 10 H 90 V 90 H 10 L 10 10';

module('Unit | Factory | mapIconSequence');

test('it does not change its\' configuration arugment', function(assert) {
  const actual = [{
    fixedRotation: true,
    offset: '50%',
    repeat: '50%',
    icon: {path: SVG_NOTATION}
  }];

  const expected = assign([], actual);

  mapIconSequence(actual);
  assert.deepEqual(actual, expected, 'config remains unchanged');
});

test('it rejects a non-array configuration', function(assert) {
  assert.throws(() => mapIconSequence({}));
});

test('it rejects a configuration without an `icon` object', function(assert) {
  assert.throws(() => mapIconSequence([{icon: true}]));
});

test('it rejects a non-boolean as `fixedRotation`', function(assert) {
  assert.throws(() => mapIconSequence([{
    icon: {path: SVG_NOTATION},
    fixedRotation: '100'
  }]));
});

test('it rejects a non-string as `offset`', function(assert) {
  assert.throws(() => mapIconSequence([{
    icon: {path: SVG_NOTATION},
    offset: 20
  }]));
});

test('it rejects a non-string as `repeat`', function(assert) {
  assert.throws(() => mapIconSequence([{
    icon: {path: SVG_NOTATION},
    repeat: 20
  }]));
});

test('it returns its\' original config via toJSON', function(assert) {
  const expected = [{
    icon: {path: SVG_NOTATION},
    fixedRotation: true,
    offset: '10%',
    repeat: '50%'
  }];

  const instance = mapIconSequence(expected);
  const actual = instance.map(icon => icon.toJSON());

  assert.deepEqual(actual, expected, 'toJSON response matches config');
});
