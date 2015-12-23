import Ember from 'ember';
import twoWayDisableDoubleClickZoomMixin from 'ember-cli-g-maps/mixins/g-maps/core/two-way-disable-double-click-zoom';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/core/two way disable double click zoom');

test('`_bindDisableDoubleClickZoomToMap` should not update map if `isMapLoaded` = false', function(assert) {
  const twoWayDisableDoubleClickZoomObject = Ember.Object.extend(twoWayDisableDoubleClickZoomMixin);
  const subject = twoWayDisableDoubleClickZoomObject.create();

  subject.setProperties({ disableDoubleClickZoom: true, isMapLoaded: false });
  assert.equal(subject._bindDisableDoubleClickZoomToMap(), false, 'should return false if cannot sync');
});

test('`_bindDisableDoubleClickZoomToMap observer should update map if `isMapLoaded` = true', function(assert) {
  assert.expect(1);

  const twoWayDisableDoubleClickZoomObject = Ember.Object.extend(twoWayDisableDoubleClickZoomMixin);
  const subject = twoWayDisableDoubleClickZoomObject.create();

  subject.setProperties({ disableDoubleClickZoom: true, isMapLoaded: false });

  subject.setProperties({
    isMapLoaded: true,
    map: {
      map: {
        setOptions: function(option) {
          assert.equal(option.disableDoubleClickZoom, subject.get('disableDoubleClickZoom'), 'should recieve configured disableDoubleClickZoom');
        }
      }
    }
  });
});
