import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 5,
      type: 'roadmap',
      showMaptypeControl: true,
      showZoomControl: true,
      showScaleControl: true,
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
      this.controller.set('showMaptypeControl', !this.controller.get('showMaptypeControl'));
    },

    toggleZoomControls() {
      this.controller.set('showZoomControl', !this.controller.get('showZoomControl'));
    },

    toggleScaleControls() {
      this.controller.set('showScaleControl', !this.controller.get('showScaleControl'));
    },

    onMapTypeIdChange(conf) {
      this.controller.set('type', conf.mapType);
    }
  }
});
