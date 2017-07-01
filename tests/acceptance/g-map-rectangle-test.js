import {test} from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import mapQuery from '../../tests/helpers/map-query';
import {updateAllMapControls} from '../../tests/helpers/g-map-helpers';

import ENV from 'ember-cli-g-maps/configuration';

const PROBLEMATIC_EVENTS = ['mouseout', 'mouseover']; // break `google.maps.events.trigger()`
const EVENTS = ENV.googleMapRectangle.events.filter((evt) => PROBLEMATIC_EVENTS.indexOf(evt) === -1);
const PROPERTIES = ENV.googleMapRectangle.boundOptions;
PROPERTIES.push('bounds');

const EVENT_ARGS = {
  bounds_changed: [[{lat: 29, lng: -95}, {lat: 33, lng: -101}]],
  click: [{}]
};

moduleForAcceptance('Acceptance | g-map-rectangle');

test('g-map-rectangle properties & events', function(assert) {
  visit('/basic-usage/rectangles');

  waitForGoogleMap();

  let topLevel = {};
  let options = {};
  let rectangle;

  /*
   * Test map using top-level configuration
   */
  andThen(() => {
    rectangle = mapQuery('rectangle');
    topLevel = rectangle.getState(PROPERTIES);
    updateAllMapControls(PROPERTIES);
  });

  andThen(() => {
    const updated = rectangle.getState(PROPERTIES);
    assertAllPropertiesUpdated(topLevel, updated);

    // Reset rectangle state to original
    click('[data-test=reset-state]');

    // User rectangle configured with `options`
    click('[data-test=use-options]');
  });

  /*
   * Test map using options configuration
   */
  andThen(() => {
    rectangle = mapQuery('rectangle');
    options = rectangle.getState(PROPERTIES);
    updateAllMapControls(PROPERTIES);
  });

  andThen(() => {
    const updated = rectangle.getState(PROPERTIES);
    assertAllPropertiesUpdated(options, updated);
  });

  /*
   * Test map events
   */
  andThen(() => EVENTS.forEach((evt) => {
    const args = (EVENT_ARGS[evt] || []);
    rectangle.trigger(evt, ...args);
  }));

  andThen(() => {
    EVENTS.forEach((evt) =>
      assert.equal($(`#g-map-event-states [data-test-updated=${evt}]`).length, 1, `fired ${evt} event`));
  });

  function assertAllPropertiesUpdated(original, updated) {
    Object.keys(original)
    .forEach((property) => {
      const o = original[property];
      const u = updated[property];
      const msg = `g-map-rectangle property ${property} updated`;

      if (typeof o === 'object' && typeof u === 'object') {
        assert.notDeepEqual(o, u, msg);
      } else {
        assert.notEqual(o, u, msg);
      }
    });
  }
});
