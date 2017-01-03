import RSVP from 'rsvp';
import $ from 'jquery';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

moduleForComponent('g-map-marker', 'Integration | Component | g map marker', {
  integration: true
});

test('it renders marker on a g-map instance', function(assert) {
  this.render(hbs`{{#g-map as |map|}}{{g-map-marker map}}{{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then((markers) => {
    assert.equal(markers.length, 1, 'rendered a single g-map-marker on g-map instance');
  });
});

test('it renders marker in center of map if a position is not given', function(assert) {
  const expected = this.set('center', {lat: 34, lng: 32});

  this.render(hbs`{{#g-map center=center as |map|}}{{g-map-marker map}}{{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([marker]) => {
    const actual = getMarkerLatLng(marker);
    assert.deepEqual(actual, expected, 'rendered marker in center of g-map instance');
  });
});

test('it renders all marker positioning strategies', function(assert) {
  const lat = this.set('lat', 34);
  const lng = this.set('lng', 32);
  const expected = this.set('position', {lat, lng});
  this.set('options', {position: {lat, lng}});
  this.set('optionsLatLng', {lat, lng});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map lat=lat lng=lng}}
    {{g-map-marker map position=position}}
    {{g-map-marker map options=options}}
    {{g-map-marker map options=optionsLatLng}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([latLng, position, options, optionsLatLng]) => {
    const actualLatLng = getMarkerLatLng(latLng);
    assert.equal(actualLatLng.lat, lat, 'rendered marker at top-level lat');
    assert.equal(actualLatLng.lng, lng, 'rendered marker at top-level lng');

    const actualPosition = getMarkerLatLng(position);
    assert.deepEqual(actualPosition, expected, 'rendered marker at top-level position');

    const actualOptions = getMarkerLatLng(options);
    assert.deepEqual(actualOptions, expected, 'rendered marker at options.position');

    const actualOptionsLatLng = getMarkerLatLng(optionsLatLng);
    assert.deepEqual(actualOptionsLatLng, expected, 'rendered marker at options.{lat,lng}');
  });
});

test('it sets anchor point', function(assert) {
  const anchorPoint = {x: 0, y: -40};
  this.set('anchorPoint', anchorPoint);
  this.set('options', {anchorPoint});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map anchorPoint=anchorPoint}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.anchorPoint.x, anchorPoint.x, 'set anchor point `x` via property');
    assert.equal(topLevel.anchorPoint.y, anchorPoint.y, 'set anchor point `y` via property');
    assert.equal(options.anchorPoint.x, anchorPoint.x, 'set anchor point `x` via options');
    assert.equal(options.anchorPoint.y, anchorPoint.y, 'set anchor point `y` via options');
  });
});

test('it sets animation', function(assert) {
  const animation = 'DROP';
  const expected = google.maps.Animation[animation];

  this.set('animation', animation);
  this.set('options', {animation});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map animation=animation}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getAnimation(), expected, 'set animation via property');
    assert.equal(options.getAnimation(), expected, 'set animation via options');
  });
});

// TODO
// test('it sets clickable', function(assert) {});
// test('it sets crossOnDrag', function(assert) {});
// test('it sets cursor', function(assert) {});
// test('it sets draggable', function(assert) {});
// test('it sets all icon strategies', function(assert) {});
// test('it sets label', function(assert) {});
// test('it sets opacity', function(assert) {});
// test('it sets optimized', function(assert) {});
// test('it sets position', function(assert) {});
// test('it sets shape as a circle, poly, or rect', function(assert) {});
// test('it sets title', function(assert) {});
// test('it sets visible', function(assert) {});
// test('it sets zIndex', function(assert) {});

/*
 * User Actions API
 */
test('it provides the default mouse event argument to all click actions', function(assert) {
  assert.expect(10);
  const stubMouseEvent = {};

  const mouseEvents = [
    'click',
    'dblclick',
    'drag',
    'dragend',
    'dragstart',
    'mousedown',
    'mouseout',
    'mouseover',
    'mouseup',
    'rightclick'
  ];

  mouseEvents.forEach((event) => {
    this.on(event, (mouseEvent) =>
      assert.equal(mouseEvent, stubMouseEvent, `${event} action was called with mouse event`));
  });

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map
      click="click"
      dblclick=(action "dblclick")
      drag=(action "drag")
      dragend=(action "dragend")
      dragstart=(action "dragstart")
      mousedown=(action "mousedown")
      mouseout=(action "mouseout")
      mouseover=(action "mouseover")
      mouseup=(action "mouseup")
      rightclick=(action "rightclick")}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([marker]) => {

    // Trigger all mouse events on marker
    mouseEvents.forEach((event) =>
      google.maps.event.trigger(marker, event, stubMouseEvent));
  });
});

test('it provides the relevant map state as change action arguments', function(assert) {
  const changeProperties = {
    animation_changed: 'animation',
    clickable_changed: 'clickable',
    cursor_changed: 'cursor',
    draggable_changed: 'draggable',
    icon_changed: 'icon',
    position_changed: 'position',
    shape_changed: 'shape',
    title_changed: 'title',
    visible_changed: 'visible',
    zindex_changed: 'zIndex'
  };

  const changeValues = {
    animation_changed: 'DROP',
    clickable_changed: false,
    cursor_changed: 'pointer',
    draggable_changed: true,
    icon_changed: 'beachflag.png',
    position_changed: {lat: 34, lng: 32},
    shape_changed: {coords: [34, 32, 60], type: 'circle'},
    title_changed: 'test',
    visible_changed: false,
    zindex_changed: 1000
  };

  // Add marker state properties
  this.set('options', {});
  Object.keys(changeProperties).forEach((event) =>
    this.set(`options.${changeProperties[event]}`, changeValues[event]));

  // Add change event listeners
  Object.keys(changeValues).forEach((event) => {
    if (event !== 'position_changed') {
      this.on(event, (value) =>
        assert.equal(value, changeValues[event], `${event} action was called with map state: ${changeValues[event]}`));
    }
  });

  this.on('position_changed', (value) => {
    const actual = {lat: parseInt(value.lat, 10), lng: parseInt(value.lng, 10)};
    assert.deepEqual(actual, changeValues.position_changed, 'position_changed action was called with marker state: `{lat: 34, lng: 32}`');
  });

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map
      options=options
      animation_changed=(action "animation_changed")
      clickable_changed=(action "clickable_changed")
      cursor_changed=(action "cursor_changed")
      draggable_changed=(action "draggable_changed")
      icon_changed=(action "icon_changed")
      position_changed=(action "position_changed")
      shape_changed=(action "shape_changed")
      title_changed=(action "title_changed")
      visible_changed=(action "visible_changed")
      zindex_changed=(action "zindex_changed")}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([marker]) => {

    // Trigger all change events on marker
    Object.keys(changeValues).forEach((event) =>
      google.maps.event.trigger(marker, event));
  });
});

/**
 * @param  {google.maps.Marker} marker
 * @return {Object}        LatLng literal
 */
function getMarkerLatLng(marker) {
  const pos = marker.getPosition();
  return {lat: parseInt(pos.lat(), 10), lng: parseInt(pos.lng(), 10)};
}

/**
 * @param  {HTMLElement} element   HTML element that Google Map was instantiated on
 * @return {Array}   Google Map Markers array
 */
function getGoogleMapMarkers(element) {
  if (element instanceof $) {
    element = element.get(0);
  }

  return new RSVP.Promise((resolve) => {
    run.later(() => resolve(element.__GOOGLE_MAP_MARKERS__), 100);
  });
}
