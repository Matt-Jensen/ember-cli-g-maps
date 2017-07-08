import Ember from 'ember';
import twoWayLatLngMixin from 'ember-cli-g-maps/mixins/g-maps/core/two-way-lat-lng';
import sinon from 'sinon';
import { module, test } from 'qunit';

const { GMaps } = window;

module('Unit | Mixin | g maps/core/two way lat lng');

test('_addCenterChangedEvent should add map `center_changed` event on `ember-cli-g-map-loaded` event', function(assert) {
  assert.expect(1);

  const twoWayLatLngObject = Ember.Object.extend(twoWayLatLngMixin);
  const subject = twoWayLatLngObject.create();

  const originalGMapsOn = GMaps.on;
  subject.set('map', { map: {} });

  GMaps.on = function(e) {
    assert.equal(e, 'center_changed', 'event added was not `center_changed`');
  };

  subject.trigger('ember-cli-g-map-loaded');

  GMaps.on = originalGMapsOn;
});

test('_bindLatLngToMap should not update `lat` & `lng` if `isMapLoaded` = false', function(assert) {
  const twoWayLatLngObject = Ember.Object.extend(twoWayLatLngMixin);
  const subject = twoWayLatLngObject.create();

  subject.setProperties({ lat: 1, lng: 1, isMapLoaded: false });
  assert.equal(subject._bindLatLngToMap(), false);
});

test('_bindLatLngToMap should not update if `map.{lat,lng}` = `subject.{lat,lng}`', function(assert) {
  const twoWayLatLngObject = Ember.Object.extend(twoWayLatLngMixin);
  const subject = twoWayLatLngObject.create();

  subject.setProperties({ lat: 1, lng: 1, isMapLoaded: false });

  subject.setProperties({
    isMapLoaded: true,
    map: {
      getCenter: function() {
        return {
          lat: function() { return subject.get('lat'); },
          lng: function() { return subject.get('lng'); }
        };
      },
      setCenter: sinon.spy()
    }
  });

  subject._bindLatLngToMap();
  assert.equal(subject.map.setCenter.called, false);
});

test('_bindLatLngToMap observer should update map instance if out of sync with subject', function(assert) {
  const twoWayLatLngObject = Ember.Object.extend(twoWayLatLngMixin);
  const subject = twoWayLatLngObject.create();

  subject.setProperties({ lat: 1, lng: 1, isMapLoaded: false });

  subject.setProperties({
    isMapLoaded: true,
    map: {
      getCenter: function() {
        return {
          lat: function() { return 2; },
          lng: function() { return 2; }
        };
      },
      setCenter: sinon.spy()
    }
  });

  assert.ok(subject.map.setCenter.called);
});

///////////////////////
// On Center Changed
//////////////////////

test('_bindLatLngToModel should not update if `lat`,`lng` in sync', function(assert) {
  const twoWayLatLngObject = Ember.Object.extend(twoWayLatLngMixin);
  const subject = twoWayLatLngObject.create();

  subject.setProperties({
    lat: 1,
    lng: 1,
    isMapLoaded: false,
    map: {
      getCenter: function() {
        return {
          lat: function() { return 1; },
          lng: function() { return 1; }
        };
      }
    }
  });

  assert.equal(subject._bindLatLngToModel(), false, 'should not have updated `lat` or `lng` attributes');
});

test('_bindLatLngToModel should update if `lat` & `lng` out of sync', function(assert) {
  const twoWayLatLngObject = Ember.Object.extend(twoWayLatLngMixin);
  const subject = twoWayLatLngObject.create();

  subject.setProperties({
    lat: 1,
    lng: 1,
    isMapLoaded: false,
    map: {
      getCenter: function() {
        return {
          lat: function() { return 2; },
          lng: function() { return 2; }
        };
      }
    }
  });

  subject._bindLatLngToModel();
  assert.equal(subject.get('lat'), 2, 'should have updated `lat` attribute');
  assert.equal(subject.get('lng'), 2, 'should have updated `lng` attribute');
});
