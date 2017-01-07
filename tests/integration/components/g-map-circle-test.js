import RSVP from 'rsvp';
import $ from 'jquery';
import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

moduleForComponent('g-map-circle', 'Integration | Component | g map circle', {
  integration: true
});

test('it renders circle on a g-map instance', function(assert) {
  this.render(hbs`{{#g-map as |map|}}{{g-map-circle map}}{{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then((circles) => {
    assert.equal(circles.length, 1, 'rendered a single g-map-circle on g-map instance');
  });
});

test('it renders circle in center of map if a position is not given', function(assert) {
  const expected = this.set('center', {lat: 34, lng: 32});

  this.render(hbs`{{#g-map center=center as |map|}}{{g-map-circle map}}{{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([circle]) => {
    const actual = getCircleLatLng(circle);
    assert.deepEqual(actual, expected, 'rendered circle in center of g-map instance');
  });
});

test('it renders all circle centering strategies', function(assert) {
  const lat = this.set('lat', 34);
  const lng = this.set('lng', 32);
  const expected = this.set('center', {lat, lng});
  this.set('options', {center: {lat, lng}});
  this.set('optionsLatLng', {lat, lng});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map lat=lat lng=lng}}
    {{g-map-circle map center=center}}
    {{g-map-circle map options=options}}
    {{g-map-circle map options=optionsLatLng}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([latLng, position, options, optionsLatLng]) => {
    const actualLatLng = getCircleLatLng(latLng);
    assert.equal(actualLatLng.lat, lat, 'rendered circle at top-level lat');
    assert.equal(actualLatLng.lng, lng, 'rendered circle at top-level lng');

    const actualPosition = getCircleLatLng(position);
    assert.deepEqual(actualPosition, expected, 'rendered circle at top-level position');

    const actualOptions = getCircleLatLng(options);
    assert.deepEqual(actualOptions, expected, 'rendered circle at options.position');

    const actualOptionsLatLng = getCircleLatLng(optionsLatLng);
    assert.deepEqual(actualOptionsLatLng, expected, 'rendered circle at options.{lat,lng}');
  });
});

test('it sets clickable', function(assert) {
  const expected = false;

  this.set('clickable', expected);
  this.set('options', {clickable: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map clickable=clickable}}
    {{g-map-circle map options=options}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.clickable, expected, 'set clickable via property');
    assert.equal(options.clickable, expected, 'set clickable via options');
  });
});

test('it sets draggable', function(assert) {
  const expected = true;

  this.set('draggable', expected);
  this.set('options', {draggable: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map draggable=draggable}}
    {{g-map-circle map options=options}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getDraggable(), expected, 'set draggable via property');
    assert.equal(options.getDraggable(), expected, 'set draggable via options');
  });
});

test('it sets editable', function(assert) {
  const expected = true;

  this.set('editable', expected);
  this.set('options', {editable: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map editable=editable}}
    {{g-map-circle map options=options}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getEditable(), expected, 'set editable via property');
    assert.equal(options.getEditable(), expected, 'set editable via options');
  });
});

test('it sets fillColor', function(assert) {
  const expected = '#000000';

  this.set('fillColor', expected);
  this.set('options', {fillColor: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map fillColor=fillColor}}
    {{g-map-circle map options=options}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.fillColor, expected, 'set fillColor via property');
    assert.equal(options.fillColor, expected, 'set fillColor via options');
  });
});

test('it sets fillOpacity', function(assert) {
  const expected = 0.85;

  this.set('fillOpacity', expected);
  this.set('options', {fillOpacity: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map fillOpacity=fillOpacity}}
    {{g-map-circle map options=options}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.fillOpacity, expected, 'set fillOpacity via property');
    assert.equal(options.fillOpacity, expected, 'set fillOpacity via options');
  });
});

test('it sets radius', function(assert) {
  const expected = 5000;

  this.set('radius', expected);
  this.set('options', {radius: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map radius=radius}}
    {{g-map-circle map options=options}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getRadius(), expected, 'set radius via property');
    assert.equal(options.getRadius(), expected, 'set radius via options');
  });
});

test('it sets strokeColor', function(assert) {
  const expected = '#000000';

  this.set('strokeColor', expected);
  this.set('options', {strokeColor: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map strokeColor=strokeColor}}
    {{g-map-circle map options=options}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.strokeColor, expected, 'set strokeColor via property');
    assert.equal(options.strokeColor, expected, 'set strokeColor via options');
  });
});

