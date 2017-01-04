import googleMap from 'ember-cli-g-maps/components/g-map/factory';
import {module, test} from 'qunit';
import {assign} from 'ember-platform';
import {isPresent} from 'ember-utils';

module('Unit | Factory | Google Map');

const DEFAULTS  = {
  center: {lat: 1, lng: 1},
  zoom: 10
};

test('it returns a Google Map instance as content', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));
  assert.ok(map.content instanceof google.maps.Map);
});

test('it set map default options', function(assert) {
  const map = googleMap(document.createElement('div'), assign({backgroundColor: '#000'}, DEFAULTS));
  assert.ok(isPresent(map.content.minZoom), 'set default min zoom');
  assert.ok(isPresent(map.content.maxZoom), 'set default max zoom');
  assert.ok(isPresent(map.content.clickableIcons), 'set default clickable icons');
  assert.ok(isPresent(map.content.tilt), 'set default tilt');
  assert.ok(isPresent(map.content.backgroundColor), 'set initial background color');
});

test('it returns the configured center of the Map instance', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));

  const expected = {lat: 2, lng: 2};
  map.content.setCenter(expected);
  assert.deepEqual(map.get('center'), expected, 'resolves correct center');
});

test('it allows valid updates of the map center', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));

  assert.throws(() => map.set('center', [-34, 151]), 'only accepts obect');

  const expected = {lat: 2, lng: 2};
  map.set('center', expected);
  assert.deepEqual(map.get('center'), expected, 'updated center map');
});

test('it returns the configured clickable icons', function(assert) {
  const expected = {clickableIcons: false};
  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));
  map.notifyPropertyChange('clickableIcons');
  assert.equal(map.get('clickableIcons'), expected.clickableIcons, 'resolves configured clickableIcons');
});

test('it allows setting a valid clickable icons', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));

  assert.throws(() => map.set('clickableIcons', 'non-boolean'), 'only accepts boolean value');

  const expected = false;
  map.set('clickableIcons', expected);
  map.notifyPropertyChange('clickableIcons');
  assert.equal(map.content.getClickableIcons(), expected, 'resolves new clickable icons');
});

test('it returns the configured map fullscreen control options', function(assert) {
  const expected = {fullscreenControlOptions: 'BOTTOM_RIGHT'};
  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));
  map.notifyPropertyChange('fullscreenControlOptions');
  assert.equal(map.get('fullscreenControlOptions'), expected.fullscreenControlOptions, 'resolves configured fullscreenControlOptions');
});

test('it only allows setting valid fullscreen control options', function(assert) {
  const map = googleMap(document.createElement('div'), assign({fullscreenControlOptions: 'BOTTOM_RIGHT'}, DEFAULTS));

  assert.throws(() => map.set('fullscreenControlOptions', 'non-control-position'), 'only accepts a control position');

  const expected = 'LEFT_TOP';
  map.set('fullscreenControlOptions', expected);
  map.notifyPropertyChange('fullscreenControlOptions');
  assert.equal(map.get('fullscreenControlOptions'), expected, 'resolves new fullscreenControlOptions');
});

test('it removes fullscreen control options with a falsey value', function(assert) {
  const map = googleMap(document.createElement('div'), assign({fullscreenControlOptions: 'BOTTOM_RIGHT'}, DEFAULTS));

  map.set('fullscreenControlOptions', false);
  map.notifyPropertyChange('fullscreenControlOptions');

  assert.equal(map.get('fullscreenControlOptions'), undefined, 'fullscreenControlOptions is no longer defined');
});

test('it returns the configured heading', function(assert) {
  const expected = {heading: 0};
  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));
  assert.equal(map.get('heading'), expected.heading, 'resolves configured heading');
});

test('it only allows setting a valid heading', function(assert) {
  const map = googleMap(document.createElement('div'), assign({heading: 1}, DEFAULTS));

  assert.throws(() => map.set('heading', 'non-number'), 'only accepts numeric value');

  const expected = 0;
  map.set('heading', expected);
  assert.equal(map.get('heading'), expected, 'resolves new heading');
});

test('it resets heading to default after setting a falsey value', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));

  const defaultHeading = map.get('heading');
  map.set('heading', 180);

  map.set('heading', false);
  assert.equal(map.get('heading'), defaultHeading, 'heading is reset to default');
});

