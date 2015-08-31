import Ember from 'ember';
import GMapsHeatmapMixin from 'ember-cli-g-maps/mixins/g-maps/heatmap';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/heatmap');

// Replace this with your real tests.
test('it works', function(assert) {
  var GMapsHeatmapObject = Ember.Object.extend(GMapsHeatmapMixin);
  var subject = GMapsHeatmapObject.create();
  assert.ok(subject);
});
