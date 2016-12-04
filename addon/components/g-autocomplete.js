import Ember from 'ember';
import loadGoogleMaps from 'ember-cli-g-maps/utils/load-google-maps';
import TextField from 'ember-components/text-field';
import { assert } from 'ember-metal/utils';

const { inject, get, set } = Ember;

export default TextField.extend({
  tagName: 'input',
  testGMaps: inject.service('test-g-maps'),
  classNames: ['g-autocomplete'],
  options: {},

  init() {
    this._super(...arguments);

    const testGMaps = get(this, 'testGMaps');
    if (testGMaps) {
      testGMaps.registerAutocomplete(this);
    }
  },

  /**
   * invoke `setup()` with initial input value
   */
  didInsertElement() {
    this._super(...arguments);

    // Don't break the boot
    if (typeof HTMLInputElement !== 'undefined') {

      // G-Autocomplete's element must be an HTML input
      assert('g-autocomplete component must have a tagName of `input`', this.element instanceof HTMLInputElement);
    }

    loadGoogleMaps().then(() => this.setup(this.element));
  },

  /**
   * @public
   * generate new autocomplete instance
   * add `place_changed` event handler
   * set `autocomplete` and `listener` refs on component
   *
   * @param {String} input
   */
  setup(input) {
    const autocomplete = new google.maps.places.Autocomplete(input);
    const listener = autocomplete.addListener('place_changed', () => {
      const placeResult = autocomplete.getPlace();

      if (!placeResult.geometry) {
        return this.sendAction('on-select-error', { input: placeResult.name });
      }

      this.sendAction('on-select', {
        lat: placeResult.geometry.location.lat(),
        lng: placeResult.geometry.location.lng(),
        place: placeResult
      });
    });

    set(this, 'autocomplete', autocomplete);
    set(this, 'listener', listener);
  },

  didAutocomplete(place) {
    this.send('onSelect', place);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.teardown();
  },

  /**
   * @public
   * remove listener event
   * remove autocomplete instances event listeners
   * if unregister autocomplete
   */
  teardown() {
    const autocomplete = get(this, 'autocomplete');
    const listener = get(this, 'listener');

    google.maps.event.removeListener(listener);
    google.maps.event.clearInstanceListeners(autocomplete);

    const testGMaps = get(this, 'testGMaps');
    if (testGMaps) {
      testGMaps.unregisterAutocomplete(this);
    }
  },

  actions: {
    onSelect(place) {
      this.sendAction('on-select', place);
    }
  }
});
