import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('notifyAutocomplete', function(app, test, id, data) {
  test.gMapService.notifyAutocomplete(id, null, data);
});
