import Ember from 'ember';
import RSVP from 'rsvp';
import $ from 'jquery';
import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

import {makeTrianglePath} from 'ember-cli-g-maps/components/g-map-polyline/component';

const SVG_NOTATION = 'M10 10 H 90 V 90 H 10 L 10 10';

moduleForComponent('g-map-polyline', 'Integration | Component | g map polyline', {
  integration: true
});

test('it renders polyline on a g-map instance', function(assert) {
  this.render(hbs`{{#g-map as |map|}}{{g-map-polyline map}}{{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then((polylines) => {
    assert.equal(polylines.length, 1, 'rendered a single g-map-polyline on g-map instance');
  });
});

test('it renders a default polyline in center of map if a path is not given', function(assert) {
  const expected = makeTrianglePath(this.set('center', {lat: 34, lng: 32}));

  this.render(hbs`{{#g-map center=center as |map|}}{{g-map-polyline map}}{{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([polyline]) => {
    const actual = getPathLiteral(polyline);
    assert.deepEqual(actual, expected, 'rendered polyline in center of g-map instance');
  });
});

test('it renders all polyline path strategies', function(assert) {
  const path = makeTrianglePath({lat: 34, lng: 32});
  const expected = this.set('path', path);

  this.set('options', {path});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-polyline map path=path}}
    {{g-map-polyline map options=options}}
  {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    const actualPath = getPathLiteral(topLevel);
    assert.deepEqual(actualPath, expected, 'rendered polyline at top-level path');

    const actualOptions = getPathLiteral(options);
    assert.deepEqual(actualOptions, expected, 'rendered polyline at options.path');
  });
});

test('it sets clickable', function(assert) {
  const expected = false;

  this.set('clickable', expected);
  this.set('options', {clickable: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-polyline map clickable=clickable}}
    {{g-map-polyline map options=options}}
  {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.clickable, expected, 'set clickable via property');
    assert.equal(options.clickable, expected, 'set clickable via options');
  });
});

test('it sets draggable', function(assert) {
  const expected = true;

  this.set('draggable', expected);
  this.set('options', {draggable: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-polyline map draggable=draggable}}
    {{g-map-polyline map options=options}}
  {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getDraggable(), expected, 'set draggable via property');
    assert.equal(options.getDraggable(), expected, 'set draggable via options');
  });
});

test('it sets editable', function(assert) {
  const expected = true;

  this.set('editable', expected);
  this.set('options', {editable: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-polyline map editable=editable}}
    {{g-map-polyline map options=options}}
  {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getEditable(), expected, 'set editable via property');
    assert.equal(options.getEditable(), expected, 'set editable via options');
  });
});

test('it sets geodesic', function(assert) {
  const expected = true;

  this.set('geodesic', expected);
  this.set('options', {geodesic: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-polyline map geodesic=geodesic}}
    {{g-map-polyline map options=options}}
  {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.geodesic, expected, 'set geodesic via property');
    assert.equal(options.geodesic, expected, 'set geodesic via options');
  });
});

test('it sets icons', function(assert) {
  const expected = [{
    fixedRotation: true,
    icon: {path: SVG_NOTATION},
    offset: '10%',
    repeat: '10%'
  }];

  this.set('icons', expected);
  this.set('options', {icons: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-polyline map icons=icons}}
    {{g-map-polyline map options=options}}
  {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.deepEqual(topLevel.icons.map(i => i.toJSON()), expected, 'set icons via property');
    assert.deepEqual(options.icons.map(i => i.toJSON()), expected, 'set icons via options');
  });
});

test('it sets strokeColor', function(assert) {
  const expected = '#000000';

  this.set('strokeColor', expected);
  this.set('options', {strokeColor: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-polyline map strokeColor=strokeColor}}
    {{g-map-polyline map options=options}}
  {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.strokeColor, expected, 'set strokeColor via property');
    assert.equal(options.strokeColor, expected, 'set strokeColor via options');
  });
});

test('it sets strokeOpacity', function(assert) {
  const expected = 0.85;

  this.set('strokeOpacity', expected);
  this.set('options', {strokeOpacity: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-polyline map strokeOpacity=strokeOpacity}}
    {{g-map-polyline map options=options}}
  {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.strokeOpacity, expected, 'set strokeOpacity via property');
    assert.equal(options.strokeOpacity, expected, 'set strokeOpacity via options');
  });
});

