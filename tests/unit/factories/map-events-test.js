import mapEvents from 'ember-cli-g-maps/factories/map-events';
import {module, test} from 'qunit';

module('Unit | Factory | map events');

test('it requires valid arguments', function(assert) {
  assert.throws(() =>
    mapEvents({events: 'non-array'}), 'requires an array of events');

  assert.throws(() =>
    mapEvents({events: [], augmentedEvents: 'non-object' }), 'requires a hash of augmented events');

  assert.throws(() =>
    mapEvents({events: [], augmentedEvents: {}, googleMapsInstanceScope: 4}), 'requires a string of a google instance scope');
});

test('it requires a Google Map instance at provided scope for event binding', function(assert) {
  const instance = mapEvents({events: [], augmentedEvents: {}, googleMapsInstanceScope: 'scope'});
  instance.scope = 'not a Google Map instance';
  assert.throws(instance.bindGoogleMapsInstanceEvents, 'requires a valid Google Map instance at scope');
});
