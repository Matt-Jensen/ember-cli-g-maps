import Ember from 'ember';
import GMapsCirclesMixin from '../../../mixins/g-maps/circles';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/circles');

// Replace this with your real tests.
test('it works', function(assert) {
  var GMapsCirclesObject = Ember.Object.extend(GMapsCirclesMixin);
  var subject = GMapsCirclesObject.create();
  assert.ok(subject);
});
