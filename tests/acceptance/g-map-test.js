import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

let gMapService;

module('Acceptance | g map', {
  beforeEach: function() {
    this.application = startApp();
    const container = this.application.__container__;
    gMapService = container.lookup('service:gMap');
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('should convert address to geocode or reject Promise', function(assert) {
  assert.expect(1);
  return gMapService.geocode({
    address: '716 Richard Arrington Jr Blvd N, Birmingham, AL 35203, United States'
  })
  .then(result => {
    assert.ok(Ember.isArray(result), 'returns an array of results');
  })
  .catch(err => {
    assert.ok(err, 'rejected geocode request');
  });
});

test('should support reverse geocoding with suggested results or reject Promise', function(assert) {
  assert.expect(1);
  return gMapService.geocode({
    lat: 33.5212291,
    lng: -86.8089334
  })
  .then(result => {
    assert.ok(Ember.isArray(result), 'returns an array of results');
  })
  .catch(err => {
    assert.ok(err, 'rejected reverse geocoding request');
  });
});
