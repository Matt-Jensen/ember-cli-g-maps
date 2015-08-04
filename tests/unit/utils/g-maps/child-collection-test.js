import Ember from 'ember';
import childCollection from 'ember-cli-g-maps/utils/g-maps/child-collection';
import { module, test } from 'qunit';

module('Unit | Utility | g maps/child collection');

const config = {
  namespace: 'test',
  model: 'tests',
  props: ['isTested'],
  events: ['changed'],
  validate: function() {},
  onDestroy: function() {}
};

test('it should throw an error when model property is undefined', function(assert) {
  assert.throws(Ember.run.bind(childCollection, childCollection.create, {}), Error);
});

test('it should return a mixin configuration object', function(assert) {
  const result = childCollection.create(config);

  assert.ok(Ember.isArray(result.tests), 'model is array');
  assert.equal(result._gmapTestProps[0], config.props, 'props is set correctly');
  assert.equal(result._gmapTestEvents[0], config.events, 'events is set correctly');
  assert.ok(typeof result._gmapTestValidate === 'function', 'validate is set correctly');
  assert.ok(typeof result._gmapTestOnDestroy === 'function', 'onDestroy is set correctly');
  assert.ok(result._gmapTestIds.cacheable, 'is computed property');
  assert.ok(result._gmapTestUpdated.cacheable, 'is computed property');
  assert.ok(result._gmapTestSync.__ember_observes__, 'is an observer');
});
