import {test} from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import run from 'ember-runloop';

import ENV from 'ember-cli-g-maps/configuration';

const EVENTS = ENV.googleMapMarker.events;
const PROPERTIES = ENV.googleMapMarker.boundOptions.filter((p) => p !== 'position');

moduleForAcceptance('Acceptance | g-map-marker');

test('g-map properties', function(assert) {
  visit('/basic-usage/markers');

  waitForGoogleMap();

  let topLevel = {};
  let options = {};

  /*
   * Test map using top-level configuration
   */
  andThen(() => {
    topLevel = getMarkerState(PROPERTIES);
    updateAllProperties(PROPERTIES);
  });

  andThen(() => {
    const updated = getMarkerState(PROPERTIES);
    assertAllPropertiesUpdated(topLevel, updated);

    // Reset marker state to original
    click('[data-test=reset-state]');

    // User marker configured with `options`
    click('[data-test=use-options]');
  });

  /*
   * Test map using options configuration
   */
  andThen(() => {
    options = getMarkerState(PROPERTIES);
    updateAllProperties(PROPERTIES);
  });

  andThen(() => {
    const updated = getMarkerState(PROPERTIES);
    assertAllPropertiesUpdated(options, updated);
  });

  /*
   * Test map events
   */
  andThen(() => {
    EVENTS.forEach((evt) =>
      triggerGoogleMapMarkerEvent(evt));
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
      const msg = `g-map-marker property ${property} updated`;

      if (typeof o === 'object' && typeof u === 'object') {
        assert.notDeepEqual(o, u, msg);
      } else {
        assert.notEqual(o, u, msg);
      }
    });
  }
});

/**
 * @param {String} option    Google Maps Marker option
 * @param {String} selector  jQuery selector to a g-map canvas
 * @return {any}
 * Return an option value from google map marker at a given selector
 */
function getGoogleMarkerOption(option, selector = '.ember-cli-g-map') {
  const element = find(selector);

  if (!element.length) {
    throw new Error('G-map canvas element was not found');
  }

  const [marker] = element.get(0).__GOOGLE_MAP_MARKERS__;

  if (!marker) {
    throw new Error('Google Map has no marker(s)');
  }

  return marker[option];
}

/**
 * @return {Object} Google Map State
  * Return current map state of all properties
 */
function getMarkerState(properties) {
  const state = {};

  properties.forEach((option) =>
    state[option] = getGoogleMarkerOption(option));

  return state;
}

/**
 * @param  {Array} properties list of properties to select
 * Click first of each property marked with applicable `data-test-update=...`
 */
function updateAllProperties(properties) {
  properties.forEach((property) =>
    click(`[data-test-update=${property}]:first`));
}

/**
 * @param  {String} eventName
 * @param  {String} selector g-map canvas selector
 * Trigger a given event on a Google Map Marker instance
 */
function triggerGoogleMapMarkerEvent(eventName, selector = '.ember-cli-g-map') {
  const element = find(selector);

  if (!element.length) {
    throw new Error('G-map canvas element was not found');
  }

  const [marker] = element.get(0).__GOOGLE_MAP_MARKERS__;

  if (!marker) {
    throw new Error('Google Map has no marker(s)');
  }

  run(() => google.maps.event.trigger(marker, eventName));
}
