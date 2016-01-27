import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('notifyAutocomplete', function(app, test, id, data) {
  Ember.run(function(){
    test.gMapService.notifyAutocomplete(id, null, data);
  });
});
