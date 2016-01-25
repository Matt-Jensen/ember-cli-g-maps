import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showSelection({lat, long}) {
      this.set('lat', lat);
      this.set('long', long);
    }
  }
});
