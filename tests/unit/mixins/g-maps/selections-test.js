import Ember                from 'ember';
import GMapsSelectionsMixin from 'ember-cli-g-maps/mixins/g-maps/selections';
import { module, test }     from 'qunit';
import sinon                from 'sinon';

let subject;
const googleMap = new google.maps.Map(document.createElement('div'), {
  center: { lat: 0, lng: 0 },
  zoom: 10
});

module('Unit | Mixin | g maps/selections', {
  beforeEach: function() {
    const GMapsSelectionsObject = Ember.Object.extend(GMapsSelectionsMixin, Ember.Evented);
    subject = GMapsSelectionsObject.create();
  }
});


/////////////////////////
// Validate Selections
////////////////////////

test('it should require truthy `selections` in order to instantiate', function(assert) {
  assert.equal(subject._validateSelections(), false);
});

test('it should throw an error if Drawing Manager is not supported', function(assert) {
  subject.setProperties({
    selections: true,
    googleMapsSupportsDrawingManager: false
  });

  assert.throws(
    function() { return subject._validateSelections(); },
    new Error('the g-map component requires the "drawing" library included in `config/environment.js`')
  );
});

test('it invokes `_validateSelections` on `didInsertElement` event', function(assert) {
  subject._validateSelections = sinon.spy();
  subject.trigger('didInsertElement');
  assert.ok(subject._validateSelections.calledOnce);
});

test('it adds observers for `isMapLoaded` and `selections` with valid selections requirements', function(assert) {
  subject.setProperties({ selections: true });

  subject.trigger('didInsertElement');

  assert.ok(subject.hasObserverFor('isMapLoaded'));
  assert.ok(subject.hasObserverFor('selections'));
});


/////////////////////
// Init Selections
////////////////////

test('it invokes `_initSelections` on `isMapLoaded` and `selections` property changes', function(assert) {
  subject.setProperties({ selections: true });
  subject.trigger('didInsertElement');

  subject._initSelections = sinon.spy();

  subject.set('selections', false);
  assert.ok(subject._initSelections.callCount, 1);

  subject.set('isMapLoaded', true);
  assert.ok(subject._initSelections.callCount, 2);
});

test('it should not instantiate a drawingManager if Drawing Manager is not supported', function(assert) {
  subject.setProperties({
    selections: true,
    isMapLoaded: true,
    googleMapsSupportsDrawingManager: false
  });

  subject._initSelections();

  assert.equal(subject.get('_drawingManager'), null);
});

test('it should instantate a drawingManager if Drawing Manager is supported and set to google map', function(assert) {
  subject.setProperties({
    selections: true,
    isMapLoaded: true,
    googleMapsSupportsDrawingManager: true,
    map: { map: googleMap },
    $: Ember.$
  });

  subject._initSelections();
  assert.ok(subject.get('_drawingManager') instanceof google.maps.drawing.DrawingManager);

  // Draw Manager is set to the google map
  assert.ok(subject.get('_drawingManager.map') === googleMap);
});

test('it should create an event listener for `overlayComplete`', function(assert) {
  subject.setProperties({
    selections: true,
    isMapLoaded: true,
    googleMapsSupportsDrawingManager: true,
    map: { map: googleMap },
    $: Ember.$
  });

  subject._initSelections();
  assert.equal(subject.get('_selectionsEventOverlayComplete').A, 'overlaycomplete');
});

test('it should remove observers for `isMapLoaded` and `selections` property changes', function(assert) {
  subject.setProperties({
    selections: true,
    isMapLoaded: true,
    googleMapsSupportsDrawingManager: true,
    map: { map: googleMap },
    $: Ember.$
  });

  // Setup observers
  subject.trigger('didInsertElement');

  subject._initSelections();

  assert.equal(subject.hasObserverFor('isMapLoaded'), false);
  assert.equal(subject.hasObserverFor('selections'), false);
});

test('it should add an observer for `_drawManagerOptions` and call `_syncDrawingMangagerOptions`', function(assert) {
  subject.setProperties({
    selections: true,
    isMapLoaded: true,
    googleMapsSupportsDrawingManager: true,
    map: { map: googleMap },
    $: Ember.$
  });

  subject._syncDrawingMangagerOptions = sinon.spy();

  subject._initSelections();

  assert.ok(subject.hasObserverFor('_drawManagerOptions'), false);
  assert.ok(subject._syncDrawingMangagerOptions.called);
});



/////////////////////
// Selections Mode
/////////////////////



/////////////////////
// Selections Modes
/////////////////////



/////////////////////////
// Selections Position
////////////////////////



//////////////////////////
// Draw Manager Options
/////////////////////////



/////////////////////
// Trigger Actions
////////////////////

// test('marker selection should send action `selectionsMarker`', function(assert) {});
// test('circle selection should send action `selectionsCircle`', function(assert) {});
// test('rectangle selection should send action `selectionsRectangle`', function(assert) {});
// test('polygon selection should send action `selectionsPolygon`', function(assert) {});
// test('polyline selection should send action `selectionsPolyline`', function(assert) {});


/////////////////////////
// Teardown Selections
////////////////////////