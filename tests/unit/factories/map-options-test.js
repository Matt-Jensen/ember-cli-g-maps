import mapOptions from 'ember-cli-g-maps/factories/map-options';
import {module, test} from 'qunit';
import get from 'ember-metal/get';

module('Unit | Factory | map options');

test('it requires a array of bound options', function(assert) {
  assert.throws(() => mapOptions(), 'rejects without bound options');
});

test('it creates options CP that return all defined bound properties', function(assert) {
  const bound = ['found', 'notFound'];
  const instance = mapOptions(bound);
  instance.found = true;

  assert.equal(get(instance, 'options').found, true, 'returns defined bound option');
  assert.equal(hasOwnProperty(get(instance, 'options'), 'notFound'), false, 'ignores undefined bound option');
});

test('it creates passives CP that return all defined passive properties', function(assert) {
  const passives = ['found', 'notFound'];
  const instance = mapOptions([], passives);
  instance.found = true;

  assert.equal(get(instance, 'passives').found, true, 'returns defined passive option');
  assert.equal(hasOwnProperty(get(instance, 'passives'), 'notFound'), false, 'ignores undefined passive option');
});

function hasOwnProperty(o, property) {
  return Object.hasOwnProperty.call(o, property);
}
