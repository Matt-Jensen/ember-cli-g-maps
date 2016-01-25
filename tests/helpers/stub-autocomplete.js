import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('stubAutocomplete', function(app, test) {
  app.instanceInitializer({
    name: 'stubAutocomplete',
    initialize(application) {
      test.gMapService = application.registry.lookup('service:g-map');
    }
  });
});
