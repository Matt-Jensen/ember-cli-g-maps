import Ember from 'ember';
import twoWayScaleControlMixin from 'ember-cli-g-maps/mixins/g-maps/core/two-way-scale-control';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/core/two way scale control');

test('_bindScaleControlToMap should not update map if `isMapLoaded` = false', function(assert) {
  const twoWayScaleControlObject = Ember.Object.extend(twoWayScaleControlMixin);
  const subject = twoWayScaleControlObject.create();

  subject.setProperties({ showScaleControl: true, isMapLoaded: false });
  assert.equal(subject._bindScaleControlToMap(), false, 'should not updat map');
});

test('_bindScaleControlToMap observer should update map if `isMapLoaded` = true', function(assert) {
  assert.expect(1);

  const twoWayScaleControlObject = Ember.Object.extend(twoWayScaleControlMixin);
  const subject = twoWayScaleControlObject.create();

  subject.setProperties({
    showScaleControl: false,
    isMapLoaded: false,
    map: {
      map: {
        setOptions: function(option) {
          assert.equal(option.scaleControl, subject.get('showScaleControl'), 'should recieve `subject.scaleControl`');
        }
      }
    }
  });

  subject.set('isMapLoaded', true);
});
