import googleMap from 'ember-cli-g-maps/google-map';
import { isPresent } from 'ember-utils';
import { module, test } from 'qunit';

module('Unit | Factory | Google Map');

test('it returns a Google Map instance as content', function(assert) {
  const map = googleMap(document.createElement('div'));
  assert.ok(map.content instanceof google.maps.Map);
});

test('it set map default options', function(assert) {
  const map = googleMap(document.createElement('div'), {backgroundColor: '#000'});
  assert.ok(isPresent(map.content.minZoom), 'set default min zoom');
  assert.ok(isPresent(map.content.maxZoom), 'set default max zoom');
  assert.ok(isPresent(map.content.clickableIcons), 'set default clickable icons');
  assert.ok(isPresent(map.content.tilt), 'set default tilt');
  assert.ok(isPresent(map.content.backgroundColor), 'set initial background color');
});

test('it returns the center of the Map instance', function(assert) {
  const expected = { lat: 1, lng: 1 };
  const map = googleMap(document.createElement('div'));
  map.content.setCenter(expected);

  const center = map.get('center');
  assert.equal(center.lat, expected.lat, 'resolves correct latitude');
  assert.equal(center.lng, expected.lng, 'resolves correct longitude');
});

test('it allows valid updates of the map center', function(assert) {
  let expected = {lat: 2, lng: 2};
  const map = googleMap(document.createElement('div'));

  assert.throws(() => map.set('center', [-34, 151]), 'only accepts obect');

  map.content.setCenter({ lat: 1, lng: 1 });
  map.set('center', expected);

  assert.equal(map.get('center.lat'), expected.lat, 'updated latitude of map');
  assert.equal(map.get('center.lng'), expected.lat, 'updated longitude of map');

  expected = {lat: 3, lng: 3};
  map.set('center', new google.maps.LatLng(expected.lat, expected.lng));

  assert.equal(map.get('center.lat'), expected.lat, 'updated latitude via LatLng');
  assert.equal(map.get('center.lng'), expected.lng, 'updated longitude via LatLng');

});

test('it returns the minZoom', function(assert) {
  const expected = 2;
  const map = googleMap(document.createElement('div'), {minZoom: expected});
  assert.equal(map.get('minZoom'), expected, 'resolves default min zoom');
});

test('it only allows setting a valid min zoom', function(assert) {
  const map = googleMap(document.createElement('div'), {maxZoom: 5});
  assert.throws(() => map.set('minZoom', 5), 'does not allow min zoom above max zoom');
  assert.equal(map.set('minZoom', 4), map.content.minZoom, 'updated min zoom of map');
});

test('it returns the maxZoom', function(assert) {
  const expected = 5;
  const map = googleMap(document.createElement('div'), {maxZoom: expected});
  assert.equal(map.get('maxZoom'), expected, 'resolves default max zoom');
});

test('it only allows setting a valid max zoom', function(assert) {
  const map = googleMap(document.createElement('div'), {minZoom: 5});
  assert.throws(() => map.set('maxZoom', 5), 'does not allow max zoom below min zoom');
  assert.equal(map.set('maxZoom', 6), map.content.maxZoom, 'updated max zoom of map');
});

test('it returns the zoom level', function(assert) {
  const expected = 5;
  const map = googleMap(document.createElement('div'), {zoom: expected});
  assert.equal(map.get('zoom'), expected, 'resolves correct zoom level');
});

test('it allows setting a valid zoom level', function(assert) {
  const expected = 4;
  const map = googleMap(document.createElement('div'), {minZoom: 1, maxZoom: 10});
  assert.throws(() => map.set('zoom', 0), 'does not set below minimum');
  assert.throws(() => map.set('zoom', 11), 'does not set above maximum');

  map.set('zoom', expected);

  assert.equal(map.content.getZoom(), expected, 'updated zoom of map');
});

test('it returns the map type id', function(assert) {
  const expected = 'HYBRID';
  const map = googleMap(document.createElement('div'), {mapTypeId: expected});
  assert.equal(map.get('mapTypeId'), expected, 'resolves configured map type');
});

test('it allows setting a valid map type id', function(assert) {
  const expected = 'SATELLITE';
  const map = googleMap(document.createElement('div'));

  assert.throws(() => map.set('mapTypeId', 'invalid'), 'only accepts valid map type ids');

  map.set('mapTypeId', expected.toLowerCase());
  assert.equal(map.content.getMapTypeId().toUpperCase(), expected, 'resolves new map type id');
});

test('it returns the map clickableIcons', function(assert) {
  const expected = false;
  const map = googleMap(document.createElement('div'), {clickableIcons: expected});
  assert.equal(map.get('clickableIcons'), expected, 'resolves configured clickableIcons');
});

