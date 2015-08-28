import hbs                          from 'htmlbars-inline-precompile';
import Ember                        from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import waitForPromise               from '../../helpers/wait-for-promise';

moduleForComponent('g-maps', 'Integration | Component | g maps', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... })

  this.setProperties({
    name: 'name',
    lat: 0,
    lng: 0,
    zoom: 10,
    gMap: Ember.inject.service()
  });

  this.render(hbs`
    {{g-maps
      name=name
      lat=lat
      lng=lng
      zoom=zoom}}
  `);

  /* Need map to render
  Ember.run(() => {
    this.get('gMap').maps.select('name').onLoad.then(() => {
      console.log('excelzior!');
    });
  });
  */

  const $gmap = this.$('.ember-cli-g-map');
  assert.equal($gmap.length, 1);
});
