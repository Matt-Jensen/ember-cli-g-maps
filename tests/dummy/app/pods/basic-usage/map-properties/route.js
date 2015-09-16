import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 5,
      type: 'roadmap',
      drag: true,

      types: ['roadmap', 'satellite', 'hybrid', 'terrain'],
    });
  },

  actions: {
    setMapType(type) {
      this.controller.set('type', type);
    },

    toggleDrag() {
      this.controller.set('drag', !this.controller.get('drag'));
    }
  }
});