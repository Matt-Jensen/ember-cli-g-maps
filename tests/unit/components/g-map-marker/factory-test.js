import googleMapMarker from 'ember-cli-g-maps/components/g-map-marker/factory';
import {module, test} from 'qunit';
import {assign} from 'ember-platform';

module('Unit | Factory | Google Map Marker');

const DEFAULTS  = {
  position: {lat: 1, lng: 1}
};

test('it returns a Google Map Marker instance as content', function(assert) {
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));
  assert.ok(marker.content instanceof google.maps.Marker);
});

test('it returns the configured anchor point', function(assert) {
  const expected = {
    anchorPoint: {x: 2, y: 2}
  };
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.deepEqual(marker.get('anchorPoint'), expected.anchorPoint, 'resolves configured anchor point');
});

test('it only allows a point literal as an anchor point', function(assert) {
  const pointLiteral = {x: 1, y: 1};

  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));
  assert.throws(() => marker.set('anchorPoint', 'non-object'), 'only accepts object');
  assert.throws(() => marker.set('anchorPoint', {x: 1}), 'rejects invalid point literal');

  marker.set('anchorPoint', pointLiteral);
  marker.notifyPropertyChange('anchorPoint');

  const actual = marker.get('anchorPoint');
  assert.ok(marker.content.anchorPoint instanceof google.maps.Point, 'sets as Google Maps Point instance');
  assert.equal(actual.x, pointLiteral.x, 'resolves correct anchorPoint latitude');
  assert.equal(actual.y, pointLiteral.y, 'resolves correct anchorPoint longitude');
});

test('it returns the configured animation name', function(assert) {
  const expected = {animation: 'DROP'};
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(marker.get('animation'), expected.animation, 'resolves configured animation');
});

test('it only allows setting a valid animation name or id number', function(assert) {
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));
  assert.throws(() => marker.set('animation', 35), 'rejects non-string value');
  assert.throws(() => marker.set('animation', 'bad-animation'), 'rejects non-existent animation name');

  marker.set('animation', 'bounce');
  assert.equal(marker.get('animation'), 'BOUNCE', 'resolves new bounce animation');
});

test('it returns the configured clickable setting', function(assert) {
  const expected = {clickable: false};
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(marker.get('clickable'), expected.clickable, 'resolves configured clickable');
});

test('it only allows setting a valid clickable value', function(assert) {
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => marker.set('clickable', 'non-boolean'), 'rejects non-boolean value');

  marker.set('clickable', false);
  assert.equal(marker.get('clickable'), false, 'updated clickable');
});

test('it returns the configured crossOnDrag setting', function(assert) {
  const expected = {crossOnDrag: false};
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(marker.get('crossOnDrag'), expected.crossOnDrag, 'resolves configured crossOnDrag');
});

test('it only allows setting a valid crossOnDrag value', function(assert) {
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => marker.set('crossOnDrag', 'non-boolean'), 'rejects non-boolean value');

  marker.set('crossOnDrag', false);
  marker.notifyPropertyChange('crossOnDrag');
  assert.equal(marker.get('crossOnDrag'), false, 'updated crossOnDrag');
});

test('it returns the configured cursor setting', function(assert) {
  const expected = {cursor: 'pointer'};
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(marker.get('cursor'), expected.cursor, 'resolves configured cursor');
});

test('it only allows setting a valid cursor value', function(assert) {
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => marker.set('cursor', false), 'rejects non-string value');

  marker.set('cursor', 'pointer');
  assert.equal(marker.get('cursor'), 'pointer', 'updated cursor');
});

test('it returns the configured draggable setting', function(assert) {
  const expected = {draggable: true};
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(marker.get('draggable'), expected.draggable, 'resolves configured draggable');
});

test('it only allows setting a valid draggable value', function(assert) {
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => marker.set('draggable', 'non-boolean'), 'rejects non-boolean value');

  marker.set('draggable', true);
  assert.equal(marker.get('draggable'), true, 'updated draggable');
});

test('it returns the configured icon', function(assert) {
  const expected = {icon: 'beachflag.png'};
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(marker.get('icon'), expected.icon, 'resolves configured icon');
});

