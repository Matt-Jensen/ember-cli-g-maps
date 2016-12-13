import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | service/geocoding');

test('should return geocode results for default address reverse geocode', function(assert) {
  visit('/service/geocoding');

  andThen(function() {
    assert.equal(currentURL(), '/service/geocoding', 'visit correct path');
  });

  waitForGoogleMap();
  waitForGeocodeRequests();

  let originalSuggestions;

  andThen(() => {
    originalSuggestions = getSuggestionsText();
    assert.ok(originalSuggestions.length, 'should provide geocode results');
  });

  click('#reverse-geocode-button');
  waitForGeocodeRequests();

  andThen(() => {
    const newSuggestions = getSuggestionsText();
    assert.ok(newSuggestions, 'reverse geocode suggestions exist');
    assert.notEqual(originalSuggestions, newSuggestions, 'suggestions were updated');
  });
});

function getSuggestionsText() {
  return find('#geocode-suggestions').text().trim();
}