test('it allows setting a valid clickable icons', function(assert) {
  const expected = false;
  const map = googleMap(document.createElement('div'));

  assert.throws(() => map.set('clickableIcons', 'non-boolean'), 'only accepts boolean value');

  map.set('clickableIcons', expected);
  assert.equal(map.content.getClickableIcons(), expected, 'resolves new clickable icons');
});

test('it returns the map tilt', function(assert) {
  const expected = 0; // NOTE 45 creates an unreliable test condition
  const map = googleMap(document.createElement('div'), {tilt: expected});
  assert.equal(map.get('tilt'), expected, 'resolves configured tilt');
});

test('it only calls `setTilt` with a valid tilt perspective', function(assert) {
  const map = googleMap(document.createElement('div'));
  assert.throws(() => map.set('tilt', 32), 'does not allow invalid tilt values');

  let wasCalled = false;
  map.content.setTilt = () => wasCalled = true;

  map.set('tilt', 45);
  assert.equal(wasCalled, true, 'updated tilt of map');
});

test('it returns the map heading', function(assert) {
  const expected = 0;
  const map = googleMap(document.createElement('div'), {heading: expected});
  assert.equal(map.get('heading'), expected, 'resolves configured heading');
});

test('it only allows setting a valid heading', function(assert) {
  const expected = 0;
  const map = googleMap(document.createElement('div'), {heading: 1});

  assert.throws(() => map.set('heading', 'non-number'), 'only accepts numeric value');

  map.set('heading', expected);
  assert.equal(map.content.getHeading(), expected, 'resolves new heading');
});

test('it returns the map fullscreen control options', function(assert) {
  const expected = 'BOTTOM_RIGHT';
  const map = googleMap(document.createElement('div'), {fullscreenControlOptions: expected});
  assert.equal(map.get('fullscreenControlOptions'), expected, 'resolves configured fullscreenControlOptions');
});

test('it only allows setting valid fullscreen control options', function(assert) {
  const expected = 'LEFT_TOP';
  const map = googleMap(document.createElement('div'), {fullscreenControlOptions: 'BOTTOM_RIGHT'});

  assert.throws(() => map.set('fullscreenControlOptions', 'non-control-position'), 'only accepts a control position');

  map.set('fullscreenControlOptions', expected);
  assert.equal(map.get('fullscreenControlOptions'), expected, 'resolves new fullscreenControlOptions');
});

test('it returns the map type control options', function(assert) {
  const expected = {
    mapTypeIds: ['ROADMAP', 'SATELLITE'],
    position: 'TOP_LEFT',
    style: 'HORIZONTAL_BAR'
  };
  const map = googleMap(document.createElement('div'), {mapTypeControlOptions: expected});
  assert.deepEqual(map.get('mapTypeControlOptions'), expected, 'resolves configured mapTypeControlOptions');
});

test('it only allows setting valid map type control options', function(assert) {
  const expected = {
    mapTypeIds: ['ROADMAP', 'SATELLITE'],
    position: 'TOP_LEFT',
    style: 'HORIZONTAL_BAR'
  };
  const map = googleMap(document.createElement('div'));

  assert.throws(() => map.set('mapTypeControlOptions', 'non-type-control'), 'only accepts a configuration object');

  map.set('mapTypeControlOptions', expected);
  assert.ok(Boolean(map.content.mapTypeControlOptions), 'updates map instance type control options');
  assert.deepEqual(map.get('mapTypeControlOptions'), expected, 'resolves new mapTypeControlOptions');
});

test('it returns the pan control options', function(assert) {
  const expected = 'BOTTOM_RIGHT';
  const map = googleMap(document.createElement('div'), {panControlOptions: expected});
  assert.equal(map.get('panControlOptions'), expected, 'resolves configured panControlOptions');
});

test('it only allows setting valid pan control options', function(assert) {
  const expected = 'LEFT_TOP';
  const map = googleMap(document.createElement('div'), {panControlOptions: 'BOTTOM_RIGHT'});

  assert.throws(() => map.set('panControlOptions', 'non-control-position'), 'only accepts a control position');

  map.set('panControlOptions', expected);
  assert.equal(map.get('panControlOptions'), expected, 'resolves new panControlOptions');
})

