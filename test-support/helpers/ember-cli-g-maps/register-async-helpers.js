import Ember from 'ember';
import selectAutocompletePlace from './select-autocomplete-place-helper';
import waitForGoogleMap from './wait-for-google-map-helper';
import waitForGeocodeRequests from './wait-for-geocode-requests-helper';
import stubGeocodeRequests from './stub-geocode-requests-helper';

export default function() {
  Ember.Test.registerAsyncHelper('selectPlace', () => {
    Ember.Logger.warn(`Please replace disabled helper "selectPlace" with "selectAutocompletePlace" helper.
Usage details here: http://http://matt-jensen.github.io/ember-cli-g-maps/#/place-autocomplete/index`)
  });
  Ember.Test.registerAsyncHelper('selectAutocompletePlace', selectAutocompletePlace);
  Ember.Test.registerAsyncHelper('waitForGoogleMap', waitForGoogleMap);
  Ember.Test.registerAsyncHelper('waitForGeocodeRequests', waitForGeocodeRequests);
  Ember.Test.registerAsyncHelper('stubGeocodeRequests', stubGeocodeRequests);
}
