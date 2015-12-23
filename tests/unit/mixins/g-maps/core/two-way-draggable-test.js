import Ember from 'ember';
import twoWayDraggableMixin from 'ember-cli-g-maps/mixins/g-maps/core/two-way-draggable';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/core/two way draggable');

// Replace this with your real tests.
test('it works', function(assert) {
  const twoWayDraggableObject = Ember.Object.extend(twoWayDraggableMixin);
  const subject = twoWayDraggableObject.create();
  assert.ok(subject);
});

test('_bindDraggableToMap should not update map `draggable` if `isMapLoaded` is false', function(assert) {
  const twoWayDraggableObject = Ember.Object.extend(twoWayDraggableMixin);
  const subject = twoWayDraggableObject.create();

  subject.setProperties({ draggable: false, isMapLoaded: false });
  assert.equal(subject._bindDraggableToMap(), false);
});

test('_bindDraggableToMap should update map `draggable` if `isMapLoaded` is true', function(assert) {
  assert.expect(1);

  const twoWayDraggableObject = Ember.Object.extend(twoWayDraggableMixin);
  const subject = twoWayDraggableObject.create();

  subject.setProperties({
    draggable: false,
    isMapLoaded: false,
    map: {
      map: {
        setOptions: function(option) {
          assert.equal(option.draggable, subject.get('draggable'), 'should set map draggable sync to model');
        }
      }
    }
  });

  subject.set('isMapLoaded', true);
});
