import Ember from 'ember';
import loadGoogleMaps from '../../../../ember-cli-g-maps/utils/load-google-maps';

const { $, assert } = Ember;
const EMBER_CLI_GMAPS_SELECTOR = '.ember-cli-g-map';

export default function(app, selector = EMBER_CLI_GMAPS_SELECTOR) {
  return new Ember.Test.promise(function(resolve, reject) {
    Ember.Test.adapter.asyncStart();

    loadGoogleMaps()
    .then(() => {
      Ember.run.scheduleOnce('afterRender', () => {
        const $map = $(selector);

        assert(`No g-maps component found at selector: ${selector}`, ($map.length || $map.eq(0).hasClass(EMBER_CLI_GMAPS_SELECTOR)) && $map.get(0).__GOOGLE_MAP__);

        const map = $map.get(0).__GOOGLE_MAP__;

        google.maps.event.addListenerOnce(map, 'idle', () => {
          Ember.run(resolve);
          Ember.Test.adapter.asyncEnd();
        });

        // Ensure idle event fires
        // Useful if idle event has already fired
        map.setZoom(map.getZoom() + 1);
        map.setZoom(map.getZoom() - 1);
      });
    })
    .catch(() => {
      reject();
      Ember.Test.adapter.asyncEnd();
    });
  });
}
