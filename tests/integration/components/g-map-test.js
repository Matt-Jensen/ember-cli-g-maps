import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

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
  this.set('centerLatLng', new google.maps.LatLng(lat, lng));
  this.set('options', {center: {lat, lng}});

  this.render(hbs`{{#g-map lat=lat lng=lng as |map|}}
    <div id="g-map-test-output">{{map.center.lat}},{{map.center.lng}}</div>
  {{/g-map}}`);

  assert.equal(this.$('#g-map-test-output').text().trim(), `${lat},${lng}`, 'set center via `lat` & `lng` properties');

  this.render(hbs`{{#g-map center=centerLiteral as |map|}}
    <div id="g-map-test-output">{{map.center.lat}},{{map.center.lng}}</div>
  {{/g-map}}`);

  assert.equal(this.$('#g-map-test-output').text().trim(), `${lat},${lng}`, 'set center via center literal');

  this.render(hbs`{{#g-map center=centerLatLng as |map|}}
    <div id="g-map-test-output">{{map.center.lat}},{{map.center.lng}}</div>
  {{/g-map}}`);

  assert.equal(this.$('#g-map-test-output').text().trim().slice(0, 15), `${lat},${lng}`, 'set center via LatLng instance');

  this.render(hbs`{{#g-map options=options as |map|}}
    <div id="g-map-test-output">{{map.center.lat}},{{map.center.lng}}</div>
  {{/g-map}}`);

  assert.equal(this.$('#g-map-test-output').text().trim(), `${lat},${lng}`, 'set center via options');
});

