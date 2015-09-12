import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 5,

      circles: Ember.A([
        {
          id: 'klaj32-flka2-adkj2-39',
          lat: 32.85494243654723,
          lng: -86.7359375,
          radius: 145000,
          fillOpacity: '0.4',
          fillColor: '#D43029',
          strokeColor: '#D43029',
          draggable: true,
          editable: true,
          dragstart: function() {
            controller.set('isCircleDragging', true);
          },
          dragend: function() {
            controller.set('isCircleDragging', false);
          },
          center_changed: function(circle) {
            if(!circle) { return false; }
            controller.set('circles.[].0.lat', circle.center.lat());
            controller.set('circles.[].0.lng', circle.center.lng());
          },
          radius_changed: function(circle) {
            if(!circle) { return false; }
            controller.set('circles.[].0.radius', Math.round(circle.radius));
          },
          mouseup: function(e, circle) {
            const lat = circle.center.lat();
            const lng = circle.center.lng();
            controller.setProperties({
              lat, lng,
              'circles.[].0.lat': lat,
              'circles.[].0.lng': lng,
              'circles.[].0.radius': Math.round(circle.radius)
            });
          }
        }
      ]),

      isCircleDragging: false,

      circle: Ember.computed.oneWay('circles.[].0')
    });
  }
});