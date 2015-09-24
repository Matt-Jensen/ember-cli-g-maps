import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('setupRoutes', [
      {
        label: false,
        links: [
          {
            href: 'heatmap.index',
            text: 'Setup'
          },
          {
            href: 'heatmap.properties',
            text: 'Properties'
          },
          {
            href: 'heatmap.marker',
            text: 'Heatmap Marker'
          }
        ]
      }
    ]);
  }
});