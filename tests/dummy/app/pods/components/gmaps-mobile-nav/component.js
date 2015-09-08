import Ember from 'ember';

const { on } = Ember;

export default Ember.Component.extend({
  mobileNavBreakPoint: 640,

  _addEvents: on('didInsertElement', function() {
    Ember.$(window).on('resize.gmaps-mobile-nav', Ember.run.bind(this, this._onWindowResize));
  }),

  _removeEvents: on('willDestroyElement', function() {
    Ember.$(window).off('resize.gmaps-mobile-nav');
    this.set('isActive', false);
  }),

  _onWindowResize: function() {
    if(!this.get('isActive')) { return; }
    Ember.run.debounce(this, '_shouldHideNav', 150);
  },

  _shouldHideNav: function() {
    if(Ember.$(window).width() >= this.get('mobileNavBreakPoint')) {
      this.set('isActive', false);
    }
  },

  actions: {
    closeMobileNav: function() {
      this.set('isActive', false);
    }
  }
});