import Ember from 'ember';
import GMapsMarkersMixin from 'ember-cli-g-maps/mixins/g-maps/markers';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/markers');

// Replace this with your real tests.
test('it works', function(assert) {
  var GMapsMarkersObject = Ember.Object.extend(GMapsMarkersMixin);
  var subject = GMapsMarkersObject.create();
  assert.ok(subject);
});
