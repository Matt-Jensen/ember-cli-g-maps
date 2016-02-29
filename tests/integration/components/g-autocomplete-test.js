import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
// import gMapService from 'ember-cli-g-maps/services/g-map';
import TestPlacesAutocomplete from 'ember-cli-g-maps/services/places-autocomplete';

moduleForComponent('g-autocomplete', 'Integration | Component | g autocomplete', {
  integration: true
});

test('should receive data when service is notified', function(assert) {
  assert.expect(1);
  this.register('service:test-places-autocomplete', TestPlacesAutocomplete);
  this.inject.service('test-places-autocomplete');
  let service = this.get('test-places-autocomplete');

  let receivedData;
  this.on('showLocation', function(data) {
    receivedData = data;
  });

  this.render(hbs`{{g-autocomplete on-select="showLocation"}}`);

  service.notify({ lat: '123', long: '456' });

  assert.deepEqual(receivedData, { lat: '123', long: '456' });
});
