import Ember from 'ember';
import layout from '../templates/components/g-autocomplete';

export default Ember.Component.extend({
  layout: layout,
  GMap: Ember.inject.service('g-map'),

  didInsertElement() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, this.setupAutocomplete);
  },

  // be able to stub instantiation of Autocomplete
  // be able to stub return value from Autocomplete

  setupAutocomplete() {

    let gMapService = this.get('GMap');

    gMapService.setupAutocomplete({
      input: this.$('input')[0],
      component: this,
      callback: this.didAutocomplete
    });

  },

  didAutocomplete(place) {
    this.send('onSelect', place);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.get('GMap').teardownAutocomplete(this);
  },

  actions: {
    onSelect(place) {
      this.sendAction('on-select', place);
    }
  }
});
