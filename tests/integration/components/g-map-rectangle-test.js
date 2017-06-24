import Ember from 'ember';
import RSVP from 'rsvp';
import $ from 'jquery';
import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

import {makeSquareBounds} from 'ember-cli-g-maps/components/g-map-rectangle/component';

moduleForComponent('g-map-rectangle', 'Integration | Component | g map rectangle', {
  integration: true
});

test('it renders a rectangle on a g-map instance', function(assert) {
  this.render(hbs`{{#g-map as |map|}}{{g-map-rectangle map}}{{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then((rectangles) => {
    assert.equal(rectangles.length, 1, 'rendered a single g-map-rectangle on g-map instance');
  });
});

test('it renders a default rectangle in center of map if a bounds is not given', function(assert) {
  const expected = makeSquareBounds(this.set('center', {lat: 34, lng: 32}));

  this.render(hbs`{{#g-map center=center as |map|}}{{g-map-rectangle map}}{{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([rectangle]) => {
    const actual = getBoundLiteral(rectangle);
    assert.deepEqual(actual, expected, 'rendered rectangle in center of g-map instance');
  });
});

test('it renders all rectangle bounds strategies', function(assert) {
  const bounds = makeSquareBounds({lat: 34, lng: 32});
  const expected = this.set('bounds', bounds);

  this.set('options', {bounds});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map bounds=bounds}}
    {{g-map-rectangle map options=options}}
  {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    const actualBounds = getBoundLiteral(topLevel);
    assert.deepEqual(actualBounds, expected, 'rendered rectangle at top-level bounds');

    const actualOptions = getBoundLiteral(options);
    assert.deepEqual(actualOptions, expected, 'rendered rectangle at options.bounds');
  });
});

test('it sets clickable', function(assert) {
  const expected = false;

  this.set('clickable', expected);
  this.set('options', {clickable: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map clickable=clickable}}
    {{g-map-rectangle map options=options}}
  {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.clickable, expected, 'set clickable via property');
    assert.equal(options.clickable, expected, 'set clickable via options');
  });
});

test('it sets draggable', function(assert) {
  const expected = true;

  this.set('draggable', expected);
  this.set('options', {draggable: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map draggable=draggable}}
    {{g-map-rectangle map options=options}}
  {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getDraggable(), expected, 'set draggable via property');
    assert.equal(options.getDraggable(), expected, 'set draggable via options');
  });
});

test('it sets editable', function(assert) {
  const expected = true;

  this.set('editable', expected);
  this.set('options', {editable: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map editable=editable}}
    {{g-map-rectangle map options=options}}
  {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getEditable(), expected, 'set editable via property');
    assert.equal(options.getEditable(), expected, 'set editable via options');
  });
});

test('it sets fillColor', function(assert) {
  const expected = '#FFFFFF';

  this.set('fillColor', expected);
  this.set('options', {fillColor: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map fillColor=fillColor}}
    {{g-map-rectangle map options=options}}
  {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.fillColor, expected, 'set fillColor via property');
    assert.equal(options.fillColor, expected, 'set fillColor via options');
  });
});

test('it sets fillOpacity', function(assert) {
  const expected = 0.85;

  this.set('fillOpacity', expected);
  this.set('options', {fillOpacity: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map fillOpacity=fillOpacity}}
    {{g-map-rectangle map options=options}}
  {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.fillOpacity, expected, 'set fillOpacity via property');
    assert.equal(options.fillOpacity, expected, 'set fillOpacity via options');
  });
});

test('it sets strokeColor', function(assert) {
  const expected = '#FFFFFF';

  this.set('strokeColor', expected);
  this.set('options', {strokeColor: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map strokeColor=strokeColor}}
    {{g-map-rectangle map options=options}}
  {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.strokeColor, expected, 'set strokeColor via property');
    assert.equal(options.strokeColor, expected, 'set strokeColor via options');
  });
});

test('it sets strokeOpacity', function(assert) {
  const expected = 0.85;

  this.set('strokeOpacity', expected);
  this.set('options', {strokeOpacity: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map strokeOpacity=strokeOpacity}}
    {{g-map-rectangle map options=options}}
  {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.strokeOpacity, expected, 'set strokeOpacity via property');
    assert.equal(options.strokeOpacity, expected, 'set strokeOpacity via options');
  });
});

