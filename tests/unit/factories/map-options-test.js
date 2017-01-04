import mapOptions from 'ember-cli-g-maps/factories/map-options';
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

function hasOwnProperty(o, property) {
  return Object.hasOwnProperty.call(o, property);
}
