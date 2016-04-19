import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import gMapsSetupTest from '../helpers/ember-cli-g-maps/setup-test';

moduleForAcceptance('Acceptance | place-autocomplete/index', {
  beforeEach() {
    gMapsSetupTest(this);
  }
});

test('visiting /place-autocomplete/index', function(assert) {
  visit('/place-autocomplete/index');

  andThen(function() {
    assert.equal(currentURL(), '/place-autocomplete/index', 'visit correct path');
    assert.ok(find('.g-autocomplete').length > 0, 'g-autocomplete component was rendered');
  });

  selectPlace({ 
    lat: '123', 
    lng: '456', 
    place: { formatted_address: '123 Sesame St' } 
  });

  andThen(() => {
    assert.equal($('.lat').text().trim(), '123', 'showing correct latitude');
    assert.equal($('.long').text().trim(), '456', 'showing correct longitude');
  });
});