test('it returns the static map properties', function(assert) {
  const expected = {
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    draggable: false,
    draggableCursor: 'pointer',
    fullscreenControl: false,
    gestureHandling: 'greedy',
    keyboardShortcuts: false,
    mapTypeControl: false,
    noClear: false,
    panControl: false,
    rotateControl: false,
    scaleControl: false,
    scrollwheel: false,
    signInControl: false,
    streetViewControl: false,
    zoomControl: false,
    styles: [{
      elementType: 'geometry', stylers: [{color: '#242f3e'}]
    }]
  };

  const map = googleMap(document.createElement('div'), expected);

  assert.equal(map.get('disableDefaultUI'), expected.disableDefaultUI, 'resolves configured disableDefaultUI');
  assert.equal(map.get('disableDoubleClickZoom'), expected.disableDoubleClickZoom, 'resolves configured disableDoubleClickZoom');
  assert.equal(map.get('draggable'), expected.draggable, 'resolves configured draggable');
  assert.equal(map.get('draggableCursor'), expected.draggableCursor, 'resolves configured draggableCursor');
  assert.equal(map.get('fullscreenControl'), expected.fullscreenControl, 'resolves configured fullscreenControl');
  assert.equal(map.get('gestureHandling'), expected.gestureHandling, 'resolves configured gestureHandling');
  assert.equal(map.get('keyboardShortcuts'), expected.keyboardShortcuts, 'resolves configured keyboardShortcuts');
  assert.equal(map.get('mapTypeControl'), expected.mapTypeControl, 'resolves configured mapTypeControl');
  assert.equal(map.get('noClear'), expected.noClear, 'resolves configured noClear');
  assert.equal(map.get('panControl'), expected.panControl, 'resolves configured panControl');
  assert.equal(map.get('rotateControl'), expected.rotateControl, 'resolves configured rotateControl');
  assert.equal(map.get('scaleControl'), expected.scaleControl, 'resolves configured scaleControl');
  assert.equal(map.get('scrollwheel'), expected.scrollwheel, 'resolves configured scrollwheel');
  assert.equal(map.get('signInControl'), expected.signInControl, 'resolves configured signInControl');
  assert.equal(map.get('streetViewControl'), expected.streetViewControl, 'resolves configured streetViewControl');
  assert.equal(map.get('zoomControl'), expected.zoomControl, 'resolves configured zoomControl');
  assert.equal(map.get('styles'), expected.styles, 'resolves configured styles');
});

test('it only allows setting valid static map properties', function(assert) {
  const expected = {
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    draggable: false,
    draggableCursor: 'pointer',
    fullscreenControl: false,
    gestureHandling: 'greedy',
    keyboardShortcuts: false,
    mapTypeControl: false,
    noClear: false,
    panControl: false,
    rotateControl: false,
    scaleControl: false,
    scrollwheel: false,
    signInControl: false,
    streetViewControl: false,
    zoomControl: false,
    styles: [{
      elementType: 'geometry', stylers: [{color: '#242f3e'}]
    }]
  };

  const map = googleMap(document.createElement('div'));

  assert.throws(() => map.set('disableDefaultUI', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('disableDoubleClickZoom', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('draggable', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('draggableCursor', 4), 'only accepts string value');
  assert.throws(() => map.set('fullscreenControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('gestureHandling', 4), 'only accepts string value');
  assert.throws(() => map.set('keyboardShortcuts', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('mapTypeControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('noClear', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('panControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('rotateControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('scaleControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('scrollwheel', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('signInControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('streetViewControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('zoomControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('styles', 'non-array'), 'only accepts array value');

  map.setProperties(expected);

  assert.equal(map.get('disableDefaultUI'), expected.disableDefaultUI, 'resolves new disableDefaultUI');
  assert.equal(map.get('disableDoubleClickZoom'), expected.disableDoubleClickZoom, 'resolves new disableDoubleClickZoom');
  assert.equal(map.get('draggable'), expected.draggable, 'resolves new draggable');
  assert.equal(map.get('draggableCursor'), expected.draggableCursor, 'resolves new draggableCursor');
  assert.equal(map.get('fullscreenControl'), expected.fullscreenControl, 'resolves new fullscreenControl');
  assert.equal(map.get('gestureHandling'), expected.gestureHandling, 'resolves new gestureHandling');
  assert.equal(map.get('keyboardShortcuts'), expected.keyboardShortcuts, 'resolves new keyboardShortcuts');
  assert.equal(map.get('mapTypeControl'), expected.mapTypeControl, 'resolves new mapTypeControl');
  assert.equal(map.get('noClear'), expected.noClear, 'resolves new noClear');
  assert.equal(map.get('panControl'), expected.panControl, 'resolves new panControl');
  assert.equal(map.get('rotateControl'), expected.rotateControl, 'resolves new rotateControl');
  assert.equal(map.get('scaleControl'), expected.scaleControl, 'resolves new scaleControl');
  assert.equal(map.get('scrollwheel'), expected.scrollwheel, 'resolves new scrollwheel');
  assert.equal(map.get('signInControl'), expected.signInControl, 'resolves new signInControl');
  assert.equal(map.get('streetViewControl'), expected.streetViewControl, 'resolves new streetViewControl');
  assert.equal(map.get('zoomControl'), expected.zoomControl, 'resolves new zoomControl');
  assert.equal(map.get('styles'), expected.styles, 'resolves new styles');
});