test('it sets strokePosition', function(assert) {
  const position = 'INSIDE';
  const expected = google.maps.StrokePosition[position];

  this.set('strokePositionName', position);
  this.set('options', {strokePosition: position});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map strokePosition=strokePositionName}}
    {{g-map-rectangle map options=options}}
  {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.strokePosition, expected, 'set strokePosition via property');
    assert.equal(options.strokePosition, expected, 'set strokePosition via options');
  });
});

test('it sets strokeWeight', function(assert) {
  const expected = 10;

  this.set('strokeWeight', expected);
  this.set('options', {strokeWeight: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map strokeWeight=strokeWeight}}
    {{g-map-rectangle map options=options}}
  {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.strokeWeight, expected, 'set strokeWeight via property');
    assert.equal(options.strokeWeight, expected, 'set strokeWeight via options');
  });
});

test('it sets visible', function(assert) {
  const expected = false;

  this.set('visible', expected);
  this.set('options', {visible: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map visible=visible}}
    {{g-map-rectangle map options=options}}
  {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getVisible(), expected, 'set visible via property');
    assert.equal(options.getVisible(), expected, 'set visible via options');
  });
});

test('it sets zIndex', function(assert) {
  const expected = 999;

  this.set('zIndex', expected);
  this.set('options', {zIndex: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map zIndex=zIndex}}
    {{g-map-rectangle map options=options}}
  {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.zIndex, expected, 'set zIndex via property');
    assert.equal(options.zIndex, expected, 'set zIndex via options');
  });
});

test('it consumes `options` hash along with top-level values', function(assert) {
  const clickable = false;
  const zIndex = this.set('zIndex', 900);
  this.set('options', {clickable});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map options=options zIndex=zIndex}}
  {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([rectangle]) => {
    assert.equal(rectangle.zIndex, zIndex, 'set zIndex via top-level property');
    assert.equal(rectangle.clickable, clickable, 'set clickable via options');
  });
});

/*
 * User Actions API
 */

test('it provides the default mouse event argument to all click actions', function(assert) { //   assert.expect(10);
  const stubMouseEvent = {};

  const mouseEvents = [
    'click',
    'dblclick',
    'drag',
    'dragend',
    'dragstart',
    'mousedown',
    'mousemove',
    'mouseover',
    'mouseup',
    'rightclick'
  ];

  mouseEvents.forEach((event) => {
    this.on(event, (mouseEvent) =>
      assert.equal(mouseEvent, stubMouseEvent, `${event} action was called with mouse event`));
  });

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map
      click="click"
      dblclick=(action "dblclick")
      drag=(action "drag")
      dragend=(action "dragend")
      dragstart=(action "dragstart")
      mousedown=(action "mousedown")
      mousemove=(action "mousemove")
      mousemove=(action "mousemove")
      mouseover=(action "mouseover")
      mouseup=(action "mouseup")
      rightclick=(action "rightclick")}}
    {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([rectangle]) => {

    // Trigger all mouse events on rectangle
    mouseEvents.forEach((event) =>
      google.maps.event.trigger(rectangle, event, stubMouseEvent));
  });
});

test('it provides expected argument(s) to bounds update events', function(assert) {
  this.on('bounds_changed', (bounds) =>
    assert.ok(bounds, 'bounds_changed action was called with the bounds'));

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-rectangle map
      bounds_changed=(action "bounds_changed")}}
    {{/g-map}}`);

  return getGoogleMapRectangles(this.$('.ember-cli-g-map')).then(([rectangle]) => {
    Ember.run.next(() => google.maps.event.trigger(rectangle, 'bounds_changed'));
  });
});

/**
 * @param  {google.maps.rectangle} rectangle
 * @return {Object}        LatLng literal
 */
function getBoundLiteral(rectangle) {
  const bounds = rectangle.getBounds().toJSON();
  return [{lat: bounds.north, lng: bounds.east}, {lat: bounds.south, lng: bounds.west}];
}

/**
 * @param  {HTMLElement} element   HTML element that Google Map was instantiated on
 * @return {Array}   Google Map rectangles array
 */
function getGoogleMapRectangles(element) {
  if (element instanceof $) {
    element = element.get(0);
  }

  return new RSVP.Promise((resolve) => {
    run.later(() => resolve(element.__GOOGLE_MAP_RECTANGLES__), 100);
  });
}
