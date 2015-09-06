import Ember from 'ember';

export default Ember.Component.extend({
  isMobileNavActive: true,

  actions: {
    toggleMobileNav: function() {
      this.set('isMobileNavActive', !this.get('isMobileNavActive'));
    }
  }
});