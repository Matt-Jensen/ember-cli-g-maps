import {test} from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import run from 'ember-runloop';

import ENV from 'ember-cli-g-maps/configuration';

const EVENTS = ENV.googleMapPolygon.events;
const PROPERTIES = ENV.googleMapPolygon.boundOptions.filter((opt) => opt !== 'geodesic');
PROPERTIES.push('path');

moduleForAcceptance('Acceptance | g-map-polygon');

test('g-map-polygon properties & events', function(assert) {
  visit('/basic-usage/polygons');

  waitForGoogleMap();

  let topLevel = {};
  let options = {};

  /*
   * Test map using top-level configuration
   */
  andThen(() => {
    topLevel = getState(PROPERTIES);
    updateAllProperties(PROPERTIES);
  });

  andThen(() => {
    const updated = getState(PROPERTIES);
    assertAllPropertiesUpdated(topLevel, updated);

    // Reset polygon state to original
    click('[data-test=reset-state]');

    // User polygon configured with `options`
    click('[data-test=use-options]');
  });

  /*
   * Test map using options configuration
   */
  andThen(() => {
    options = getState(PROPERTIES);
    updateAllProperties(PROPERTIES);
  });

  andThen(() => {
    const updated = getState(PROPERTIES);
    assertAllPropertiesUpdated(options, updated);
  });

  /*
   * Test map events
   */
  andThen(() => {
    EVENTS.forEach((evt) =>
      triggerGoogleMapPolygonEvent(evt));
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
      const msg = `g-map-polygon property ${property} updated`;

      if (typeof o === 'object' && typeof u === 'object') {
        assert.notDeepEqual(o, u, msg);
      } else {
        assert.notEqual(o, u, msg);
      }
    });
  }
});

/**
 * @param {String} option    Google Maps Polygon option
 * @param {String} selector  jQuery selector to a g-map canvas
 * @return {any}
 * Return an option value from google map polygon at a given selector
 */
function getGooglePolygonOption(option, selector = '.ember-cli-g-map') {
  const element = find(selector);

  if (!element.length) {
    throw new Error('G-map canvas element was not found');
  }

  const [polygon] = element.get(0).__GOOGLE_MAP_POLYGONS__;

  if (!polygon) {
    throw new Error('Google Map has no polygon(s)');
  }

  if (option === 'path') {
    // Convert MVCArray[<LatLng>] to [{lat, lng}]
    return polygon.getPath().getArray().map((ll) => ll.toJSON());
  }

  return polygon[option];
}

/**
 * @return {Object} Google Map State
  * Return current map state of all properties
 */
function getState(properties) {
  const state = {};

  properties.forEach((option) =>
    state[option] = getGooglePolygonOption(option));

  return state;
}

/**
 * @param  {Array} properties list of properties to select
 * Click first of each property marked with applicable `data-test-update=...`
 */
function updateAllProperties(properties) {
  properties.forEach((property) =>
    click(`[data-test-update=${property}]:not(.active):first`));
}

/**
 * @param  {String} eventName
 * @param  {String} selector g-map canvas selector
 * Trigger a given event on a Google Map Polygon instance
 */
function triggerGoogleMapPolygonEvent(eventName, selector = '.ember-cli-g-map') {
  const element = find(selector);

  if (!element.length) {
    throw new Error('G-map canvas element was not found');
  }

  const [polygon] = element.get(0).__GOOGLE_MAP_POLYGONS__;

  if (!polygon) {
    throw new Error('Google Map has no polygon(s)');
  }

  let target = polygon;

  if (eventName === 'remove_at' || eventName === 'set_at' || eventName === 'insert_at') {
    target = polygon.getPath();
  }

  run(() => google.maps.event.trigger(target, eventName));
}