test('it sets strokeWeight', function(assert) {
  const expected = 10;

  this.set('strokeWeight', expected);
  this.set('options', {strokeWeight: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-polyline map strokeWeight=strokeWeight}}
    {{g-map-polyline map options=options}}
  {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.strokeWeight, expected, 'set strokeWeight via property');
    assert.equal(options.strokeWeight, expected, 'set strokeWeight via options');
  });
});

test('it sets visible', function(assert) {
  const expected = false;

  this.set('visible', expected);
  this.set('options', {visible: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-polyline map visible=visible}}
    {{g-map-polyline map options=options}}
  {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getVisible(), expected, 'set visible via property');
    assert.equal(options.getVisible(), expected, 'set visible via options');
  });
});

test('it sets zIndex', function(assert) {
  const expected = 999;

  this.set('zIndex', expected);
  this.set('options', {zIndex: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-polyline map zIndex=zIndex}}
    {{g-map-polyline map options=options}}
  {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.zIndex, expected, 'set zIndex via property');
    assert.equal(options.zIndex, expected, 'set zIndex via options');
  });
});

test('it consumes `options` hash along with top-level values', function(assert) {
  const clickable = false;
  const zIndex = this.set('zIndex', 900);
  this.set('options', {clickable});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-polyline map options=options zIndex=zIndex}}
  {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([polyline]) => {
    assert.equal(polyline.zIndex, zIndex, 'set zIndex via top-level property');
    assert.equal(polyline.clickable, clickable, 'set clickable via options');
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
    {{g-map-polyline map
      click="click"
      dblclick=(action "dblclick")
      drag=(action "drag")
      dragend=(action "dragend")
      dragstart=(action "dragstart")
      mousedown=(action "mousedown")
      mousemove=(action "mousemove")
      mouseover=(action "mouseover")
      mouseup=(action "mouseup")
      rightclick=(action "rightclick")}}
    {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([polyline]) => {

    // Trigger all mouse events on polyline
    mouseEvents.forEach((event) =>
      google.maps.event.trigger(polyline, event, stubMouseEvent));
  });
});

test('it provides expected argument(s) to path update events', function(assert) {
  const stubIndex = 0;

  this.on('insert_at', (index, path) => {
    assert.ok(path, 'insert_at action was called with the path');
    assert.equal(index, stubIndex, 'insert_at action was called with index');
  });

  this.on('remove_at', (index) => {
    assert.equal(index, stubIndex, 'remove_at action was called with index');
  });

  this.on('set_at', (index, path) => {
    assert.ok(path, 'set_at action was called with the path');
    assert.equal(index, stubIndex, 'set_at action was called with index');
  });

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-polyline map
      insert_at=(action "insert_at")
      remove_at=(action "remove_at")
      set_at=(action "set_at")}}
    {{/g-map}}`);

  return getGoogleMapPolylines(this.$('.ember-cli-g-map')).then(([polyline]) => {
    triggerPathUpdateEvent(polyline, 'insert_at', stubIndex);
    triggerPathUpdateEvent(polyline, 'remove_at', stubIndex);
    triggerPathUpdateEvent(polyline, 'set_at', stubIndex);
  });
});

/**
 * @param  {google.maps.polyline} polyline
 * @return {Object}        LatLng literal
 */
function getPathLiteral(polyline) {
  return polyline.getPath().getArray().map((ll) => ll.toJSON());
}

/**
 * @param  {HTMLElement} element   HTML element that Google Map was instantiated on
 * @return {Array}   Google Map polylines array
 */
function getGoogleMapPolylines(element) {
  if (element instanceof $) {
    element = element.get(0);
  }

  return new RSVP.Promise((resolve) => {
    run.later(() => resolve(element.__GOOGLE_MAP_POLYLINES__), 100);
  });
}

/**
 * @param  {google.maps.polyline} polyline
 * @param  {String} eventName    Path update event name
 * @param  {Array} args          Optional event arguments
 */
function triggerPathUpdateEvent(polyline, eventName, ...args) {
  const path = polyline.getPath();
  Ember.run.next(() => google.maps.event.trigger(path, eventName, ...args));
}
