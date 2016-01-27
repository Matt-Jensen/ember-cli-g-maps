import Ember from 'ember';

export default function(app, test) {
  app.instanceInitializer({
    name: 'stubGMapAutocomplete',
    initialize(application) {
      let emberVersion = parseFloat(Ember.VERSION);
      if (emberVersion >= 2.1) {
        test.gMapService = application.lookup('service:g-map');
      } else {
        test.gMapService = application.registry.lookup('service:g-map');
      }
    }
  });
};