test('it returns the configured map type control options', function(assert) {
  const expected = {
    mapTypeControlOptions: {
      mapTypeIds: ['ROADMAP', 'SATELLITE'],
      position: 'TOP_LEFT',
      style: 'HORIZONTAL_BAR'
    }
  };
  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));
  map.notifyPropertyChange('mapTypeControlOptions');
  assert.deepEqual(map.get('mapTypeControlOptions'), expected.mapTypeControlOptions, 'resolves configured mapTypeControlOptions');
});

test('it only allows setting valid map type control options', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));

  assert.throws(() => map.set('mapTypeControlOptions', 'non-type-control'), 'only accepts a configuration object');

  const expected = {
    mapTypeIds: ['ROADMAP', 'SATELLITE'],
    position: 'TOP_LEFT',
    style: 'HORIZONTAL_BAR'
  };

  map.set('mapTypeControlOptions', expected);
  map.notifyPropertyChange('mapTypeControlOptions');
  assert.deepEqual(map.get('mapTypeControlOptions'), expected, 'resolves new mapTypeControlOptions');
});

test('it removes map type control options with a falsey value', function(assert) {
  const map = googleMap(document.createElement('div'), assign({
    mapTypeControlOptions: {
      mapTypeIds: ['ROADMAP', 'SATELLITE'],
      position: 'TOP_LEFT',
      style: 'HORIZONTAL_BAR'
    }
  }, DEFAULTS));

  map.set('mapTypeControlOptions', false);
  map.notifyPropertyChange('mapTypeControlOptions');

  assert.equal(map.get('mapTypeControlOptions'), undefined, 'mapTypeControlOptions is not defined');
});

test('it returns the configured map type id', function(assert) {
  const expected = {mapTypeId: 'HYBRID'};
  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));
  assert.equal(map.get('mapTypeId'), expected.mapTypeId, 'resolves configured map type');
});

test('it allows setting a valid map type id', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));

  assert.throws(() => map.set('mapTypeId', 'invalid'), 'only accepts valid map type ids');

  const expected = 'SATELLITE';
  map.set('mapTypeId', expected.toLowerCase());
  assert.equal(map.get('mapTypeId'), expected, 'resolves new map type id');
});

test('it removes map type id with a falsey value', function(assert) {
  const map = googleMap(document.createElement('div'), assign({mapTypeId: 'HYBRID'}, DEFAULTS));

  map.set('mapTypeId', false);
  map.notifyPropertyChange('mapTypeId');

  assert.equal(map.get('mapTypeId'), undefined, 'mapTypeId is not defined');
});

test('it returns the configured max zoom', function(assert) {
  const expected = {maxZoom: 12};
  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));
  map.notifyPropertyChange('maxZoom');
  assert.equal(map.get('maxZoom'), expected.maxZoom, 'resolves default max zoom');
});

test('it only allows setting a valid max zoom', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));
  assert.throws(() => map.set('maxZoom', DEFAULTS.zoom - 1), 'does not allow max zoom below zoom');

  const expected = 12;
  map.set('maxZoom', expected);
  map.notifyPropertyChange('maxZoom');
  assert.equal(map.get('maxZoom'), expected, 'updated max zoom of map');
});

test('it resets max zoom to default after setting a falsey value', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));

  const maxZoomDefault = map.get('maxZoom');
  map.set('maxZoom', 12);
  map.set('maxZoom', false);
  map.notifyPropertyChange('maxZoom');

  assert.equal(map.get('maxZoom'), maxZoomDefault, 'maxZoom is reset to default');
});

test('it returns the configured min zoom', function(assert) {
  const expected = {minZoom: 5};
  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));
  map.notifyPropertyChange('minZoom');
  assert.equal(map.get('minZoom'), expected.minZoom, 'resolves default min zoom');
});

test('it only allows setting a valid min zoom', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));
  assert.throws(() => map.set('minZoom', DEFAULTS + 1), 'does not allow min zoom greater than zoom');

  const expected = 8;
  map.set('minZoom', expected);
  map.notifyPropertyChange('minZoom');
  assert.equal(map.get('minZoom'), expected, 'updated min zoom of map');
});

