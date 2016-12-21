import {test} from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import {assert} from 'ember-metal/utils';

import ENV from 'ember-cli-g-maps/configuration';

const SWITCH_BUTTONS = ['mapTypeId'];
const OBJECT_UPDATE_BUTTONS = ['center', 'mapTypeControlOptions'];
const IGNORED_PROPERTIES = ['heading', 'noClear', 'scaleControlOptions', 'streetView'];
const UPDATE_BUTTONS = ENV.googleMap.boundOptions.filter((opt) =>
  IGNORED_PROPERTIES.indexOf(opt) + SWITCH_BUTTONS.indexOf(opt) + OBJECT_UPDATE_BUTTONS.indexOf(opt) === -3);

moduleForAcceptance('Acceptance | g-map | properties');

test('g-map properties', function(assert) {
  visit('/basic-usage/map-properties');

  waitForGoogleMap();

  const originals = {};

  andThen(() => {
    UPDATE_BUTTONS
    .forEach((option) => {
      originals[option] = getGoogleMapOption(option);
      click(`[data-test-update=${option}]`);
    });

    // TODO switch buttons
    // TODO up
  });

  andThen(() => {
    UPDATE_BUTTONS
    .forEach((option) =>
      assert.notEqual(originals[option], getGoogleMapOption(option), `toggled ${option}`));
  });
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
