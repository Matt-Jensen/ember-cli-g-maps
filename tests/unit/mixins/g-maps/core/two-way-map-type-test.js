import Ember from 'ember';
import twoWayMapTypeMixin from 'ember-cli-g-maps/mixins/g-maps/core/two-way-map-type';
import { module, test } from 'qunit';

module('Unit | Mixin | g maps/core/two way map type');

test('_bindMapTypeToMap should not update map if `isMapLoaded` = false', function(assert) {
  const twoWayMapTypeObject = Ember.Object.extend(twoWayMapTypeMixin);
  const subject = twoWayMapTypeObject.create();

  subject.setProperties({ mapType: 'SATELITE', isMapLoaded: false });
  assert.equal(subject._bindMapTypeToMap(), false, 'should not update the map');
});

test('_bindMapTypeToMap observer should not update map if `mapType` is not a valid map type id', function(assert) {
  const twoWayMapTypeObject = Ember.Object.extend(twoWayMapTypeMixin);
  const subject = twoWayMapTypeObject.create();

  subject.set('isMapLoaded', false);

  subject.setProperties({
    mapType: undefined,
    isMapLoaded: true,
    map: {
      map: {
        mapTypeId: 'roadmap'
      }
    }
  });

  assert.equal(subject.get('map.map').mapTypeId, 'roadmap', 'mapType was updated with invalid mapType');
});

test('_bindMapTypeToMap observer should not update map if `mapType` is in sync', function(assert) {
  const twoWayMapTypeObject = Ember.Object.extend(twoWayMapTypeMixin);
  const subject = twoWayMapTypeObject.create();

  subject.set('isMapLoaded', false);

  subject.setProperties({
    mapType: 'roadmap',
    isMapLoaded: true,
    map: {
      map: {
        getMapTypeId: function() {
          return 'roadmap';
        },
        mapTypeId: 'roadmap'
      }
    }
  });

  assert.equal(subject._bindMapTypeToMap(), false, 'should not update map');
});

test('_bindMapTypeToMap observer should update map if `isMapLoaded` = true', function(assert) {
  assert.expect(1);

  const twoWayMapTypeObject = Ember.Object.extend(twoWayMapTypeMixin);
  const subject = twoWayMapTypeObject.create();

  subject.setProperties({
    mapType: 'satellite',
    isMapLoaded: false,
    map: {
      map: {
        getMapTypeId: function() {
          return 'roadmap';
        },
        setMapTypeId: function(mapType) {
          assert.equal(mapType, subject.get('mapType'), 'should set a new mapType');
        }
      }
    }
  });

  subject.set('isMapLoaded', true);
});
