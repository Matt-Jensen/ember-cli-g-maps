import {test} from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import {assert} from 'ember-metal/utils';

import ENV from 'ember-cli-g-maps/configuration';

const CUSTOM_PROPERTIES = ['center', 'heading', 'mapTypeId', 'mapTypeControlOptions', 'maxZoom', 'minZoom', 'noClear', 'scaleControlOptions', 'streetView', 'tilt', 'zoom'];
const UPDATE_BUTTONS = ENV.googleMap.boundOptions.filter((opt) => CUSTOM_PROPERTIES.indexOf(opt) === -1);

moduleForAcceptance('Acceptance | g-map | properties');

test('g-map properties', function(assert) {
  visit('/basic-usage/map-properties');

  waitForGoogleMap();

  let original = {};

  /*
   * Test map using top-level configuration
   */
  andThen(() => {
    original = getAllProperties();
    assertMapConfigured(original);
    updateAllProperties();
  });

  andThen(() => {
    const updated = getAllProperties();
    assertMapConfigured(updated);
    assertMapStatesUpdated(original, updated);

    // setup next test
    click('[data-test="reset-map-state"]');
    click('[data-test="use-options-map"]');
  });

  /*
   * Test map using options hash configuration
   */
   let originalTwo = {};

  andThen(() => {
    originalTwo = getAllProperties();
    assertMapConfigured(originalTwo);
    updateAllProperties();
  });

  andThen(() => {
    const updated = getAllProperties();
    assertMapConfigured(updated);
    assertMapStatesUpdated(originalTwo, updated);
  });

  /**
   * @param {Object} state
   * Assert that map is completely configured
   */
  function assertMapConfigured(state) {
    Object.keys(state).forEach((option) =>
      assert.ok(state[option] !== undefined, `${option} is configured`));
  }

  /**
   * @param  {Object} a Map state
   * @param  {Object} b Map state
   * Assert all map states were updated
   */
  function assertMapStatesUpdated(a, b) {
    [].concat(UPDATE_BUTTONS, ['center.lat', 'center.lng', 'mapTypeId', 'mapTypeControlOptions.mapTypeIds', 'mapTypeControlOptions.position', 'mapTypeControlOptions.style', 'maxZoom', 'minZoom', 'zoom'])
    .forEach((option) => {
      const msg = `updated ${option}`;

      if (typeof a[option] === 'object') {
        assert.notDeepEqual(a[option], b[option], msg);
      } else {
        assert.notEqual(a[option], b[option], msg);
      }
    });
  }
});

/**
 * @param {String} option    Google map option
 * @param {String} selector  jQuery selector to a g-map canvas
 * @return {any}
 * Return an option value from google map at a given selector
 */
function getGoogleMapOption(option, selector = '.ember-cli-g-map') {
  const element = find(selector);
  assert('no element found', element.length);

  const map = element.get(0).__GOOGLE_MAP__;
  assert('invalid g-map map element', map);

  return map[option];
}

/**
 * @return {Object} Google Map State
  * Return current map state of all properties
 */
function getAllProperties() {
  const state = {};

  [].concat(UPDATE_BUTTONS, ['mapTypeId', 'maxZoom', 'minZoom', 'zoom'])
  .forEach((option) =>
    state[option] = getGoogleMapOption(option));

  state['center.lat'] = getGoogleMapOption('center').lat();
  state['center.lng'] = getGoogleMapOption('center').lng();

  state['mapTypeControlOptions.mapTypeIds'] = getGoogleMapOption('mapTypeControlOptions').mapTypeIds;
  state['mapTypeControlOptions.position'] = getGoogleMapOption('mapTypeControlOptions').position;
  state['mapTypeControlOptions.style'] = getGoogleMapOption('mapTypeControlOptions').style;

  return state;
}

/**
 * @return {Object} current state before triggering update to all properties
 * Initiate update of all map properties
 */
function updateAllProperties() {
  UPDATE_BUTTONS
  .forEach((option) =>
    click(`[data-test-update=${option}]:first`));

  // Update center
  click('[data-test-update="center.lat"]:first');
  click('[data-test-update="center.lng"]:first');

  // Update map type
  click('[data-test-update=mapTypeId]:not(.active):first');

  // Update map type control options
  click('[data-test-update="mapTypeControlOptions.mapTypeIds"]:first');
  click('[data-test-update="mapTypeControlOptions.position"]:first');
  click('[data-test-update="mapTypeControlOptions.style"]:first');

  // Update maxZoom
  click('[data-test-update=maxZoom]:first');

  // Update minZoom
  click('[data-test-update=minZoom]:first');

  // Update zoom
  click('[data-test-update=zoom]:first');
}
