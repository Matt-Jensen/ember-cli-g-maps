import Ember from 'ember';
import twoWayScrollWheelMixin from 'ember-cli-g-maps/mixins/g-maps/core/two-way-scroll-wheel';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/core/two way scroll wheel');

test('_bindScrollwheelToMap should not update map if `isMapLoaded` = false', function(assert) {
  const twoWayScrollWheelObject = Ember.Object.extend(twoWayScrollWheelMixin);
  const subject = twoWayScrollWheelObject.create();

  subject.setProperties({ scrollwheel: true, isMapLoaded: false });
  assert.equal(subject._bindScrollwheelToMap(), false, 'should not have updated map');
});

test('_bindScrollwheelToMap observer should update map if `isMapLoaded` = true', function(assert) {
  assert.expect(1);

  const twoWayScrollWheelObject = Ember.Object.extend(twoWayScrollWheelMixin);
  const subject = twoWayScrollWheelObject.create();

  subject.setProperties({
    scrollwheel: false,
    isMapLoaded: false,
    map: {
      map: {
        setOptions: function(option) {
          assert.equal(option.scrollwheel, subject.get('scrollwheel'), 'should recieve `subject.scrollWheel`');
        }
      }
    }
  });

  subject.set('isMapLoaded', true);
});
