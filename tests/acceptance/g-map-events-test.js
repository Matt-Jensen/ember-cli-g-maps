import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import ENV from 'ember-cli-g-maps/configuration';

const MAP_EVENTS = ENV.googleMap.events;

moduleForAcceptance('Acceptance | g-map | events');

test('g-map events', function(assert) {
  visit('/basic-usage/map-events');

  waitForGoogleMap();
  MAP_EVENTS.forEach((evt) => {
    if (evt !== 'loaded') { // loaded should fire automatically
      triggerGoogleMapEvent(evt);
    }
  });

  andThen(() => {
    MAP_EVENTS.forEach((evt) => {
      assert.equal($(`#g-map-event-states [data-test-updated=${evt}]`).length, 1, `fires ${evt} event`);
    });
  });
});
