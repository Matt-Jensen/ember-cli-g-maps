import Ember from 'ember';
import twoWayZoomControlMixin from 'ember-cli-g-maps/mixins/g-maps/core/two-way-zoom-control';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/core/two way zoom control');

test('_bindZoomControlToMap should not update map if `isMapLoaded` = false', function(assert) {
  const twoWayZoomControlObject = Ember.Object.extend(twoWayZoomControlMixin);
  const subject = twoWayZoomControlObject.create();

  subject.setProperties({ zoomControl: false, isMapLoaded: false });
  assert.equal(subject._bindZoomControlToMap(), false, 'should not update the map');
});

test('_bindZoomControlToMap observer should update map if `isMapLoaded` = true', function(assert) {
  assert.expect(1);

  const twoWayZoomControlObject = Ember.Object.extend(twoWayZoomControlMixin);
  const subject = twoWayZoomControlObject.create();

  subject.setProperties({
    zoomControl: false,
    isMapLoaded: false,
    map: {
      map: {
        setOptions: function(option) {
          assert.equal(option.zoomControl, subject.get('zoomControl'), 'should recieve `subject.zoomControl`');
        }
      }
    }
  });

  subject.set('isMapLoaded', true);
});
