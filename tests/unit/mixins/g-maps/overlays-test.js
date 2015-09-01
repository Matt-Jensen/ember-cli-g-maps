import Ember from 'ember';
import GMapsOverlaysMixin from '../../../mixins/g-maps/overlays';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/overlays');

// Replace this with your real tests.
test('it works', function(assert) {
  var GMapsOverlaysObject = Ember.Object.extend(GMapsOverlaysMixin);
  var subject = GMapsOverlaysObject.create();
  assert.ok(subject);
});
