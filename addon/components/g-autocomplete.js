import Ember from 'ember';
import layout from '../templates/components/g-autocomplete';

const {
  inject
} = Ember;

export default Ember.Component.extend({
  layout: layout,
  testGMaps: inject.service('test-g-maps'),
  classNames: ['g-autocomplete'],

  init() {
    this._super(...arguments);
    let testGMaps = this.get('testGMaps');
    if (testGMaps) {
      testGMaps.registerAutocomplete(this);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    let input = this.$('input')[0];
    this.setup(input);
  },

  setup(input) {
    let autocomplete = new google.maps.places.Autocomplete(input);
    let handler = Ember.run.bind(this, function() {
      let place = autocomplete.getPlace();
      this.sendAction('on-select', {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        place
      });
    });

    let listener = autocomplete.addListener('place_changed', handler);
    this.set('autocomplete', autocomplete);
    this.set('listener', listener);
  },

  didAutocomplete(place) {
    this.send('onSelect', place);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.teardown();
  },

  teardown() {
    let autocomplete = this.get('autocomplete');
    let listener = this.get('listener');
    google.maps.event.removeListener(listener);
    google.maps.event.clearInstanceListeners(autocomplete);

    let testGMaps = this.get('testGMaps');
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
