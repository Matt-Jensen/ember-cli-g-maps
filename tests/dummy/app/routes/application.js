import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    scrollToId(id) {
      Ember.$('.grid-frame.-scroll-y').animate({
        scrollTop: Ember.$(`#${id}`).offset().top
      }, 300);
    }
  }
});