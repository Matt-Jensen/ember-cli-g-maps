import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import gMapService from 'ember-cli-g-maps/services/g-map';

moduleForComponent('g-autocomplete', 'Integration | Component | g autocomplete', {
  integration: true
});

test('it passes lat long to on-select action handler', function(assert) {
  assert.expect(5);

  let gMap, _component, _callback;

  stubGMapAutocomplete(this, {
    setupAutocomplete({component, callback}) {
      gMap = this;
      _component = component;
      _callback = callback;
    },
    teardownAutocomplete(component) {
      assert.ok(component, 'component is passed on teardown');
    }
  });

  this.on('select', function(place){
      let { lat, long } = place;
      assert.equal(lat, 'foo');
      assert.equal(long, 'bar');
  });

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{g-autocomplete on-select="select"}}`);

  assert.ok(_component);
  assert.ok(_callback);

  gMap.notifyAutocomplete(_component, _callback, { lat: 'foo', long: 'bar'});
});

function stubGMapAutocomplete(test, attrs) {
  test.registry.register('service:g-map', gMapService.extend(attrs));
}