test('it only allows setting a valid icon value', function(assert) {
  const url = 'beachflag.png';
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => marker.set('icon', false), 'rejects invalid');

  marker.set('icon', url);
  assert.equal(marker.get('icon'), url, 'updated icon as string URL');

  const iconConfig = {
    url,
    anchor: {x: 1, y: 1},
    size: {height: 10, j: 'px', width: 10, f: 'px'}
  };
  marker.set('icon', iconConfig);
  assert.deepEqual(marker.get('icon'), iconConfig, 'updated icon with icon configuration');

  const symbolConstConfig = {
    path: 'CIRCLE',
    anchor: {x: 1, y: 1}
  };
  marker.set('icon', symbolConstConfig);
  assert.deepEqual(marker.get('icon'), symbolConstConfig, 'updated icon with symbol constant configuration');

  const symbolSvgConfig = {
    path: 'M10 10 H 90 V 90 H 10 L 10 10',
    anchor: {x: 1, y: 1}
  };
  marker.set('icon', symbolSvgConfig);
  assert.deepEqual(marker.get('icon'), symbolSvgConfig, 'updated icon with symbol SVG path notation configuration');
});

test('it returns the configured label', function(assert) {
  const expected = {label: 'Marker test'};
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(marker.get('label'), expected.label, 'resolves configured label');
});

test('it only allows setting a valid string label value', function(assert) {
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => marker.set('label', false), 'rejects invalid label value');

  const labelStr = 'Marker test';
  marker.set('label', labelStr);
  marker.notifyPropertyChange('label');
  assert.equal(marker.get('label'), labelStr, 'updated label as string');
});

test('it only allows setting a valid object label value', function(assert) {
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));

  const markerLabel = {
    color: 'rgb(113, 9, 9)',
    fontFamily: 'monospace',
    text: 'Marker test'
  };

  assert.throws(() => marker.set('label', {fontFamily: 'monospace'}), 'rejects marker label without text property');

  marker.set('label', markerLabel);
  marker.notifyPropertyChange('label');
  assert.deepEqual(marker.get('label'), markerLabel, 'updated label with marker label configuration');
});

test('it returns the configured opacity setting', function(assert) {
  const expected = {opacity: 0.85};
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(marker.get('opacity'), expected.opacity, 'resolves configured opacity');
});

test('it only allows setting a valid opacity value', function(assert) {
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => marker.set('opacity', 'non-numeric'), 'rejects non-numeric value');
  assert.throws(() => marker.set('opacity', 1.1), 'rejects opacity above 1');
  assert.throws(() => marker.set('opacity', -0.6), 'rejects opacity below 0');

  const expected = 0.75;
  marker.set('opacity', expected);
  marker.notifyPropertyChange('opacity');
  assert.equal(marker.get('opacity'), expected, 'updated opacity');
});

test('it returns the configured optimized setting', function(assert) {
  const expected = {optimized: false};
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(marker.get('optimized'), expected.optimized, 'resolves configured optimized');
});

test('it only allows setting a valid optimized value', function(assert) {
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => marker.set('optimized', 'non-boolean'), 'rejects non-boolean value');

  marker.set('optimized', false);
  marker.notifyPropertyChange('optimized');
  assert.equal(marker.get('optimized'), false, 'updated optimized');
});

test('it returns the position of the Marker instance', function(assert) {
  const expected = {lat: 1, lng: 1};
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  marker.content.setPosition(expected);

  const position = marker.get('position');
  assert.equal(position.lat, expected.lat, 'resolves correct latitude');
  assert.equal(position.lng, expected.lng, 'resolves correct longitude');
});

test('it returns the configured position', function(assert) {
  const expected = {
    position: {lat: 1, lng: 1}
  };
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.deepEqual(marker.get('position'), expected.position, 'resolves configured position');
});

test('it only allows setting a lat lng literal as a position', function(assert) {
  const latLngLiteral = {lat: 1, lng: 1};

  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));
  assert.throws(() => marker.set('position', 'non-object'), 'only accepts object');
  assert.throws(() => marker.set('position', {lat: 1}), 'reject invalid lat lng literal');

  marker.set('position', latLngLiteral);
  assert.deepEqual(marker.get('position'), latLngLiteral, 'resolves correct position');
});

