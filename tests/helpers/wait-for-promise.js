import Ember from 'ember';

export default Ember.Test.registerAsyncHelper("waitForPromise", function(app, promise) {
  return new Ember.Test.promise((resolve) => {
    Ember.Test.adapter.asyncStart();
    promise.then(() => {
      Ember.run.schedule('afterRender', null, resolve);
      Ember.Test.adapter.asyncEnd();
    });
  });  
});