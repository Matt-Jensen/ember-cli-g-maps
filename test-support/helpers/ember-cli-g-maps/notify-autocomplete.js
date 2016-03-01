import Ember from 'ember';

export default function(app, test, id, data) {
  Ember.run(function(){
    test.gMapService._notifyAutocomplete(id, null, data);
  });
};
