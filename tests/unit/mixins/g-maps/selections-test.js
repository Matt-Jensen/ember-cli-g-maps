import Ember from 'ember';
import GMapsSelectionsMixin from 'ember-cli-g-maps/mixins/g-maps/selections';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/selections');

// Replace this with your real tests.
test('it works', function(assert) {
  var GMapsSelectionsObject = Ember.Object.extend(GMapsSelectionsMixin);
  var subject = GMapsSelectionsObject.create();
  assert.ok(subject);
});
