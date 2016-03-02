import Ember from 'ember';

const {
  get,
  computed
} = Ember;

export default Ember.Service.extend({
  autocompletes: computed(function(){
    return {};
  }),

  registerAutocomplete(component) {
    let elementId = get(component, 'elementId');
    let autocompletes = this.get('autocompletes');

    autocompletes[elementId] = component;
  },

  unregisterAutocomplete(component) {
    let elementId = get(component, 'elementId');
    let autocompletes = this.get('autocompletes');

    delete autocompletes[elementId];
  },

  selectPlace(componentId, data) {
    let autocompletes = this.get('autocompletes');

    if (arguments.length === 1) {
      data = componentId;
      componentId = Object.keys(autocompletes)[0];
    }

    let component = autocompletes[componentId];
    if (component) {
      component.sendAction('on-select', data);
    } else {
      Ember.Logger.logger('Notify was called without a component being registered');
    }
  }
});
