import Ember from 'ember';
import notifyGMapAutocomplete from './notify-autocomplete';
import stubGMapAutocomplete from './stub-autocomplete';

export default function() {
  Ember.Test.registerAsyncHelper('notifyGMapAutocomplete', notifyGMapAutocomplete);
  Ember.Test.registerAsyncHelper('stubGMapAutocomplete', stubGMapAutocomplete);
}
