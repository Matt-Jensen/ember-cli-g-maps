import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(model, controller) {
    this.set('isMobileNavActive', false);
  },

  actions: {
    toggleMobileNav: function() {
      const isOption = this.get('isMobileNavActive');
      console.log(isOption);
      this.set('isMobileNavActive', !isOption);
    }
  }
});