import Ember from 'ember';
import layout from '../templates/components/g-autocomplete';

export default Ember.Component.extend({
  layout: layout,
  GMap: Ember.inject.service('g-map'),
  classNames: ['g-autocomplete'],

  /**
   * setup autocomplete instance
   *
   * wait for access to input on `afterRender`
   * allow stub instantiation of Autocomplete
   * allow stub return value from Autocomplete
   */
  didInsertElement() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, this._setupAutocomplete);
  },

  /**
   * instantiate autocomplete instance
   */
  _setupAutocomplete() {
    const gMapService = this.get('GMap');

    gMapService.setupAutocomplete({
      input: this.$('input')[0],
      component: this,
      callback: this._didAutocomplete
    });
  },

  /**
   * invoke `onSelect` action after autocomplete
   */
  _didAutocomplete(place) {
    this.send('onSelect', place);
  },

  /**
   * teardown autocomplete instance
   */
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
