import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 5,
      type: 'roadmap',
      typeControl: false,
      zoomControl: true,
      scaleControl: true,
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
    },

    toggleTypeControls() {
      this.controller.set('typeControl', !this.controller.get('typeControl'));
    },

    toggleZoomControls() {
      this.controller.set('zoomControl', !this.controller.get('zoomControl'));
    },

    toggleScaleControls() {
      this.controller.set('scaleControl', !this.controller.get('scaleControl'));
    },

    onMapTypeIdChange(conf) {
      this.controller.set('type', conf.mapType);
    }
  }
});