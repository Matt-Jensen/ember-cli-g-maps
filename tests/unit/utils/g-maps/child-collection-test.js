import Ember from 'ember';
import childCollection from 'ember-cli-g-maps/utils/g-maps/child-collection';
import { module, test } from 'qunit';

module('Unit | Utility | g maps/child collection');

const config = {
  model: 'tests',
  namespace: 'test',
  validate: function() {},
  onDestroy: function() {}
};

test('it should throw an error when model property is undefined', function(assert) {
  assert.throws(
    function() { childCollection.create({}); },
    new Error('childCollection requires a `model` string')
  );
});

test('it should return a mixin configuration object', function(assert) {
  const result = childCollection.create(config);
  assert.ok(Ember.isArray(result.tests), 'model is array');
  assert.ok(typeof result._gmapTestValidate === 'function', 'validate is set correctly');
  assert.ok(typeof result._gmapTestDestroy === 'function', 'onDestroy is set correctly');
  assert.ok(typeof result._gmapTestSync === 'function', 'is computed property');
});

test('it should not require a validate or destroy method', function(assert) {
  const result = childCollection.create({ model: 'tests', namespace: 'test' });
  assert.ok(typeof result._gmapTestValidate === 'function', 'validate is set correctly');
  assert.ok(typeof result._gmapTestDestroy === 'function', 'destroy is set correctly');
});

//////////////////////////
// _modelVsMapChildDiff
/////////////////////////

test('_modelVsMapChildDiff should return false for identical model mapChild', function(assert) {
  const result = childCollection._modelVsMapChildDiff({ test: 'test' }, { test: 'test' });
  assert.equal(result, false);
});

test('_modelVsMapChildDiff should return true for non-identical objects', function(assert) {
  const result = childCollection._modelVsMapChildDiff({ test: 'test' }, { test: false });
  assert.equal(result, true);
});

test('_modelVsMapChildDiff should ignore top level objects on model parameter', function(assert) {
  const result = childCollection._modelVsMapChildDiff({ test: 'test', ignore: {} }, { test: 'test' });
  assert.equal(result, false);
});