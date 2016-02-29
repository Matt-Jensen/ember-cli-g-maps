import Ember from 'ember';

export default Ember.Service.extend({
  register(component) {
    this.component = component;
  },

  unregister() {
    this.component = null;
  },

  notify(data) {
    let component = this.component;
    if (component) {
      component.sendAction('on-select', data);
    } else {
      Ember.Logger.logger('Notify was called without a component being registered');
    }
  }
});