test('it returns the configured shape', function(assert) {
  const expected = {
    shape: {
      coords: [10, 10, 100],
      type: 'circle'
    }
  };
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(marker.get('shape'), expected.shape, 'resolves configured shape');
});

test('it only allows setting a valid circular marker shape literal as a shape', function(assert) {
  const circleMarkerShapeLiteral = {
    coords: [1, 1, 2],
    type: 'circle'
  };

  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));
  assert.throws(() => marker.set('position', 'non-object'), 'only accepts object');
  assert.throws(() => marker.set('position', {}), 'rejects marker shape without a type property');
  assert.throws(() => marker.set('position', {type: 'circle', coords: ['1']}), 'rejects marker shape without numeric coords');
  assert.throws(() => marker.set('position', {type: 'circle', coords: [1, 1]}), 'rejects circle marker shape without 3 coords');

  marker.set('shape', circleMarkerShapeLiteral);
  assert.deepEqual(marker.content.shape, circleMarkerShapeLiteral, 'resolves correct circle marker shape');
});

test('it only allows setting a valid polygonal marker shape literal as a shape', function(assert) {
  const polyMarkerShapeLiteral = {
    coords: [1, 1, 2, 2],
    type: 'poly'
  };

  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));
  assert.throws(() => marker.set('position', {type: 'poly', coords: [1, 1, 2]}), 'rejects poly marker shape with less than 4 coords');
  assert.throws(() => marker.set('position', {type: 'poly', coords: [1, 1, 2, 2, 3]}), 'rejects poly marker shape with odd number of coords');

  marker.set('shape', polyMarkerShapeLiteral);
  assert.deepEqual(marker.content.shape, polyMarkerShapeLiteral, 'resolves correct poly marker shape');
});

test('it only allows setting a valid rectangular marker shape literal as a shape', function(assert) {
  const rectMarkerShapeLiteral = {
    coords: [1, 1, 2, 2],
    type: 'rect'
  };

  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));
  assert.throws(() => marker.set('position', {type: 'rect', coords: [1, 1, 2]}), 'rejects rect marker shape without 2 coords');

  marker.set('shape', rectMarkerShapeLiteral);
  assert.deepEqual(marker.content.shape, rectMarkerShapeLiteral, 'resolves correct rect marker shape');
});

test('it returns the configured title setting', function(assert) {
  const expected = {title: 'test'};
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(marker.get('title'), expected.title, 'resolves configured title');
});

test('it only allows setting a valid title value', function(assert) {
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => marker.set('title', false), 'rejects non-string value');

  const expected = 'test';
  marker.set('title', expected);

  assert.equal(marker.get('title'), expected, 'updated title');
});

test('it returns the configured visible setting', function(assert) {
  const expected = {visible: false};
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(marker.get('visible'), expected.visible, 'resolves configured visible');
});

test('it only allows setting a valid visible value', function(assert) {
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => marker.set('visible', 'non-boolean'), 'rejects non-boolean value');

  marker.set('visible', false);
  assert.equal(marker.get('visible'), false, 'updated visible');
});

test('it returns the configured zIndex setting', function(assert) {
  const expected = {zIndex: 100};
  const marker = googleMapMarker(createGoogleMap(), assign(expected, DEFAULTS));
  assert.equal(marker.get('zIndex'), expected.zIndex, 'resolves configured zIndex');
});

test('it only allows setting a valid zIndex value', function(assert) {
  const marker = googleMapMarker(createGoogleMap(), assign({}, DEFAULTS));

  assert.throws(() => marker.set('zIndex', 'non-numeric'), 'rejects non-numeric value');
  assert.throws(() => marker.set('zIndex', google.maps.Marker.MAX_ZINDEX + 1), 'rejects zIndex beyond maximum');

  const expected = 100;
  marker.set('zIndex', expected);
  assert.equal(marker.get('zIndex'), expected, 'updated zIndex');
});

function createGoogleMap() {
  return new google.maps.Map(document.createElement('div'));
}
