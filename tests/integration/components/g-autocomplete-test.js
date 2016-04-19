import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import gMapsSetupTest from '../../helpers/ember-cli-g-maps/setup-test';

moduleForComponent('g-autocomplete', 'Integration | Component | g autocomplete', {
  integration: true
});

test('should receive data when service is notified', function(assert) {
  assert.expect(1);
  gMapsSetupTest(this);

  let receivedData;
  this.on('showLocation', function(data) {
    receivedData = data;
  });

  this.render(hbs`{{g-autocomplete on-select="showLocation"}}`);

  this.gMapsSelectPlace({ lat: '123', long: '456' });

  assert.deepEqual(receivedData, { lat: '123', long: '456' });
});
