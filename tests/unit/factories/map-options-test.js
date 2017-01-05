import {default as mapOptions, isDiff} from 'ember-cli-g-maps/factories/map-options';
import {module, test} from 'qunit';
import {assign} from 'ember-platform';
import get from 'ember-metal/get';

module('Unit | Factory | map options');

test('it requires a array of bound options', function(assert) {
  assert.throws(() => mapOptions(), 'rejects without Google Maps Instance Scope');
  assert.throws(() => mapOptions('scope'), 'rejects without bound options');
});

test('it creates options CP that return all defined bound properties', function(assert) {
  const bound = ['found', 'notFound'];
  const instance = mapOptions('scope', bound);
  instance.found = true;

  assert.equal(get(instance, 'options').found, true, 'returns defined bound option');
  assert.equal(hasOwnProperty(get(instance, 'options'), 'notFound'), false, 'ignores undefined bound option');
});

test('it creates passives CP that return all defined passive properties', function(assert) {
  const passives = ['found', 'notFound'];
  const instance = mapOptions('scope', [], passives);
  instance.found = true;

  assert.equal(get(instance, 'passives').found, true, 'returns defined passive option');
  assert.equal(hasOwnProperty(get(instance, 'passives'), 'notFound'), false, 'ignores undefined passive option');
});

test('it calls set on Google Map instance property with updated value', function(assert) {
  assert.expect(2);

  const newState = {
    updatedValue: 1,
    updatedObj: {updated: true},
    notUpdated: 0
  };

  const oldState = {
    updatedValue: 0,
    updatedObj: {updated: false},
    notUpdated: 0
  };

  const instance = mapOptions('scope', ['updatedValue', 'updatedObj', 'notUpdated']);

  instance.scope = {
    set(key, value) {
      assert.equal(value, newState[key], `received update of ${key}`);
    },

    get(key) {
      return oldState[key];
    }
  };

  assign(instance, newState);

  instance._mapOptionsDidUpdateAttrs();
});

module('Unit | Factory | map options | isDiff');

test('it returns false if arguments are functionally the same', function(assert) {
  assert.equal(isDiff('one', 'One'), false, 'no difference of case-insensitive string values');
  assert.equal(isDiff({one: 1}, {One: 1}), false, 'no difference of case-insensitive object values');
  assert.equal(isDiff(null, false), false, 'no difference of two falsey values');
  assert.equal(isDiff(0, 0), false, 'no difference of two zero values');
});

test('it returns true if arguments are functionally different', function(assert) {
  assert.equal(isDiff('one', 'two'), true, 'detects different string values');
  assert.equal(isDiff({one: {two: [1, 2]}}, {one: {two: [1]}}), true, 'detects different nested object values');
});

test('it returns true if a is `0` and b is a non-numeric falsey value', function(assert) {
  assert.equal(isDiff(0, false), true, 'detects difference of 2 falsey values if a is `0`');
});

function hasOwnProperty(o, property) {
  return Object.hasOwnProperty.call(o, property);
}
