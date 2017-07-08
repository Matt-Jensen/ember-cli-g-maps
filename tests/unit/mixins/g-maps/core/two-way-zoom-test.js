import Ember from 'ember';
import twoWayZoomMixin from 'ember-cli-g-maps/mixins/g-maps/core/two-way-zoom';
import { module, test } from 'qunit';
import sinon from 'sinon';

const { GMaps } = window;

module('Unit | Mixin | g maps/core/two way zoom');

test('_addZoomChangedEvent should add map `zoom_changed` event on `ember-cli-g-map-loaded` event', function(assert) {
  assert.expect(1);

  const twoWayZoomObject = Ember.Object.extend(twoWayZoomMixin);
  const subject = twoWayZoomObject.create();

  const originalGMapsOn = GMaps.on;
  subject.set('map', { map: {} });

  GMaps.on = function(e) {
    assert.equal(e, 'zoom_changed', 'event added was not `zoom_changed`');
  };

  subject.trigger('ember-cli-g-map-loaded');

  GMaps.on = originalGMapsOn;
});

test('_bindZoomToMap should not update map `zoom` if `isMapLoaded` is false', function(assert) {
  const twoWayZoomObject = Ember.Object.extend(twoWayZoomMixin);
  const subject = twoWayZoomObject.create();

  subject.setProperties({ zoom: 10, isMapLoaded: false });
  assert.equal(subject._bindZoomToMap(), false, 'should not have updated map zoom');
});

test('_bindZoomToMap observer should update map zoom if `isMapLoaded` is true', function(assert) {
  const twoWayZoomObject = Ember.Object.extend(twoWayZoomMixin);
  const subject = twoWayZoomObject.create();

  subject.setProperties({ zoom: 10, isMapLoaded: false });

  subject.setProperties({
    isMapLoaded: true,
    map: {
      setZoom: sinon.spy()
    }
  });

  // subject._bindZoomToMap();
  assert.ok(subject.map.setZoom.called, 'should have called `map.setZoom`');
});

test('_bindZoomToModel should not update if `zoom` in sync', function(assert) {
  const twoWayZoomObject = Ember.Object.extend(twoWayZoomMixin);
  const subject = twoWayZoomObject.create();

  subject.setProperties({
    zoom: 10,
    isMapLoaded: false,
    map: { map: { zoom: 10 } }
  });

  assert.equal(subject._bindZoomToModel(), false, 'should not update `zoom` attribute');
});

test('_bindZoomToModel should update if `zoom` out of sync', function(assert) {
  const twoWayZoomObject = Ember.Object.extend(twoWayZoomMixin);
  const subject = twoWayZoomObject.create();

  subject.setProperties({
    lat: 1,
    lng: 1,
    zoom: 1,
    isMapLoaded: false,
    map: {
      map: {
        zoom: 10
      },
      getCenter: function() {
        return {
          lat: function() { return 2; },
          lng: function() { return 2; }
        };
      }
    }
  });

  subject._bindZoomToModel();

  assert.equal(subject.get('lat'), 2, 'should have updated `lat` attribute');
  assert.equal(subject.get('lng'), 2, 'should have updated `lng` attribute');
  assert.equal(subject.get('zoom'), 10, 'should have updated `zoom` attribute');
});
