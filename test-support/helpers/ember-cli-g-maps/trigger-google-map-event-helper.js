import Ember from 'ember';

const { $, assert } = Ember;
const EMBER_CLI_GMAPS_SELECTOR = '.ember-cli-g-map';

export default function(app, eventName, selector = EMBER_CLI_GMAPS_SELECTOR) {
  const $map = $(selector);
  assert(`No g-map component found at selector: ${selector}`, !$map.length || !$map.eq(0).hasClass(EMBER_CLI_GMAPS_SELECTOR));
  Ember.run(() => google.maps.event.trigger($map.get(0).__GOOGLE_MAP__, eventName));
}
