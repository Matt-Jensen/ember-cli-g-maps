import Ember from 'ember';
import twoWayStyleslMixin from 'ember-cli-g-maps/mixins/g-maps/core/two-way-styles';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/core/two way styles');

test('_bindStylesToMap should not update map if `isMapLoaded` = false', function(assert) {
  const twoWayStylesObject = Ember.Object.extend(twoWayStyleslMixin);
  const subject = twoWayStylesObject.create();

  subject.setProperties({ showMapTypeControl: false, isMapLoaded: false });
  assert.equal(subject._bindStylesToMap(), false, 'should return false if cannot sync');
});

test('_bindStylesToMap observer should update map if `isMapLoaded` = true', function(assert) {
  assert.expect(1);

  const twoWayStylesObject = Ember.Object.extend(twoWayStyleslMixin);
  const subject = twoWayStylesObject.create();

  subject.setProperties({
    styles: {},
    isMapLoaded: false,
    map: {
      map: {
        setOptions: function(option) {
          assert.equal(option.styles, subject.get('styles'), 'should recieve `subject.styles`');
        }
      }
    }
  });

  subject.set('isMapLoaded', true);
});
