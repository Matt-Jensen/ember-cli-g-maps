import {test} from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import mapQuery from '../../tests/helpers/map-query';
import {updateAllMapControls} from '../../tests/helpers/g-map-helpers';

import ENV from 'ember-cli-g-maps/configuration';

const EVENTS = ENV.googleMapPolyline.events;
const PROPERTIES = ENV.googleMapPolyline.boundOptions.filter((opt) => opt !== 'geodesic');
PROPERTIES.push('path');

moduleForAcceptance('Acceptance | g-map-polyline');

test('g-map-polyline properties & events', function(assert) {
  visit('/basic-usage/polylines');

  waitForGoogleMap();

  let topLevel = {};
  let options = {};
  let polyline;

  /*
   * Test map using top-level configuration
   */
  andThen(() => {
    polyline = mapQuery('polyline');
    topLevel = polyline.getState(PROPERTIES);
    updateAllMapControls(PROPERTIES);
  });

  andThen(() => {
    const updated = polyline.getState(PROPERTIES);
    assertAllPropertiesUpdated(topLevel, updated);

    // Reset polyline state to original
    click('[data-test=reset-state]');

    // User polyline configured with `options`
    click('[data-test=use-options]');
  });

  /*
   * Test map using options configuration
   */
  andThen(() => {
    polyline = mapQuery('polyline');
    options = polyline.getState(PROPERTIES);
    updateAllMapControls(PROPERTIES);
  });

  andThen(() => {
    const updated = polyline.getState(PROPERTIES);
    assertAllPropertiesUpdated(options, updated);
  });

  /*
   * Test map events
   */
  andThen(() => {
    EVENTS.forEach((evt) => polyline.trigger(evt));
  });

  andThen(() => {
    EVENTS.forEach((evt) =>
      assert.equal($(`#g-map-event-states [data-test-updated=${evt}]`).length, 1, `fired ${evt} event`));
  });

  function assertAllPropertiesUpdated(original, updated) {
    Object.keys(original)
    .forEach((property) => {
      const o = original[property];
      const u = updated[property];
      const msg = `g-map-polyline property ${property} updated`;

      if (typeof o === 'object' && typeof u === 'object') {
        assert.notDeepEqual(o, u, msg);
      } else {
        assert.notEqual(o, u, msg);
      }
    });
  }
});
