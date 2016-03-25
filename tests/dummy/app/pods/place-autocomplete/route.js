import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    controller.set('setupRoutes', [
      {
        label: false,
        links: [
          {
            href: 'placeAutocomplete.index',
            text: 'Place Autocomplete'
          }
        ]
      }
    ]);
  }
});
