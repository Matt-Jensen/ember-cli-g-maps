import Ember from 'ember';

const colorfulStyles = [{"featureType":"all","elementType":"all","stylers":[{"saturation":"0"}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"saturation":"-77"},{"lightness":"-84"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"hue":"#72ff00"},{"saturation":"-63"},{"lightness":"36"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"color":"#ff0000"},{"visibility":"off"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.fill","stylers":[{"saturation":"3"},{"lightness":"-1"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"saturation":"14"},{"lightness":"-12"},{"color":"#c3e66b"}]},{"featureType":"poi.park","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#000000"},{"weight":"1.12"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#ffb800"},{"weight":"3.84"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#d3c624"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"weight":"0.99"},{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"lightness":"0"},{"color":"#f2a146"},{"visibility":"simplified"},{"weight":"2.92"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"hue":"#ff0000"},{"visibility":"simplified"},{"weight":"0.24"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"0"},{"color":"#cacaca"},{"visibility":"on"},{"weight":"0.68"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"hue":"#ff0000"},{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#5d5d5d"},{"weight":"0.90"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"color":"#ebebeb"},{"weight":"0.99"}]},{"featureType":"transit.line","elementType":"geometry.fill","stylers":[{"lightness":"-38"},{"color":"#c92db1"},{"weight":"0.33"}]},{"featureType":"transit.line","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"geometry.fill","stylers":[{"weight":"0.77"},{"visibility":"off"},{"color":"#000000"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#00b4ff"},{"weight":"0.86"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"weight":"1.91"},{"visibility":"off"},{"hue":"#1400ff"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"},{"weight":"0.55"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#00b4ff"},{"weight":"2.42"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"hue":"#ff0000"},{"visibility":"off"}]}];

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
      styles: colorfulStyles
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
