import Ember from 'ember';
import GMapsPolylinesMixin from '../../../mixins/g-maps/polylines';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/polylines');

// Replace this with your real tests.
test('it works', function(assert) {
  var GMapsPolylinesObject = Ember.Object.extend(GMapsPolylinesMixin);
  var subject = GMapsPolylinesObject.create();
  assert.ok(subject);
});
