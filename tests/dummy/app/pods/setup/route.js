import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('setupRoutes', [
      {
        label: false,
        links: [
          {
            href: 'setup.index',
            text: 'Installation'
          }
        ]
      },
      {
        label: 'Configuration',
        links: [
          {
            href: 'setup.apiKey',
            text: 'API Key'
          },
          {
            href: 'setup.libraries',
            text: 'Adding Libraries'
          },
          {
            href: 'setup.misc',
            text: 'Misc Options'
          }
        ]
      }
    ]);
  }
});