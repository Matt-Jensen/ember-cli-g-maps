import googleMapOverlayView from 'ember-cli-g-maps/components/g-map-overlay-view/factory';
import {module, test} from 'qunit';
import {assign} from 'ember-platform';
import {createGoogleMap} from '../../../helpers/google-maps';

module('Unit | Factory | Google Map OverlayView');

const DEFAULTS  = Object.freeze({
  position: {lat: 1, lng: 1},
  innerHTML: '<h1>Test</h1>',
  mouseEvents: false
});

test('it returns a Google Map OverlayView instance as content', function(assert) {
  const overlayView = googleMapOverlayView(createGoogleMap(), assign({}, DEFAULTS));
  assert.ok(overlayView.content instanceof google.maps.OverlayView);
});

test('it returns the configured position of the overlayView instance', function(assert) {
  const expected = DEFAULTS.position;
  const instance = googleMapOverlayView(createGoogleMap(), assign({}, DEFAULTS));
  assert.deepEqual(instance.content.position, expected, 'resolves correct position');
});

test('it returns the configured visible of the overlayView instance', function(assert) {
  const expected = false;
  const instance = googleMapOverlayView(createGoogleMap(), assign(assign({}, DEFAULTS), {visible: false}));
  assert.strictEqual(instance.get('visible'), expected, 'resolves correct visible');
});

test('it returns the configured zIndex setting', function(assert) {
  const expected = 100;
  const instance = googleMapOverlayView(createGoogleMap(), assign(assign({}, DEFAULTS), {zIndex: expected}));
  assert.strictEqual(instance.get('zIndex'), expected, 'resolves configured zIndex');
});

test('it creates and appends an element to the configured layer', function(assert) {
  const layer = 'floatPane';
  const layerElement = document.createElement('div');
  const instance = googleMapOverlayView(createGoogleMap(), assign(assign({}, DEFAULTS), {layer}));

  const originalGetPanes = instance.content.getPanes;
  instance.content.getPanes = () => ({
    [layer]: layerElement
  });

  // Before append
  assert.strictEqual(instance.content.isAddedToMap, false, 'google.maps.OverlayView instance not isAddedToMap');

  instance.content.onAdd();

  // After append
  assert.strictEqual(instance.content.element, layerElement.children[0], 'appended the overlay view element to configured layer');
  assert.strictEqual(instance.content.isAddedToMap, true, 'google.maps.OverlayView instance isAddedToMap');

  instance.content.getPanes = originalGetPanes;
});
