import Ember from 'ember';

export default Ember.Component.extend({
  isMobileNavActive: false,

  actions: {
    toggleMobileNav: function() {
      this.set('isMobileNavActive', !this.get('isMobileNavActive'));
    }
  }
});