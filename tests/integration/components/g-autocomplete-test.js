import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import gMapService from 'ember-cli-g-maps/services/g-map';

function stubGMapAutocomplete(test, attrs) {
  test.registry.register('service:g-map', gMapService.extend(attrs));
}

moduleForComponent('g-autocomplete', 'Integration | Component | g autocomplete', {
  integration: true
});

test('it passes lat lng to on-select action and closure action handler', function(assert) {
  assert.expect(7);

  let gMap, _component, _callback;

  stubGMapAutocomplete(this, {
    setupAutocomplete({component, callback}) {
      gMap = this;
      _component = component;
      _callback = callback;

      assert.ok(component && callback, 'component and callback are passed to `setupAutocomplete`');
    },
    teardownAutocomplete(component) {
      assert.ok(component, 'component is passed on teardown');
    }
  });

  this.on('select', function(place){
    const { lat, long } = place;
    assert.equal(lat, 'foo', 'should equal mocked `lat`');
    assert.equal(long, 'bar', 'should equal mocked `lng`');
  });

  this.render(hbs`{{g-autocomplete on-select="select"}}`);

  gMap._notifyAutocomplete(_component, _callback, { lat: 'foo', long: 'bar'});

  this.render(hbs`{{g-autocomplete on-select=(action "select")}}`);

  gMap._notifyAutocomplete(_component, _callback, { lat: 'foo', long: 'bar'});
});
