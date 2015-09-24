import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('setupRoutes', [
      {
        label: false,
        links: [
          {
            href: 'service.index',
            text: 'Requirements'
          }
        ]
      },
      {
        label: 'Methods',
        links: [
          {
            href: 'service.travelRoute',
            text: 'Travel Route'
          },
          {
            href: 'service.suggestFrame',
            text: 'Suggest Frame'
          },
          {
            href: 'service.geocoding',
            text: 'Geocoding'
          },
          {
            href: 'service.refresh',
            text: 'Refresh'
          }
        ]
      }
    ]);
  }
});