import RSVP from 'rsvp';
import $ from 'jquery';
import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

import {markerIcon, markerSymbol} from 'ember-cli-g-maps/components/g-map-marker/factory';

moduleForComponent('g-map-marker', 'Integration | Component | g map marker', {
  integration: true
});

const ICON_URL = 'beachflag.png';

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
  const expected = {x: 0, y: -40};
  this.set('anchorPoint', expected);
  this.set('options', {anchorPoint: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map anchorPoint=anchorPoint}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.anchorPoint.x, expected.x, 'set anchor point `x` via property');
    assert.equal(topLevel.anchorPoint.y, expected.y, 'set anchor point `y` via property');
    assert.equal(options.anchorPoint.x, expected.x, 'set anchor point `x` via options');
    assert.equal(options.anchorPoint.y, expected.y, 'set anchor point `y` via options');
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

test('it sets clickable', function(assert) {
  const expected = false;

  this.set('clickable', expected);
  this.set('options', {clickable: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map clickable=clickable}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getClickable(), expected, 'set clickable via property');
    assert.equal(options.getClickable(), expected, 'set clickable via options');
  });
});

test('it sets crossOnDrag', function(assert) {
  const expected = false;

  this.set('crossOnDrag', expected);
  this.set('options', {crossOnDrag: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map crossOnDrag=crossOnDrag}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.crossOnDrag, expected, 'set crossOnDrag via property');
    assert.equal(options.crossOnDrag, expected, 'set crossOnDrag via options');
  });
});

test('it sets cursor', function(assert) {
  const expected = 'pointer';

  this.set('cursor', expected);
  this.set('options', {cursor: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map cursor=cursor}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getCursor(), expected, 'set cursor via property');
    assert.equal(options.getCursor(), expected, 'set cursor via options');
  });
});

test('it sets draggable', function(assert) {
  const expected = true;

  this.set('draggable', expected);
  this.set('options', {draggable: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map draggable=draggable}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getDraggable(), expected, 'set draggable via property');
    assert.equal(options.getDraggable(), expected, 'set draggable via options');
  });
});

test('it sets all icon strategies', function(assert) {
  const iconUrl = this.set('iconUrl', ICON_URL);

  const markerIcon = this.set('markerIcon', {
    anchor: {x: 1, y: 1},
    labelOrigin: {x: 1, y: 1},
    origin: {x: 1, y: 1},
    scaledSize: {width: 9, height: 9, widthUnit: 'px'},
    size: {width: 9, height: 9, heightUnit: 'em'},
    url: ICON_URL
  });

  const markerSymbol= this.set('markerSymbol', {
    anchor: {x: 1, y: 1},
    fillColor: '#000000',
    fillOpacity: 1,
    labelOrigin: {x: 1, y: 1},
    path: 'CIRCLE',
    rotation: 90,
    scale: 2,
    strokeColor: '#000000',
    strokeOpacity: 0.5,
    strokeWeight: 3
  });

  this.set('options', {icon: iconUrl});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map icon=iconUrl}}
    {{g-map-marker map icon=markerIcon}}
    {{g-map-marker map icon=markerSymbol}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map'))
  .then(([topLevelStr, topLevelIcon, topLevelSymbol, options]) => {
    assert.equal(topLevelStr.getIcon(), iconUrl, 'rendered marker icon with URL string');
    assert.deepEqual(markerIconToJSON(topLevelIcon.getIcon()), markerIcon, 'rendered marker icon with Icon literal');
    assert.deepEqual(markerSymbolToJSON(topLevelSymbol.getIcon()), markerSymbol, 'rendered marker icon with Symbol literal');
    assert.equal(options.getIcon(), iconUrl, 'rendered marker icon at options.icon');
  });
});

test('it sets all label strategies', function(assert) {
  const expected = this.set('label', 'test');

  const markerLabel = this.set('markerLabel', {
    color: 'rgb(113, 9, 9)',
    fontFamily: 'monospace',
    fontSize: '18px',
    fontWeight: 'bold',
    text: expected
  });

  this.set('options', {label: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map label=label}}
    {{g-map-marker map label=markerLabel}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map'))
  .then(([topLevelStr, topLevelmarkerLabel, options]) => {
    assert.equal(topLevelStr.getLabel(), expected, 'rendered label with string');
    assert.deepEqual(topLevelmarkerLabel.getLabel(), markerLabel, 'rendered label with maker label');
    assert.equal(options.getLabel(), expected, 'rendered label at options.label');
  });
});

test('it sets opacity', function(assert) {
  const expected = 0.85;

  this.set('opacity', expected);
  this.set('options', {opacity: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map opacity=opacity}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getOpacity(), expected, 'set opacity via property');
    assert.equal(options.getOpacity(), expected, 'set opacity via options');
  });
});

test('it sets optimized', function(assert) {
  const expected = false;

  this.set('optimized', expected);
  this.set('options', {optimized: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map optimized=optimized}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.optimized, expected, 'set optimized via property');
    assert.equal(options.optimized, expected, 'set optimized via options');
  });
});

test('it sets shape as a circle, poly, or rect', function(assert) {
  const circleShape = this.set('circle', {
    coords: [10, 10, 100],
    type: 'circle'
  });

  const polyShape = this.set('poly', {
    coords: [10, 10, 1, 1],
    type: 'poly'
  });

  const rectShape = this.set('rect', {
    coords: [1, 1, 10, 10],
    type: 'rect'
  });

  this.set('options', {shape: circleShape});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map shape=circle}}
    {{g-map-marker map shape=poly}}
    {{g-map-marker map shape=rect}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([circle, poly, rect, options]) => {
    assert.deepEqual(circle.getShape(), circleShape, 'set valid circle shape');
    assert.deepEqual(poly.getShape(), polyShape, 'set valid poly shape');
    assert.deepEqual(rect.getShape(), rectShape, 'set valid rect shape');
    assert.deepEqual(options.getShape(), circleShape, 'set shape via options');
  });
});

test('it sets title', function(assert) {
  const expected = 'test';

  this.set('title', expected);
  this.set('options', {title: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map title=title}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getTitle(), expected, 'set title via property');
    assert.equal(options.getTitle(), expected, 'set title via options');
  });
});

test('it sets visible', function(assert) {
  const expected = false;

  this.set('visible', expected);
  this.set('options', {visible: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map visible=visible}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getVisible(), expected, 'set visible via property');
    assert.equal(options.getVisible(), expected, 'set visible via options');
  });
});

test('it sets zIndex', function(assert) {
  const expected = 999;

  this.set('zIndex', expected);
  this.set('options', {zIndex: expected});

  this.render(hbs`{{#g-map as |map|}}
    {{g-map-marker map zIndex=zIndex}}
    {{g-map-marker map options=options}}
  {{/g-map}}`);

  return getGoogleMapMarkers(this.$('.ember-cli-g-map')).then(([topLevel, options]) => {
    assert.equal(topLevel.getZIndex(), expected, 'set zIndex via property');
    assert.equal(options.getZIndex(), expected, 'set zIndex via options');
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
    icon_changed: ICON_URL,
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

/**
 * @param  {Object} data
 * @return {Object}
 * Convert raw Google Maps Marker Icon to JSON config
 */
function markerIconToJSON(data) {
  return markerIcon({url: ICON_URL}).toJSON.call(data);
}

/**
 * @param  {Object} data
 * @return {Object}
 * Convert raw Google Maps Marker Symbol to JSON config
 */
function markerSymbolToJSON(data) {
  return markerSymbol({path: 'CIRCLE'}).toJSON.call(data);
}