test('it resets min zoom to default after setting a falsey value', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));

  const minZoomDefault = map.get('minZoom');
  map.set('minZoom', 8);
  map.set('minZoom', false);
  map.notifyPropertyChange('minZoom');

  assert.equal(map.get('minZoom'), minZoomDefault, 'minZoom is reset to default');
});

test('it returns the configured pan control options', function(assert) {
  const expected = {panControlOptions: 'BOTTOM_RIGHT'};
  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));
  map.notifyPropertyChange('panControlOptions');
  assert.equal(map.get('panControlOptions'), expected.panControlOptions, 'resolves configured panControlOptions');
});

test('it only allows setting valid pan control options', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));

  assert.throws(() => map.set('panControlOptions', 'non-control-position'), 'only accepts a control position');

  const expected = 'LEFT_TOP';
  map.set('panControlOptions', expected);
  map.notifyPropertyChange('panControlOptions');
  assert.equal(map.get('panControlOptions'), expected, 'resolves new panControlOptions');
});

test('it removes pan control options with a falsey value', function(assert) {
  const map = googleMap(document.createElement('div'), assign({panControlOptions: 'LEFT_TOP'}, DEFAULTS));

  map.set('panControlOptions', false);
  map.notifyPropertyChange('panControlOptions');

  assert.equal(map.get('panControlOptions'), undefined, 'panControlOptions is not defined');
});

test('it returns the configured rotate control options', function(assert) {
  const expected = {rotateControlOptions: 'BOTTOM_RIGHT'};
  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));
  map.notifyPropertyChange('rotateControlOptions');
  assert.equal(map.get('rotateControlOptions'), expected.rotateControlOptions, 'resolves configured rotateControlOptions');
});

test('it only allows setting valid rotate control options', function(assert) {
  const map = googleMap(document.createElement('div'), assign({rotateControlOptions: 'BOTTOM_RIGHT'}, DEFAULTS));

  assert.throws(() => map.set('rotateControlOptions', 'non-control-position'), 'only accepts a control position');

  const expected = 'LEFT_CENTER';
  map.set('rotateControlOptions', expected);
  map.notifyPropertyChange('rotateControlOptions');
  assert.equal(map.get('rotateControlOptions'), expected, 'resolves new rotateControlOptions');
});

test('it removes rotate control options with a falsey value', function(assert) {
  const map = googleMap(document.createElement('div'), assign({rotateControlOptions: 'LEFT_CENTER'}, DEFAULTS));

  map.set('rotateControlOptions', false);
  map.notifyPropertyChange('rotateControlOptions');

  assert.equal(map.get('rotateControlOptions'), undefined, 'rotateControlOptions is not defined');
});

test('it returns the configured scale control options', function(assert) {
  const expected = {scaleControlOptions: 'DEFAULT'};
  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));
  map.notifyPropertyChange('scaleControlOptions');
  assert.equal(map.get('scaleControlOptions'), expected.scaleControlOptions, 'resolves configured scaleControlOptions');
});

test('it only allows setting valid scale control options', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));

  assert.throws(() => map.set('scaleControlOptions', 'non-scale-style'), 'only accepts a scale style type');

  const expected = 'DEFAULT';
  map.set('scaleControlOptions', expected);
  map.notifyPropertyChange('scaleControlOptions');
  assert.equal(map.get('scaleControlOptions'), expected, 'resolves new scaleControlOptions');
});

test('it removes scale control options with a falsey value', function(assert) {
  const map = googleMap(document.createElement('div'), assign({scaleControlOptions: 'DEFAULT'}, DEFAULTS));

  map.set('scaleControlOptions', false);
  map.notifyPropertyChange('scaleControlOptions');

  assert.equal(map.get('scaleControlOptions'), undefined, 'scaleControlOptions is not defined');
});

test('it returns the configured street view', function(assert) {
  const expected = {streetView: new google.maps.StreetViewPanorama(document.createElement('div'))};
  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));
  map.notifyPropertyChange('streetView');
  assert.equal(map.get('streetView'), expected.streetView, 'resolves configured streetView');
});

