import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 5,
      type: 'roadmap',
      showMapTypeControl: true,
      showZoomControl: true,
      showScaleControl: true,
      drag: true,
      disableDoubleClickZoom: false,
      scrollwheel: true,
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
      this.controller.set('showMapTypeControl', !this.controller.get('showMapTypeControl'));
    },

    toggleZoomControls() {
      this.controller.set('showZoomControl', !this.controller.get('showZoomControl'));
    },

    toggleScaleControls() {
      this.controller.set('showScaleControl', !this.controller.get('showScaleControl'));
    },

    onMapTypeIdChange(conf) {
      this.controller.set('type', conf.mapType);
    },

    toggleDisableDoubleClickZoom() {
      this.controller.set('disableDoubleClickZoom', !this.controller.get('disableDoubleClickZoom'));
    },

    toggleScrollwheel() {
      this.controller.set('scrollwheel', !this.controller.get('scrollwheel'));
    }
  }
});
