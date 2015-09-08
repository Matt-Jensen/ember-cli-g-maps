import Ember from 'ember';

export default Ember.Component.extend({
  isMobileNavOpen: false,

  actions: {
    toggleMobileNav: function() {
      this.set('isMobileNavOpen', !this.get('isMobileNavOpen'));
    }
  }
});