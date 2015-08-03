import Ember from 'ember';
import GMapsPolygonsMixin from '../../../mixins/g-maps/polygons';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/polygons');

// Replace this with your real tests.
test('it works', function(assert) {
  var GMapsPolygonsObject = Ember.Object.extend(GMapsPolygonsMixin);
  var subject = GMapsPolygonsObject.create();
  assert.ok(subject);
});