test('it only allows setting a valid street view', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));
  const badStreetView = googleMap(document.createElement('div'), assign({}, DEFAULTS));

  assert.throws(() => map.set('streetView', badStreetView), 'only accepts a street view instance');

  const expected = new google.maps.StreetViewPanorama(document.createElement('div'));
  map.set('streetView', expected);
  map.notifyPropertyChange('streetView');
  assert.equal(map.get('streetView'), expected, 'resolves new street view');
});

test('it returns the configured street view control options', function(assert) {
  const expected = {streetViewControlOptions: 'BOTTOM_RIGHT'};
  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));
  map.notifyPropertyChange('streetViewControlOptions');
  assert.equal(map.get('streetViewControlOptions'), expected.streetViewControlOptions, 'resolves configured streetViewControlOptions');
});

test('it only allows setting valid street view control options', function(assert) {
  const map = googleMap(document.createElement('div'), assign({streetViewControlOptions: 'BOTTOM_RIGHT'}, DEFAULTS));

  assert.throws(() => map.set('streetViewControlOptions', 'non-control-position'), 'only accepts a control position');

  const expected = 'LEFT_TOP';
  map.set('streetViewControlOptions', expected);
  map.notifyPropertyChange('streetViewControlOptions');
  assert.equal(map.get('streetViewControlOptions'), expected, 'resolves new streetViewControlOptions');
});

test('it removes street view control options with a falsey value', function(assert) {
  const map = googleMap(document.createElement('div'), assign({streetViewControlOptions: 'BOTTOM_RIGHT'}, DEFAULTS));

  map.set('streetViewControlOptions', false);
  map.notifyPropertyChange('streetViewControlOptions');

  assert.equal(map.get('streetViewControlOptions'), undefined, 'streetViewControlOptions is not defined');
});

test('it returns the configured map tilt', function(assert) {
  const expected = 0; // NOTE 45 creates an unreliable test condition
  const map = googleMap(document.createElement('div'), assign({tilt: expected}, DEFAULTS));
  assert.equal(map.get('tilt'), expected, 'resolves configured tilt');
});

test('it only calls `setTilt` with a valid tilt perspective', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));
  assert.throws(() => map.set('tilt', 32), 'does not allow invalid tilt values');

  let wasCalled = false;
  map.content.setTilt = () => wasCalled = true;

  map.set('tilt', 45);
  assert.equal(wasCalled, true, 'updated tilt of map');
});

test('it resets tilt to default after setting a falsey value', function(assert) {
  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));

  const defaultTilt = map.get('tilt');
  map.set('tilt', 45);
  map.set('tilt', false);
  assert.equal(map.get('tilt'), defaultTilt, 'tilt is reset to default');
});

test('it returns the configured zoom level', function(assert) {
  const expected = {zoom: 5};
  const options = assign({}, DEFAULTS);
  const map = googleMap(document.createElement('div'), assign(options, expected));
  assert.equal(map.get('zoom'), expected.zoom, 'resolves correct zoom level');
});

test('it allows setting a valid zoom level', function(assert) {
  const expected = 4;
  const map = googleMap(document.createElement('div'), assign({minZoom: 1, maxZoom: 10}, DEFAULTS));
  assert.throws(() => map.set('zoom', 0), 'does not set below minimum');
  assert.throws(() => map.set('zoom', 11), 'does not set above maximum');

  map.set('zoom', expected);
  assert.equal(map.get('zoom'), expected, 'updated zoom of map');
});

test('it returns the configured zoom control options', function(assert) {
  const expected = {zoomControlOptions: 'BOTTOM_RIGHT'};
  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));
  map.notifyPropertyChange('zoomControlOptions');
  assert.equal(map.get('zoomControlOptions'), expected.zoomControlOptions, 'resolves configured zoomControlOptions');
});

test('it only allows setting valid zoom control options', function(assert) {
  const map = googleMap(document.createElement('div'), assign({zoomControlOptions: 'BOTTOM_RIGHT'}, DEFAULTS));

  assert.throws(() => map.set('zoomControlOptions', 'non-control-position'), 'only accepts a control position');

  const expected = 'RIGHT_CENTER';
  map.set('zoomControlOptions', expected);
  map.notifyPropertyChange('zoomControlOptions');
  assert.equal(map.get('zoomControlOptions'), expected, 'resolves new zoomControlOptions');
});

