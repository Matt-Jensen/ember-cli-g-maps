import Ember from 'ember';

export default function(app, data) {
  Ember.run(function() {
    let service = app.__container__.lookup('service:test-places-autocomplete');
    service.notify(data);
  });
}
