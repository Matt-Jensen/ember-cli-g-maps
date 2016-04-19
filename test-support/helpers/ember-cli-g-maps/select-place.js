import Ember from 'ember';

export default function(app, ...args) {
  Ember.run(function() {
    let service = app.__container__.lookup('service:test-g-maps');
    service.selectPlace(...args);
  });
}
