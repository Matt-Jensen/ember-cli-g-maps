import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('setupRoutes', [
      {
        label: false,
        links: [
          {
            href: 'basicUsage.index',
            text: 'Basic GMap'
          }
        ]
      },
      {
        label: 'Map',
        links: [
          {
            href: 'basicUsage.mapProperties',
            text: 'Properties'
          },
          {
            href: 'basicUsage.mapEvents',
            text: 'Events'
          }
        ]
      },
      {
        label: 'Elements',
        links: [
          {
            href: 'basicUsage.markers',
            text: 'Markers'
          },
          {
            href: 'basicUsage.circles',
            text: 'Circles'
          },
          {
            href: 'basicUsage.polygons',
            text: 'Polygons'
          },
          {
            href: 'basicUsage.polylines',
            text: 'Polylines'
          },
          {
            href: 'basicUsage.rectangles',
            text: 'Rectangles'
          },
          {
            href: 'basicUsage.overlays',
            text: 'Overlays'
          }
        ]
      }
    ]);
  }
});
