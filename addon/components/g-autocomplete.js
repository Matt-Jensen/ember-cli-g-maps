import Ember from 'ember';
import layout from '../templates/components/g-autocomplete';

const { inject, get, set } = Ember;

export default Ember.Component.extend({
  layout: layout,
  testGMaps: inject.service('test-g-maps'),
  classNames: ['g-autocomplete'],

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
    const input = this.$('input')[0];
    this.setup(input);
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
    const handler = Ember.run.bind(this, function() {
      const place = autocomplete.getPlace();
      this.sendAction('on-select', {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        place
      });
    });

    const listener = autocomplete.addListener('place_changed', handler);

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
