import Ember from 'ember';

export default function(app, test) {
  app.instanceInitializer({
    name: 'stubGMapAutocomplete',
    initialize(application) {
      test.gMapService = application.registry.lookup('service:g-map');
    }
  });
};
