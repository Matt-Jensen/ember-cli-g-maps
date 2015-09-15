import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 5,

      overlays: Ember.A([{
        id: 'unique-overlay-id', // Recommended
        lat: 32.75494243654723,  // Required
        lng: -86.8359375,        // Required
        content: '<div class="shaa-overlay">Overlay<div class="overlay_arrow above"></div></div>',
        verticalAlign: 'top',
        horizontalAlign: 'center'
      }])
    });
  }
});