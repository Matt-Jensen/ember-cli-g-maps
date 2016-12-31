import $ from 'jquery';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import {assert} from 'ember-metal/utils';

moduleForComponent('g-map', 'Integration | Component | g map', {
  integration: true
});

test('it sets background color', function(assert) {
  const color = this.set('color', 'rgb(255, 255, 255)');
  this.set('options', {backgroundColor: color});

  this.render(hbs`{{g-map backgroundColor=color}}`);
  assert.equal(this.$('.ember-cli-g-map > *:first').css('background-color'), color, 'set via property');

  this.render(hbs`{{g-map options=options}}`);
  assert.equal(this.$('.ember-cli-g-map > *:first').css('background-color'), color, 'set via options');
});

test('it renders all map centering strategies', function(assert) {
  const lat = this.set('lat', 30.2672);
  const lng = this.set('lng', 97.7431);
  this.set('centerLiteral', {lat, lng});
  this.set('options', {center: {lat, lng}});
  this.set('optionsLatLng', {lat, lng});

  this.render(hbs`{{#g-map lat=lat lng=lng as |map|}}
    <div id="g-map-test-output">{{map.center.lat}},{{map.center.lng}}</div>
  {{/g-map}}`);

  assert.equal(this.$('#g-map-test-output').text().trim().slice(0, 15), `${lat},${lng}`, 'set center via `lat` & `lng` properties');

  this.render(hbs`{{#g-map center=centerLiteral as |map|}}
    <div id="g-map-test-output">{{map.center.lat}},{{map.center.lng}}</div>
  {{/g-map}}`);

  assert.equal(this.$('#g-map-test-output').text().trim().slice(0, 15), `${lat},${lng}`, 'set center via center literal');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.center.lat}},{{map.center.lng}}</div>
  {{/g-map}}`);

  assert.equal(this.$('#g-map-test-output').text().trim().slice(0, 15), `${lat},${lng}`, 'set center via options.center');

  this.render(hbs`{{#g-map options=optionsLatLng as |map|}}
    <div id="g-map-test-output">{{map.center.lat}},{{map.center.lng}}</div>
  {{/g-map}}`);

  assert.equal(this.$('#g-map-test-output').text().trim().slice(0, 15), `${lat},${lng}`, 'set center via options.{lat,lng}');
});

test('it sets clickable icons', function(assert) {
  const clickableIcons = this.set('clickableIcons', false);
  this.set('options', {clickableIcons});

  this.render(hbs`{{#g-map clickableIcons=clickableIcons as |map|}}
    <div id="g-map-test-output">{{if map.clickableIcons 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.clickableIcons 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets disable default UI', function(assert) {
  const disableDefaultUI = this.set('disableDefaultUI', true);
  this.set('options', {disableDefaultUI});

  this.render(hbs`{{#g-map disableDefaultUI=disableDefaultUI as |map|}}
    <div id="g-map-test-output">{{if map.disableDefaultUI 'pass' 'fail'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.disableDefaultUI 'pass' 'fail'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets disable double click zoom', function(assert) {
  const disableDoubleClickZoom = this.set('disableDoubleClickZoom', true);
  this.set('options', {disableDoubleClickZoom});

  this.render(hbs`{{#g-map disableDoubleClickZoom=disableDoubleClickZoom as |map|}}
    <div id="g-map-test-output">{{if map.disableDoubleClickZoom 'pass' 'fail'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.disableDoubleClickZoom 'pass' 'fail'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets draggable', function(assert) {
  const draggable = this.set('draggable', false);
  this.set('options', {draggable});

  this.render(hbs`{{#g-map draggable=draggable as |map|}}
    <div id="g-map-test-output">{{if map.draggable 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.draggable 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets draggable cursor', function(assert) {
  const draggableCursor = this.set('draggableCursor', 'pointer');
  this.set('options', {draggableCursor});

  this.render(hbs`{{#g-map draggableCursor=draggableCursor as |map|}}
    <div id="g-map-test-output">{{map.draggableCursor}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), draggableCursor, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.draggableCursor}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), draggableCursor, 'set via options');
});

test('it sets dragging cursor', function(assert) {
  const draggingCursor = this.set('draggingCursor', 'pointer');
  this.set('options', {draggingCursor});

  this.render(hbs`{{#g-map draggingCursor=draggingCursor as |map|}}
    <div id="g-map-test-output">{{map.draggingCursor}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), draggingCursor, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.draggingCursor}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), draggingCursor, 'set via options');
});

test('it sets fullscreen control', function(assert) {
  const fullscreenControl = this.set('fullscreenControl', false);
  this.set('options', {fullscreenControl});

  this.render(hbs`{{#g-map fullscreenControl=fullscreenControl as |map|}}
    <div id="g-map-test-output">{{if map.fullscreenControl 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.fullscreenControl 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets fullscreen control options', function(assert) {
  const fullscreenControlOptions = this.set('fullscreenControlOptions', 'bottom_right');
  this.set('options', {fullscreenControlOptions});

  this.render(hbs`{{#g-map fullscreenControlOptions=fullscreenControlOptions as |map|}}
    <div id="g-map-test-output">{{map.fullscreenControlOptions}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), fullscreenControlOptions.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.fullscreenControlOptions}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), fullscreenControlOptions.toUpperCase(), 'set via options');
});

test('it sets gesture handling', function(assert) {
  const gestureHandling = this.set('gestureHandling', 'greedy');
  this.set('options', {gestureHandling});

  this.render(hbs`{{#g-map gestureHandling=gestureHandling as |map|}}
    <div id="g-map-test-output">{{map.gestureHandling}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), gestureHandling, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.gestureHandling}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), gestureHandling, 'set via options');
});

test('it sets heading', function(assert) {
  const heading = this.set('heading', 0);
  this.set('options', {heading});

  this.render(hbs`{{#g-map heading=heading as |map|}}
    <div id="g-map-test-output">{{map.heading}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), heading, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.heading}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), heading, 'set via options');
});

test('it sets key board shortcuts', function(assert) {
  const keyboardShortcuts = this.set('keyboardShortcuts', false);
  this.set('options', {keyboardShortcuts});

  this.render(hbs`{{#g-map keyboardShortcuts=keyboardShortcuts as |map|}}
    <div id="g-map-test-output">{{if map.keyboardShortcuts 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.keyboardShortcuts 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets map type control', function(assert) {
  const mapTypeControl = this.set('mapTypeControl', false);
  this.set('options', {mapTypeControl});

  this.render(hbs`{{#g-map mapTypeControl=mapTypeControl as |map|}}
    <div id="g-map-test-output">{{if map.mapTypeControl 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.mapTypeControl 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets map type control options', function(assert) {
  const expected = 'ROADMAP SATELLITE BOTTOM_RIGHT HORIZONTAL_BAR';
  const mapTypeControlOptions = this.set('mapTypeControlOptions', {
    mapTypeIds: ['ROADMAP', 'SATELLITE'],
    position: 'BOTTOM_RIGHT',
    style: 'HORIZONTAL_BAR'
  });
  this.set('options', {mapTypeControlOptions});

  this.render(hbs`{{#g-map mapTypeControlOptions=mapTypeControlOptions as |map|}}
    <div id="g-map-test-output">
      {{#each map.mapTypeControlOptions.mapTypeIds as |type|}}{{type}} {{/each}}{{map.mapTypeControlOptions.position}} {{map.mapTypeControlOptions.style}}
    </div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), expected, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">
      {{#each map.mapTypeControlOptions.mapTypeIds as |type|}}{{type}} {{/each}}{{map.mapTypeControlOptions.position}} {{map.mapTypeControlOptions.style}}
    </div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), expected, 'set via options');
});

test('it sets map type id', function(assert) {
  const mapTypeId = this.set('mapTypeId', 'satellite');
  this.set('options', {mapTypeId});

  this.render(hbs`{{#g-map mapTypeId=mapTypeId as |map|}}
    <div id="g-map-test-output">{{map.mapTypeId}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), mapTypeId.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.mapTypeId}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), mapTypeId.toUpperCase(), 'set via options');
});

test('it sets max zoom', function(assert) {
  const maxZoom = this.set('maxZoom', 4);
  this.set('options', {maxZoom});

  this.render(hbs`{{#g-map maxZoom=maxZoom as |map|}}
    <div id="g-map-test-output">{{map.maxZoom}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), maxZoom, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.maxZoom}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), maxZoom, 'set via options');
});

test('it sets min zoom', function(assert) {
  const minZoom = this.set('minZoom', 4);
  this.set('options', {minZoom});

  this.render(hbs`{{#g-map minZoom=minZoom as |map|}}
    <div id="g-map-test-output">{{map.minZoom}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), minZoom, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.minZoom}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), minZoom, 'set via options');
});

test('it sets no clear', function(assert) {
  const noClear = this.set('noClear', false);
  this.set('options', {noClear});

  this.render(hbs`{{#g-map noClear=noClear as |map|}}
    <div id="g-map-test-output">{{if map.noClear 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.noClear 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets pan control', function(assert) {
  const panControl = this.set('panControl', false);
  this.set('options', {panControl});

  this.render(hbs`{{#g-map panControl=panControl as |map|}}
    <div id="g-map-test-output">{{if map.panControl 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.panControl 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets pan control options', function(assert) {
  const panControlOptions = this.set('panControlOptions', 'bottom_right');
  this.set('options', {panControlOptions});

  this.render(hbs`{{#g-map panControlOptions=panControlOptions as |map|}}
    <div id="g-map-test-output">{{map.panControlOptions}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), panControlOptions.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.panControlOptions}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), panControlOptions.toUpperCase(), 'set via options');
});

test('it sets rotate control', function(assert) {
  const rotateControl = this.set('rotateControl', false);
  this.set('options', {rotateControl});

  this.render(hbs`{{#g-map rotateControl=rotateControl as |map|}}
    <div id="g-map-test-output">{{if map.rotateControl 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.rotateControl 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets rotate control options', function(assert) {
  const rotateControlOptions = this.set('rotateControlOptions', 'bottom_right');
  this.set('options', {rotateControlOptions});

  this.render(hbs`{{#g-map rotateControlOptions=rotateControlOptions as |map|}}
    <div id="g-map-test-output">{{map.rotateControlOptions}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), rotateControlOptions.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.rotateControlOptions}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), rotateControlOptions.toUpperCase(), 'set via options');
});

test('it sets scale control', function(assert) {
  const scaleControl = this.set('scaleControl', false);
  this.set('options', {scaleControl});

  this.render(hbs`{{#g-map scaleControl=scaleControl as |map|}}
    <div id="g-map-test-output">{{if map.scaleControl 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.scaleControl 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets rotate control options', function(assert) {
  const scaleControlOptions = this.set('scaleControlOptions', 'default');
  this.set('options', {scaleControlOptions});

  this.render(hbs`{{#g-map scaleControlOptions=scaleControlOptions as |map|}}
    <div id="g-map-test-output">{{map.scaleControlOptions}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), scaleControlOptions.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.scaleControlOptions}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), scaleControlOptions.toUpperCase(), 'set via options');
});

test('it sets scroll wheel', function(assert) {
  const scrollwheel = this.set('scrollwheel', false);
  this.set('options', {scrollwheel});

  this.render(hbs`{{#g-map scrollwheel=scrollwheel as |map|}}
    <div id="g-map-test-output">{{if map.scrollwheel 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.scrollwheel 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets street view', function(assert) {
  const streetView = this.set('streetView', new google.maps.StreetViewPanorama(document.createElement('div')));
  this.set('options', {streetView});

  this.render(hbs`{{#g-map streetView=streetView as |map|}}
    <div id="g-map-test-output">{{if map.streetView 'pass' 'fail'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.streetView 'pass' 'fail'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets street view control options', function(assert) {
  const streetViewControlOptions = this.set('streetViewControlOptions', 'bottom_right');
  this.set('options', {streetViewControlOptions});

  this.render(hbs`{{#g-map streetViewControlOptions=streetViewControlOptions as |map|}}
    <div id="g-map-test-output">{{map.streetViewControlOptions}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), streetViewControlOptions.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.streetViewControlOptions}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), streetViewControlOptions.toUpperCase(), 'set via options');
});

test('it sets styles', function(assert) {
  const styles = this.set('styles', [{ elementType: 'geometry', stylers: [{color: '#242f3e'}] }]);
  this.set('options', {styles});

  this.render(hbs`{{#g-map styles=styles as |map|}}
    <div id="g-map-test-output">{{if map.styles 'pass' 'fail'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.styles 'pass' 'fail'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets tilt', function(assert) {
  let text;
  const tilt = this.set('tilt', 45);
  this.set('options', {tilt});

  this.render(hbs`{{#g-map tilt=tilt as |map|}}
    <div id="g-map-test-output">{{map.tilt}}</div>
  {{/g-map}}`);
  text = this.$('#g-map-test-output').text().trim();
  assert.ok(text === '0' || text === '45', `set tilt to ${text} via property`);

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.tilt}}</div>
  {{/g-map}}`);
  text = this.$('#g-map-test-output').text().trim();
  assert.ok(text === '0' || text === '45', `set tilt to ${text} via options`);
});

test('it sets zoom', function(assert) {
  const zoom = this.set('zoom', 4);
  this.set('options', {zoom});

  this.render(hbs`{{#g-map zoom=zoom as |map|}}
    <div id="g-map-test-output">{{map.zoom}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), zoom, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.zoom}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), zoom, 'set via options');
});

test('it sets zoom control', function(assert) {
  const zoomControl = this.set('zoomControl', false);
  this.set('options', {zoomControl});

  this.render(hbs`{{#g-map zoomControl=zoomControl as |map|}}
    <div id="g-map-test-output">{{if map.zoomControl 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{if map.zoomControl 'fail' 'pass'}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), 'pass', 'set via options');
});

test('it sets zoom control options', function(assert) {
  const zoomControlOptions = this.set('zoomControlOptions', 'bottom_right');
  this.set('options', {zoomControlOptions});

  this.render(hbs`{{#g-map zoomControlOptions=zoomControlOptions as |map|}}
    <div id="g-map-test-output">{{map.zoomControlOptions}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), zoomControlOptions.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.zoomControlOptions}}</div>
  {{/g-map}}`);
  assert.equal(this.$('#g-map-test-output').text().trim(), zoomControlOptions.toUpperCase(), 'set via options');
});

/*
 * User Actions API
 */

test('it provides the default mouse event argument to all click actions', function(assert) {
  assert.expect(6);
  const stubMouseEvent = {};

  const mouseEvents = [
    'click',
    'dblclick',
    'mousemove',
    'mouseout',
    'mouseover',
    'rightclick'
  ];

  mouseEvents.forEach((event) => {
    this.on(event, (mouseEvent) =>
      assert.equal(mouseEvent, stubMouseEvent, `${event} action was called with mouse event`));
  });

  this.render(hbs`{{g-map click="click" dblclick=(action "dblclick") mousemove=(action "mousemove") mouseout=(action "mouseout") mouseover=(action "mouseover") rightclick=(action "rightclick")}}`);

  mouseEvents.forEach((event) =>
    triggerGoogleMapEvent(this.$('.ember-cli-g-map'), event, stubMouseEvent));
});

test('it provides the relevant map state as change action argument', function(assert) {
  const changeProperties = {
    center_changed: 'center',
    heading_changed: 'heading',
    maptypeid_changed: 'mapTypeId',
    tilt_changed: 'tilt',
    zoom_changed: 'zoom'
  };

  const changeValues = {
    center_changed: {lat: 34, lng: 32},
    heading_changed: 0,
    maptypeid_changed: 'ROADMAP',
    tilt_changed: 0,
    zoom_changed: 10
  };

  // Add map state properties
  Object.keys(changeProperties).forEach((event) =>
    this.set(changeProperties[event], changeValues[event]));

  // Add change event listeners
  Object.keys(changeValues).forEach((event) => {
    if (event !== 'center_changed') {
      this.on(event, (value) =>
        assert.equal(value, changeValues[event], `${event} action was called with map state: ${changeValues[event]}`));
    }
  });

  this.on('center_changed', (value) => {
    const actual = { lat: parseInt(value.lat, 10), lng: parseInt(value.lng, 10) };
    assert.deepEqual(actual, changeValues.center_changed, 'center_changed action was called with map state: `{lat: 34, lng: 32}`');
  });

  this.render(hbs`{{g-map
    center=center
    heading=heading
    mapTypeId=mapTypeId
    tilt=tilt
    zoom=zoom
    center_changed=(action "center_changed")
    heading_changed=(action "heading_changed")
    maptypeid_changed=(action "maptypeid_changed")
    tilt_changed=(action "tilt_changed")
    zoom_changed=(action "zoom_changed")}}`);

  // Trigger all change events on map
  Object.keys(changeValues).forEach((event) =>
    triggerGoogleMapEvent(this.$('.ember-cli-g-map'), event));
});

/**
 * @param  {HTMLElement} element     HTML element that Google Map was instantiated on
 * @param  {String}      eventName   Google Map event name to trigger
 * @param  {any}         args        Options variable arid list of parameters to apply to event
 * Triggers an event on the given map element with any provided arguements
 */
function triggerGoogleMapEvent(element, eventName, ...args) {
  if (element instanceof $) {
    element = element.get(0);
  }

  const map = element.__GOOGLE_MAP__;

  assert('invalid g-map map element', map);
  assert('invalid google map event', eventName);

  google.maps.event.trigger(map, eventName, ...args);
}