test('it sets clickable icons', function(assert) {
  const clickableIcons = this.set('clickableIcons', false);
  this.set('options', {clickableIcons});

  this.render(hbs`{{#g-map clickableIcons=clickableIcons as |map|}}
    {{if map.clickableIcons 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.clickableIcons 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets disable default UI', function(assert) {
  const disableDefaultUI = this.set('disableDefaultUI', true);
  this.set('options', {disableDefaultUI});

  this.render(hbs`{{#g-map disableDefaultUI=disableDefaultUI as |map|}}
    {{if map.disableDefaultUI 'pass' 'fail'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.disableDefaultUI 'pass' 'fail'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets disable double click zoom', function(assert) {
  const disableDoubleClickZoom = this.set('disableDoubleClickZoom', true);
  this.set('options', {disableDoubleClickZoom});

  this.render(hbs`{{#g-map disableDoubleClickZoom=disableDoubleClickZoom as |map|}}
    {{if map.disableDoubleClickZoom 'pass' 'fail'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.disableDoubleClickZoom 'pass' 'fail'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets draggable', function(assert) {
  const draggable = this.set('draggable', false);
  this.set('options', {draggable});

  this.render(hbs`{{#g-map draggable=draggable as |map|}}
    {{if map.draggable 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.draggable 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets draggable cursor', function(assert) {
  const draggableCursor = this.set('draggableCursor', 'pointer');
  this.set('options', {draggableCursor});

  this.render(hbs`{{#g-map draggableCursor=draggableCursor as |map|}}
    {{map.draggableCursor}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), draggableCursor, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.draggableCursor}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), draggableCursor, 'set via options');
});

test('it sets dragging cursor', function(assert) {
  const draggingCursor = this.set('draggingCursor', 'pointer');
  this.set('options', {draggingCursor});

  this.render(hbs`{{#g-map draggingCursor=draggingCursor as |map|}}
    {{map.draggingCursor}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), draggingCursor, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.draggingCursor}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), draggingCursor, 'set via options');
});

test('it sets fullscreen control', function(assert) {
  const fullscreenControl = this.set('fullscreenControl', false);
  this.set('options', {fullscreenControl});

  this.render(hbs`{{#g-map fullscreenControl=fullscreenControl as |map|}}
    {{if map.fullscreenControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.fullscreenControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets fullscreen control options', function(assert) {
  const fullscreenControlOptions = this.set('fullscreenControlOptions', 'bottom_right');
  this.set('options', {fullscreenControlOptions});

  this.render(hbs`{{#g-map fullscreenControlOptions=fullscreenControlOptions as |map|}}
    {{map.fullscreenControlOptions}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), fullscreenControlOptions.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.fullscreenControlOptions}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), fullscreenControlOptions.toUpperCase(), 'set via options');
});

test('it sets gesture handling', function(assert) {
  const gestureHandling = this.set('gestureHandling', 'greedy');
  this.set('options', {gestureHandling});

  this.render(hbs`{{#g-map gestureHandling=gestureHandling as |map|}}
    {{map.gestureHandling}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), gestureHandling, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.gestureHandling}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), gestureHandling, 'set via options');
});

test('it sets heading', function(assert) {
  const heading = this.set('heading', 0);
  this.set('options', {heading});

  this.render(hbs`{{#g-map heading=heading as |map|}}
    {{map.heading}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), heading, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.heading}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), heading, 'set via options');
});

test('it sets key board shortcuts', function(assert) {
  const keyboardShortcuts = this.set('keyboardShortcuts', false);
  this.set('options', {keyboardShortcuts});

  this.render(hbs`{{#g-map keyboardShortcuts=keyboardShortcuts as |map|}}
    {{if map.keyboardShortcuts 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.keyboardShortcuts 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets map type control', function(assert) {
  const mapTypeControl = this.set('mapTypeControl', false);
  this.set('options', {mapTypeControl});

  this.render(hbs`{{#g-map mapTypeControl=mapTypeControl as |map|}}
    {{if map.mapTypeControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.mapTypeControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
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
    {{#each map.mapTypeControlOptions.mapTypeIds as |type|}}{{type}} {{/each}}{{map.mapTypeControlOptions.position}} {{map.mapTypeControlOptions.style}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), expected, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{#each map.mapTypeControlOptions.mapTypeIds as |type|}}{{type}} {{/each}}{{map.mapTypeControlOptions.position}} {{map.mapTypeControlOptions.style}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), expected, 'set via options');
});

test('it sets map type id', function(assert) {
  const mapTypeId = this.set('mapTypeId', 'satellite');
  this.set('options', {mapTypeId});

  this.render(hbs`{{#g-map mapTypeId=mapTypeId as |map|}}
    {{map.mapTypeId}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), mapTypeId.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.mapTypeId}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), mapTypeId.toUpperCase(), 'set via options');
});

test('it sets max zoom', function(assert) {
  const maxZoom = this.set('maxZoom', 4);
  this.set('options', {maxZoom});

  this.render(hbs`{{#g-map maxZoom=maxZoom as |map|}}
    {{map.maxZoom}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), maxZoom, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.maxZoom}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), maxZoom, 'set via options');
});

test('it sets min zoom', function(assert) {
  const minZoom = this.set('minZoom', 4);
  this.set('options', {minZoom});

  this.render(hbs`{{#g-map minZoom=minZoom as |map|}}
    {{map.minZoom}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), minZoom, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.minZoom}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), minZoom, 'set via options');
});

test('it sets no clear', function(assert) {
  const noClear = this.set('noClear', false);
  this.set('options', {noClear});

  this.render(hbs`{{#g-map noClear=noClear as |map|}}
    {{if map.noClear 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.noClear 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets pan control', function(assert) {
  const panControl = this.set('panControl', false);
  this.set('options', {panControl});

  this.render(hbs`{{#g-map panControl=panControl as |map|}}
    {{if map.panControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.panControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets pan control options', function(assert) {
  const panControlOptions = this.set('panControlOptions', 'bottom_right');
  this.set('options', {panControlOptions});

  this.render(hbs`{{#g-map panControlOptions=panControlOptions as |map|}}
    {{map.panControlOptions}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), panControlOptions.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.panControlOptions}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), panControlOptions.toUpperCase(), 'set via options');
});

test('it sets rotate control', function(assert) {
  const rotateControl = this.set('rotateControl', false);
  this.set('options', {rotateControl});

  this.render(hbs`{{#g-map rotateControl=rotateControl as |map|}}
    {{if map.rotateControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.rotateControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets rotate control options', function(assert) {
  const rotateControlOptions = this.set('rotateControlOptions', 'bottom_right');
  this.set('options', {rotateControlOptions});

  this.render(hbs`{{#g-map rotateControlOptions=rotateControlOptions as |map|}}
    {{map.rotateControlOptions}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), rotateControlOptions.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.rotateControlOptions}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), rotateControlOptions.toUpperCase(), 'set via options');
});

test('it sets scale control', function(assert) {
  const scaleControl = this.set('scaleControl', false);
  this.set('options', {scaleControl});

  this.render(hbs`{{#g-map scaleControl=scaleControl as |map|}}
    {{if map.scaleControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.scaleControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets rotate control options', function(assert) {
  const scaleControlOptions = this.set('scaleControlOptions', 'default');
  this.set('options', {scaleControlOptions});

  this.render(hbs`{{#g-map scaleControlOptions=scaleControlOptions as |map|}}
    {{map.scaleControlOptions}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), scaleControlOptions.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.scaleControlOptions}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), scaleControlOptions.toUpperCase(), 'set via options');
});

test('it sets scroll wheel', function(assert) {
  const scrollwheel = this.set('scrollwheel', false);
  this.set('options', {scrollwheel});

  this.render(hbs`{{#g-map scrollwheel=scrollwheel as |map|}}
    {{if map.scrollwheel 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.scrollwheel 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets sign in control', function(assert) {
  const signInControl = this.set('signInControl', false);
  this.set('options', {signInControl});

  this.render(hbs`{{#g-map signInControl=signInControl as |map|}}
    {{if map.signInControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.signInControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets street view', function(assert) {
  const streetView = this.set('streetView', new google.maps.StreetViewPanorama(document.createElement('div')));
  this.set('options', {streetView});

  this.render(hbs`{{#g-map streetView=streetView as |map|}}
    {{if map.streetView 'pass' 'fail'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.streetView 'pass' 'fail'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets street view control options', function(assert) {
  const streetViewControlOptions = this.set('streetViewControlOptions', 'bottom_right');
  this.set('options', {streetViewControlOptions});

  this.render(hbs`{{#g-map streetViewControlOptions=streetViewControlOptions as |map|}}
    {{map.streetViewControlOptions}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), streetViewControlOptions.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.streetViewControlOptions}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), streetViewControlOptions.toUpperCase(), 'set via options');
});

test('it sets styles', function(assert) {
  const styles = this.set('styles', [{ elementType: 'geometry', stylers: [{color: '#242f3e'}] }]);
  this.set('options', {styles});

  this.render(hbs`{{#g-map styles=styles as |map|}}
    {{if map.styles 'pass' 'fail'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.styles 'pass' 'fail'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets tilt', function(assert) {
  let text;
  const tilt = this.set('tilt', 45);
  this.set('options', {tilt});

  this.render(hbs`{{#g-map tilt=tilt as |map|}}
    {{map.tilt}}
  {{/g-map}}`);
  text = this.$().text().trim();
  assert.ok(text === '0' || text === '45', `set tilt to ${text} via property`);

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.tilt}}
  {{/g-map}}`);
  text = this.$().text().trim();
  assert.ok(text === '0' || text === '45', `set tilt to ${text} via options`);
});

test('it sets zoom', function(assert) {
  const zoom = this.set('zoom', 4);
  this.set('options', {zoom});

  this.render(hbs`{{#g-map zoom=zoom as |map|}}
    {{map.zoom}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), zoom, 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.zoom}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), zoom, 'set via options');
});

test('it sets zoom control', function(assert) {
  const zoomControl = this.set('zoomControl', false);
  this.set('options', {zoomControl});

  this.render(hbs`{{#g-map zoomControl=zoomControl as |map|}}
    {{if map.zoomControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{if map.zoomControl 'fail' 'pass'}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), 'pass', 'set via options');
});

test('it sets zoom control options', function(assert) {
  const zoomControlOptions = this.set('zoomControlOptions', 'bottom_right');
  this.set('options', {zoomControlOptions});

  this.render(hbs`{{#g-map zoomControlOptions=zoomControlOptions as |map|}}
    {{map.zoomControlOptions}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), zoomControlOptions.toUpperCase(), 'set via property');

  this.render(hbs`{{#g-map options=options as |map|}}
    {{map.zoomControlOptions}}
  {{/g-map}}`);
  assert.equal(this.$().text().trim(), zoomControlOptions.toUpperCase(), 'set via options');
});
