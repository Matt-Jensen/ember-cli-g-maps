import {test} from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import run from 'ember-runloop';

import ENV from 'ember-cli-g-maps/configuration';

const EVENTS = ENV.googleMapCircle.events.filter((e) => e === 'center_changed'); // NOTE center_changed throws error
const PROPERTIES = ENV.googleMapCircle.boundOptions.filter((p) => p !== 'center');
PROPERTIES.push('lat', 'lng');

moduleForAcceptance('Acceptance | g-map-circle');

test('g-map-circle properties & events', function(assert) {
  visit('/basic-usage/circles');

  waitForGoogleMap();

  let topLevel = {};
  let options = {};

  /*
   * Test map using top-level configuration
   */
  andThen(() => {
    topLevel = getCircleState(PROPERTIES);
    updateAllProperties(PROPERTIES);
  });

  andThen(() => {
    const updated = getCircleState(PROPERTIES);
    assertAllPropertiesUpdated(topLevel, updated);

    // Reset circle state to original
    click('[data-test=reset-state]');

    // User circle configured with `options`
    click('[data-test=use-options]');
  });

  /*
   * Test map using options configuration
   */
  andThen(() => {
    options = getCircleState(PROPERTIES);
    updateAllProperties(PROPERTIES);
  });

  andThen(() => {
    const updated = getCircleState(PROPERTIES);
    assertAllPropertiesUpdated(options, updated);
  });

  /*
   * Test map events
   */
  andThen(() => {
    EVENTS.forEach((evt) =>
      triggerGoogleMapCircleEvent(evt));
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
      const msg = `g-map-circle property ${property} updated`;

      if (typeof o === 'object' && typeof u === 'object') {
        assert.notDeepEqual(o, u, msg);
      } else {
        assert.notEqual(o, u, msg);
      }
    });
  }
});

/**
 * @param {String} option    Google Maps Circle option
 * @param {String} selector  jQuery selector to a g-map canvas
 * @return {any}
 * Return an option value from google map circle at a given selector
 */
function getGoogleCircleOption(option, selector = '.ember-cli-g-map') {
  const element = find(selector);

  if (!element.length) {
    throw new Error('G-map canvas element was not found');
  }

  const [circle] = element.get(0).__GOOGLE_MAP_CIRCLES__;

  if (!circle) {
    throw new Error('Google Map has no circle(s)');
  }

  if (option === 'lat') {
    return circle.center.lat();
  }

  if (option === 'lng') {
    return circle.center.lng();
  }

  return circle[option];
}

/**
 * @return {Object} Google Map State
  * Return current map state of all properties
 */
function getCircleState(properties) {
  const state = {};

  properties.forEach((option) =>
    state[option] = getGoogleCircleOption(option));

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
 * Trigger a given event on a Google Map Circle instance
 */
function triggerGoogleMapCircleEvent(eventName, selector = '.ember-cli-g-map') {
  const element = find(selector);

  if (!element.length) {
    throw new Error('G-map canvas element was not found');
  }

  const [circle] = element.get(0).__GOOGLE_MAP_CIRCLES__;

  if (!circle) {
    throw new Error('Google Map has no circle(s)');
  }

  run(() => google.maps.event.trigger(circle, eventName));
}
