import Ember from 'ember';
import GMapsConfigurablesMixin from 'ember-cli-g-maps/mixins/g-maps/configurables';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/configurables');

// Replace this with your real tests.
test('it works', function(assert) {
  var GMapsConfigurablesObject = Ember.Object.extend(GMapsConfigurablesMixin);
  var subject = GMapsConfigurablesObject.create();
  assert.ok(subject);
});
