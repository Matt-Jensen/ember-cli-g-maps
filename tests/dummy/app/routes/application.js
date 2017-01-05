import $ from 'jquery';
import Route from 'ember-route';

export default Route.extend({
  actions: {
    scrollToId(id) {
      $('.grid-frame.-scroll-y').animate({
        scrollTop: document.getElementById(id).offsetTop
      }, 300);
    }
  }
});
