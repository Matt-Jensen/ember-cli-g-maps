import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | service/geocoding');

test('should return geocode results for default address and reverse geocode', function(assert) {
  visit('/service/geocoding');

  andThen(function() {
    assert.equal(currentURL(), '/service/geocoding', 'visit correct path');
  });

  waitForGoogleMap();
  waitForGeocodeRequests();
  wait(500);

  let originalSuggestions;

  andThen(() => {
    originalSuggestions = getSuggestionsText();
    assert.ok(Boolean(originalSuggestions.length), 'provided geocode results');
  });

  click('#reverse-geocode-button');
  waitForGeocodeRequests();

  andThen(() => {
    const newSuggestions = getSuggestionsText();
    assert.ok(Boolean(newSuggestions), 'reverse geocode suggestions exist');
    assert.notEqual(originalSuggestions, newSuggestions, 'suggestions were updated');
  });
});

function getSuggestionsText() {
  return find('#geocode-suggestions').text().trim();
}
