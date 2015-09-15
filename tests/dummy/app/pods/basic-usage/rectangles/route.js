import Ember from 'ember';

const { computed } = Ember;

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 5,

      rectangles: Ember.A([{
        id: 'klaj32-fafs3-dka2-adkj2-39',
        bounds: [[34.79125047210739, -89.912109375], [30.80319254629092, -83.935546875]],
        strokeColor: '#1A954A',
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: '#1A954A',
        fillOpacity: 0.2,
        draggable: true,
        editable: true,
        dragstart: function() {
          controller.set('isRectDragging', true);
        },
        dragend: function() {
          controller.set('isRectDragging', false);
        },
        bounds_changed: function(rect) {
          if (!rect) { return false; }
          const ne = rect.bounds.getNorthEast();
          const sw = rect.bounds.getSouthWest();
          controller.set('rectangles.[].0.bounds.0', [ne.lat(), ne.lng()]);
          controller.set('rectangles.[].0.bounds.1', [sw.lat(), sw.lng()]);
        },
        mouseup: function(e, rect) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          const ne = rect.bounds.getNorthEast();
          const sw = rect.bounds.getSouthWest();
          controller.setProperties({
            lat, lng,
            'rectangles.[].0.bounds.0': [ne.lat(), ne.lng()],
            'rectangles.[].0.bounds.1': [sw.lat(), sw.lng()]
          });
        }
      }]),

      isRectDragging: false,

      rectangle: computed.oneWay('rectangles.[].0'),

      NEBoundStr: computed('rectangle.bounds.0', function() { 
        const ne = controller.get('rectangle.bounds.0');
        return `[${ne[0]}, ${ne[1]}]`;
      }),

      SWBoundStr: computed('rectangle.bounds.1', function() {
        const sw = controller.get('rectangle.bounds.1');
        return `[${sw[0]}, ${sw[1]}]`;
      })
    });
  }
});