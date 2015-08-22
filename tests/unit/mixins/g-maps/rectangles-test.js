import Ember from 'ember';
import GMapsRectanglesMixin from '../../../mixins/g-maps/rectangles';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/rectangles');

// Replace this with your real tests.
test('it works', function(assert) {
  var GMapsRectanglesObject = Ember.Object.extend(GMapsRectanglesMixin);
  var subject = GMapsRectanglesObject.create();
  assert.ok(subject);
});
