import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import GAutocomplete from 'ember-cli-g-maps/components/g-autocomplete';

moduleForComponent('g-autocomplete', 'Integration | Component | g autocomplete', {
  integration: true
});

test('it passes lat long to on-select action handler', function(assert) {
  assert.expect(4);

  let _component, _callback;

  let gMapService = Ember.Object.extend({
    setupAutocomplete({component, callback}) {
      _component = component;
      _callback = callback;
    }
  });

  stubAutocomplete(this, gMapService);

  this.on('select', function(place){
      let { lat, long } = place;
      assert.equal(lat, 'foo');
      assert.equal(long, 'bar');
  });

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{test-autocomplete on-select="select"}}`);

  assert.ok(_component);
  assert.ok(_callback);

  _callback.call(_component, { lat: 'foo', long: 'bar'});
});

function stubAutocomplete(test, gMapService) {
  test.registry.register('service:g-map', gMapService);
  test.registry.register('component:test-autocomplete', GAutocomplete.extend({
    layout: hbs`<input>`
  }));
}
