import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | place-autocomplete/index', {});

test('visiting /place-autocomplete/index', function(assert) {
  visit('/place-autocomplete/index');

  andThen(function() {
    assert.equal(currentURL(), '/place-autocomplete/index', 'visit correct path');
    assert.ok(find('.g-autocomplete').length > 0, 'g-autocomplete component was rendered');
  });

  fillIn('.g-autocomplete', 'NYC');
  selectAutocompletePlace();

  andThen(() => {
    assert.equal($('.lat').text().trim().slice(0, 3), '40', 'showing correct latitude');
    assert.equal($('.long').text().trim().slice(0, 3), '-74', 'showing correct longitude');
  });
});