test('it removes zoom control options with a falsey value', function(assert) {
  const map = googleMap(document.createElement('div'), assign({zoomControlOptions: 'RIGHT_CENTER'}, DEFAULTS));

  map.set('zoomControlOptions', false);
  map.notifyPropertyChange('zoomControlOptions');

  assert.equal(map.get('zoomControlOptions'), undefined, 'zoomControlOptions is not defined');
});

test('it returns the configured static map properties', function(assert) {
  const expected = {
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    draggable: false,
    draggableCursor: 'pointer',
    draggingCursor: 'pointer',
    fullscreenControl: false,
    gestureHandling: 'greedy',
    keyboardShortcuts: false,
    mapTypeControl: false,
    noClear: false,
    panControl: false,
    rotateControl: false,
    scaleControl: false,
    scrollwheel: false,
    streetViewControl: false,
    zoomControl: false,
    styles: [{
      elementType: 'geometry', stylers: [{color: '#242f3e'}]
    }]
  };

  const map = googleMap(document.createElement('div'), assign(expected, DEFAULTS));

  assert.equal(map.get('disableDefaultUI'), expected.disableDefaultUI, 'resolves configured disableDefaultUI');
  assert.equal(map.get('disableDoubleClickZoom'), expected.disableDoubleClickZoom, 'resolves configured disableDoubleClickZoom');
  assert.equal(map.get('draggable'), expected.draggable, 'resolves configured draggable');
  assert.equal(map.get('draggableCursor'), expected.draggableCursor, 'resolves configured draggableCursor');
  assert.equal(map.get('draggingCursor'), expected.draggingCursor, 'resolves configured draggingCursor');
  assert.equal(map.get('fullscreenControl'), expected.fullscreenControl, 'resolves configured fullscreenControl');
  assert.equal(map.get('gestureHandling'), expected.gestureHandling, 'resolves configured gestureHandling');
  assert.equal(map.get('keyboardShortcuts'), expected.keyboardShortcuts, 'resolves configured keyboardShortcuts');
  assert.equal(map.get('mapTypeControl'), expected.mapTypeControl, 'resolves configured mapTypeControl');
  assert.equal(map.get('noClear'), expected.noClear, 'resolves configured noClear');
  assert.equal(map.get('panControl'), expected.panControl, 'resolves configured panControl');
  assert.equal(map.get('rotateControl'), expected.rotateControl, 'resolves configured rotateControl');
  assert.equal(map.get('scaleControl'), expected.scaleControl, 'resolves configured scaleControl');
  assert.equal(map.get('scrollwheel'), expected.scrollwheel, 'resolves configured scrollwheel');
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
    draggingCursor: 'pointer',
    fullscreenControl: false,
    gestureHandling: 'greedy',
    keyboardShortcuts: false,
    mapTypeControl: false,
    noClear: false,
    panControl: false,
    rotateControl: false,
    scaleControl: false,
    scrollwheel: false,
    streetViewControl: false,
    zoomControl: false,
    styles: [{
      elementType: 'geometry', stylers: [{color: '#242f3e'}]
    }]
  };

  const map = googleMap(document.createElement('div'), assign({}, DEFAULTS));

  assert.throws(() => map.set('disableDefaultUI', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('disableDoubleClickZoom', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('draggable', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('draggableCursor', 4), 'only accepts string value');
  assert.throws(() => map.set('draggingCursor', 4), 'only accepts string value');
  assert.throws(() => map.set('fullscreenControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('gestureHandling', 4), 'only accepts string value');
  assert.throws(() => map.set('keyboardShortcuts', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('mapTypeControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('noClear', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('panControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('rotateControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('scaleControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('scrollwheel', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('streetViewControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('zoomControl', 'non-boolean'), 'only accepts boolean value');
  assert.throws(() => map.set('styles', 'non-array'), 'only accepts array value');

  map.setProperties(expected);
  Object.keys(expected).forEach((prop) => map.notifyPropertyChange(prop));

  assert.equal(map.get('disableDefaultUI'), expected.disableDefaultUI, 'resolves new disableDefaultUI');
  assert.equal(map.get('disableDoubleClickZoom'), expected.disableDoubleClickZoom, 'resolves new disableDoubleClickZoom');
  assert.equal(map.get('draggable'), expected.draggable, 'resolves new draggable');
  assert.equal(map.get('draggableCursor'), expected.draggableCursor, 'resolves new draggableCursor');
  assert.equal(map.get('draggingCursor'), expected.draggingCursor, 'resolves new draggingCursor');
  assert.equal(map.get('fullscreenControl'), expected.fullscreenControl, 'resolves new fullscreenControl');
  assert.equal(map.get('gestureHandling'), expected.gestureHandling, 'resolves new gestureHandling');
  assert.equal(map.get('keyboardShortcuts'), expected.keyboardShortcuts, 'resolves new keyboardShortcuts');
  assert.equal(map.get('mapTypeControl'), expected.mapTypeControl, 'resolves new mapTypeControl');
  assert.equal(map.get('noClear'), expected.noClear, 'resolves new noClear');
  assert.equal(map.get('panControl'), expected.panControl, 'resolves new panControl');
  assert.equal(map.get('rotateControl'), expected.rotateControl, 'resolves new rotateControl');
  assert.equal(map.get('scaleControl'), expected.scaleControl, 'resolves new scaleControl');
  assert.equal(map.get('scrollwheel'), expected.scrollwheel, 'resolves new scrollwheel');
  assert.equal(map.get('streetViewControl'), expected.streetViewControl, 'resolves new streetViewControl');
  assert.equal(map.get('zoomControl'), expected.zoomControl, 'resolves new zoomControl');
  assert.equal(map.get('styles'), expected.styles, 'resolves new styles');
});

test('it removes static map properties with a falsey value', function(assert) {
  const map = googleMap(document.createElement('div'), assign({
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    draggable: true,
    draggableCursor: 'pointer',
    draggingCursor: 'pointer',
    fullscreenControl: true,
    gestureHandling: 'greedy',
    keyboardShortcuts: true,
    mapTypeControl: true,
    noClear: true,
    panControl: true,
    rotateControl: true,
    scaleControl: true,
    scrollwheel: true,
    streetViewControl: true,
    zoomControl: true
  }, DEFAULTS));

  map.setProperties({
    disableDefaultUI: 0,
    disableDoubleClickZoom: '',
    draggable: null,
    draggableCursor: false,
    draggingCursor: false,
    fullscreenControl: null,
    gestureHandling: false,
    keyboardShortcuts: null,
    mapTypeControl: null,
    noClear: null,
    panControl: null,
    rotateControl: null,
    scaleControl: null,
    scrollwheel: null,
    streetViewControl: null,
    zoomControl: null
  });

  assert.equal(map.get('disableDefaultUI'), false, 'accepts falsey disableDefaultUI');
  assert.equal(map.get('disableDoubleClickZoom'), false, 'accepts falsey disableDoubleClickZoom');
  assert.equal(map.get('draggable'), false, 'accepts falsey draggable');
  assert.equal(map.get('draggableCursor'), undefined, 'draggableCursor is not defined');
  assert.equal(map.get('draggingCursor'), undefined, 'draggingCursor is not defined');
  assert.equal(map.get('fullscreenControl'), false, 'accepts falsey fullscreenControl');
  assert.equal(map.get('gestureHandling'), undefined, 'gestureHandling is not defined');
  assert.equal(map.get('keyboardShortcuts'), false, 'accepts falsey keyboardShortcuts');
  assert.equal(map.get('mapTypeControl'), false, 'accepts falsey mapTypeControl');
  assert.equal(map.get('noClear'), false, 'accepts falsey noClear');
  assert.equal(map.get('panControl'), false, 'accepts falsey panControl');
  assert.equal(map.get('rotateControl'), false, 'accepts falsey rotateControl');
  assert.equal(map.get('scaleControl'), false, 'accepts falsey scaleControl');
  assert.equal(map.get('scrollwheel'), false, 'accepts falsey scrollwheel');
  assert.equal(map.get('streetViewControl'), false, 'accepts falsey streetViewControl');
  assert.equal(map.get('zoomControl'), false, 'accepts falsey zoomControl');
});