test('it sets strokeOpacity', function(assert) {
  const expected = 0.85;

  this.set('strokeOpacity', expected);
  this.set('options', {strokeOpacity: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map strokeOpacity=strokeOpacity}}
    {{g-map-circle map options=options}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
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
    {{g-map-circle map strokePosition=strokePositionName}}
    {{g-map-circle map options=options}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.strokePosition, expected, 'set strokePosition via property');
    assert.equal(options.strokePosition, expected, 'set strokePosition via options');
  });
});

test('it sets strokeWeight', function(assert) {
  const expected = 10;

  this.set('strokeWeight', expected);
  this.set('options', {strokeWeight: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map strokeWeight=strokeWeight}}
    {{g-map-circle map options=options}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.strokeWeight, expected, 'set strokeWeight via property');
    assert.equal(options.strokeWeight, expected, 'set strokeWeight via options');
  });
});

test('it sets visible', function(assert) {
  const expected = false;

  this.set('visible', expected);
  this.set('options', {visible: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map visible=visible}}
    {{g-map-circle map options=options}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getVisible(), expected, 'set visible via property');
    assert.equal(options.getVisible(), expected, 'set visible via options');
  });
});

test('it sets zIndex', function(assert) {
  const expected = 999;

  this.set('zIndex', expected);
  this.set('options', {zIndex: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map zIndex=zIndex}}
    {{g-map-circle map options=options}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.zIndex, expected, 'set zIndex via property');
    assert.equal(options.zIndex, expected, 'set zIndex via options');
  });
});

test('it consumes `options` hash along with top-level values', function(assert) {
  const radius = 5000;
  const zIndex = this.set('zIndex', 900);
  this.set('options', {radius});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map options=options zIndex=zIndex}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([circle]) => {
    assert.equal(circle.zIndex, zIndex, 'set zIndex via top-level property');
    assert.equal(circle.getRadius(), radius, 'set label via options');
  });
});

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
    {{g-map-circle map
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

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([circle]) => {

    // Trigger all mouse events on circle
    mouseEvents.forEach((event) =>
      google.maps.event.trigger(circle, event, stubMouseEvent));
  });
});

test('it provides the relevant map state as change action arguments', function(assert) {
  const changeProperties = {
    center_changed: 'center',
    radius_changed: 'radius'
  };

  const changeValues = {
    center_changed: {lat: 34, lng: 32},
    radius_changed: 1000
  };

  // Add circle state properties
  this.set('options', {});
  Object.keys(changeProperties).forEach((event) =>
    this.set(`options.${changeProperties[event]}`, changeValues[event]));

  // Add change event listeners
  Object.keys(changeValues).forEach((event) => {
    if (event !== 'center_changed') {
      this.on(event, (value) =>
        assert.equal(value, changeValues[event], `${event} action was called with map state: ${changeValues[event]}`));
    } else {
      this.on('center_changed', (value) => {
        const actual = {lat: parseInt(value.lat, 10), lng: parseInt(value.lng, 10)};
        assert.deepEqual(actual, changeValues.center_changed, 'center_changed action was called with circle state: `{lat: 34, lng: 32}`');
      });
    }
  });

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-circle map
      options=options
      center_changed=(action "center_changed")
      radius_changed=(action "radius_changed")}}
  {{/g-map}}`);

  return getGoogleMapCircles(this.$('.ember-cli-g-map')).then(([circle]) => {

    // Trigger all change events on circle
    Object.keys(changeValues).forEach((event) =>
      google.maps.event.trigger(circle, event));
  });
});

/**
 * @param  {google.maps.circle} circle
 * @return {Object}        LatLng literal
 */
function getCircleLatLng(circle) {
  const center = circle.getCenter();
  return {lat: parseInt(center.lat(), 10), lng: parseInt(center.lng(), 10)};
}

/**
 * @param  {HTMLElement} element   HTML element that Google Map was instantiated on
 * @return {Array}   Google Map Circles array
 */
function getGoogleMapCircles(element) {
  if (element instanceof $) {
    element = element.get(0);
  }

  return new RSVP.Promise((resolve) => {
    run.later(() => resolve(element.__GOOGLE_MAP_CIRCLES__), 100);
  });
}
