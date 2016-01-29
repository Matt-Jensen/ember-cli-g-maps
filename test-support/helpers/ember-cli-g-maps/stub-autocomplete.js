import Ember from 'ember';

export default function(app, test) {
  test.gMapService = app.__container__.lookup('service:g-map');
};
