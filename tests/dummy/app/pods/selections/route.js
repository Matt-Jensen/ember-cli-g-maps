import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('setupRoutes', [
      {
        label: false,
        links: [
          {
            href: 'selections.index',
            text: 'Setup'
          },
          {
            href: 'selections.properties',
            text: 'Properties'
          },
          {
            href: 'selections.events',
            text: 'Events'
          }
        ]
      },
      {
        label: 'Selectors',
        links: [
          {
            href: 'selections.marker',
            text: 'Marker'
          },
          {
            href: 'selections.rectangle',
            text: 'Rectangle'
          },
          {
            href: 'selections.circle',
            text: 'Circle'
          },
          {
            href: 'selections.polygon',
            text: 'Polygon'
          },
          {
            href: 'selections.polyline',
            text: 'Polyline'
          }
        ]
      }
    ]);
  }
});