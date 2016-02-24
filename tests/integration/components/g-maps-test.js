import hbs                          from 'htmlbars-inline-precompile';
import Ember                        from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
// import waitForPromise               from '../../helpers/wait-for-promise';

moduleForComponent('g-maps', 'Integration | Component | g maps', {
  integration: true,
  beforeEach() {
    this.inject.service('g-map', { as: 'gMapService' });
  }
});

test('it renders', function(assert) {
  this.setProperties({
    name: 'name',
    lat: 0,
    lng: 0,
    zoom: 10,
    gMap: Ember.inject.service()
  });

  this.render(hbs`{{g-maps name=name lat=lat lng=lng zoom=zoom}}`);

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

test('it should add a map instance to the g-map service', function(assert) {
  assert.expect(1);

  this.setProperties({
    name: 'name',
    lat: 0,
    lng: 0,
    zoom: 10,
    gMap: Ember.inject.service()
  });

  this.render(hbs`{{g-maps name=name lat=lat lng=lng zoom=zoom}}`);

  assert.equal(
    this.get('gMapService').maps.select('name').name,
    'name',
    'should have added a map instance to map service'
  );
});

test('it should sync on `isMapLoaded` and updates to bound `markers.[]`', function(assert) {
  this.setProperties({
    markers: Ember.A(),
    map: null
  });

  // *Warning* causes console warning: "was modified inside the didInsertElement hook"
  this.render(hbs`{{g-maps markers=markers isMapLoaded=true map=(mut map)}}`);

  assert.equal(this.get('map.markers.length'), '0', 'should have `0` markers length');

  this.get('markers').pushObject({ id: 123, lat: 1, lng: 1});

  assert.equal(this.get('map.markers.length'), '1', 'should have `1` markers length');
});

test('it should sync on `isMapLoaded` and updates to bound `circles.[]`', function(assert) {
  this.setProperties({
    circles: Ember.A(),
    map: null
  });

  // *Warning* causes console warning: "was modified inside the didInsertElement hook"
  this.render(hbs`{{g-maps circles=circles isMapLoaded=true map=(mut map)}}`);

  assert.equal(this.get('map.circles.length'), '0', 'should have `0` circles length');

  this.get('circles').pushObject({ id: 123, lat: 1, lng: 1, radius: 2 });

  assert.equal(this.get('map.circles.length'), '1', 'should have `1` circles length');
});

test('it should sync on `isMapLoaded` and updates to bound `polygons.[]`', function(assert) {
  this.setProperties({
    polygons: Ember.A(),
    map: null
  });

  // *Warning* causes console warning: "was modified inside the didInsertElement hook"
  this.render(hbs`{{g-maps polygons=polygons isMapLoaded=true map=(mut map)}}`);

  assert.equal(this.get('map.polygons.length'), '0', 'should have `0` polygons length');

  this.get('polygons').pushObject({ id: 123, paths: [ [1, 2], [2, 1] ]});

  assert.equal(this.get('map.polygons.length'), '1', 'should have `1` polygons length');
});

test('it should sync on `isMapLoaded` and updates to bound `polylines.[]`', function(assert) {
  this.setProperties({
    polylines: Ember.A(),
    map: null
  });

  // *Warning* causes console warning: "was modified inside the didInsertElement hook"
  this.render(hbs`{{g-maps polylines=polylines isMapLoaded=true map=(mut map)}}`);

  assert.equal(this.get('map.polylines.length'), '0', 'should have `0` polylines length');

  this.get('polylines').pushObject({ id: 123, path: [ [1, 2], [2, 1] ]});

  assert.equal(this.get('map.polylines.length'), '1', 'should have `1` polylines length');
});

test('it should sync on `isMapLoaded` and updates to bound `rectangles.[]`', function(assert) {
  this.setProperties({
    rectangles: Ember.A(),
    map: null
  });

  // *Warning* causes console warning: "was modified inside the didInsertElement hook"
  this.render(hbs`{{g-maps rectangles=rectangles isMapLoaded=true map=(mut map)}}`);

  assert.equal(this.get('map.rectangles.length'), '0', 'should have `0` rectangles length');

  this.get('rectangles').pushObject({ id: 123, bounds: [ [1, 2], [2, 1] ]});

  assert.equal(this.get('map.rectangles.length'), '1', 'should have `1` rectangles length');
});

test('it should sync on `isMapLoaded` and updates to bound `overlays.[]`', function(assert) {
  this.setProperties({
    overlays: Ember.A(),
    map: null
  });

  // *Warning* causes console warning: "was modified inside the didInsertElement hook"
  this.render(hbs`{{g-maps overlays=overlays isMapLoaded=true map=(mut map)}}`);

  assert.equal(this.get('map.overlays.length'), '0', 'should have `0` overlays length');

  this.get('overlays').pushObject({ id: 123, lat: 1, lng: 1});

  assert.equal(this.get('map.overlays.length'), '1', 'should have `1` overlays length');
});
