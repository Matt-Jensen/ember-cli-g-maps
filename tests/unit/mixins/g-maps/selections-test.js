/* globals google: true */
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
    new Error('g-map component requires the "drawing" library included in `config/environment.js`')
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

test('`_gmapSelectionsMode` should provide the expected google maps overlay type', function(assert) {
  subject.set('selectionsMode', 'marker');
  assert.equal(subject.get('_gmapSelectionsMode'), google.maps.drawing.OverlayType.MARKER);

  subject.set('selectionsMode', 'PolYgoN');
  assert.equal(subject.get('_gmapSelectionsMode'), google.maps.drawing.OverlayType.POLYGON);
});

test('`_gmapSelectionsMode` should return `null` if no mode specified', function(assert) {
  subject.set('selectionsMode', '');
  assert.equal(subject.get('_gmapSelectionsMode'), null);
});

/////////////////////
// Selections Modes
/////////////////////

test('`_gmapSelectionsModes` should provide the expected google maps overlay types', function(assert) {
  subject.set('selectionsModes', ['marker', 'circle', 'polygon']);
  assert.deepEqual(subject.get('_gmapSelectionsModes'), [
    google.maps.drawing.OverlayType.MARKER,
    google.maps.drawing.OverlayType.CIRCLE,
    google.maps.drawing.OverlayType.POLYGON
  ]);
});


/////////////////////////
// Selections Position
////////////////////////

test('`_gmapSelectionsPosition` should provide the expected google maps control position', function(assert) {
  subject.set('selectionsPosition', 'left');
  assert.equal(subject.get('_gmapSelectionsPosition'), google.maps.ControlPosition.LEFT_CENTER);
  
  subject.set('selectionsPosition', 'left-bottom');
  assert.equal(subject.get('_gmapSelectionsPosition'), google.maps.ControlPosition.LEFT_BOTTOM);

  subject.set('selectionsPosition', 'right_top');
  assert.equal(subject.get('_gmapSelectionsPosition'), google.maps.ControlPosition.RIGHT_TOP);

  subject.set('selectionsPosition', 'bottomCenter');
  assert.equal(subject.get('_gmapSelectionsPosition'), google.maps.ControlPosition.BOTTOM_CENTER);
});


//////////////////////////
// Draw Manager Options
/////////////////////////

test('`_drawManagerOptions` should map correctly to `selections.visible` property', function(assert) {
  subject.set('selections', { visible: true });
  assert.equal(subject.get('_drawManagerOptions').drawingControl, true);

  subject.set('selections', { visible: false });
  assert.equal(subject.get('_drawManagerOptions').drawingControl, false);
});

test('`_drawManagerOptions` should map `selectionsMode` to `drawingMode`', function(assert) {
  subject.set('selectionsMode', 'marker');
  assert.equal(subject.get('_drawManagerOptions').drawingMode, subject.get('_gmapSelectionsMode'));
});

test('`_drawManagerOptions` should map `selectionsPosition` to `drawingControlOptions.position`', function(assert) {
  subject.set('selectionsPosition', 'bottom');
  assert.equal(
    subject.get('_gmapSelectionsPosition'),
    subject.get('_drawManagerOptions').drawingControlOptions.position
  );
});

test('`_drawManagerOptions` should map `selectionsModes` to `drawingControlOptions.drawingModes`', function(assert) {
  subject.set('selectionsModes', ['marker']);
  assert.equal(
    subject.get('_gmapSelectionsModes'),
    subject.get('_drawManagerOptions').drawingControlOptions.drawingModes
  );
});

test('`_drawManagerOptions` should provide the expected selector options', function(assert) {
  const options = { polygonOptions: { fillColor: 'red' } };
  subject.set('selections', options);

  assert.deepEqual(
    options.polygonOptions,
    subject.get('_drawManagerOptions').polygonOptions
  );
});

/////////////////////
// Trigger Actions
////////////////////

test('marker selection should send action `selectionsMarker`', function(assert) {
  assert.expect(1);

  subject.setProperties({
    selections: true,
    isMapLoaded: true,
    googleMapsSupportsDrawingManager: true,
    map: { map: googleMap },
    $: Ember.$
  });

  subject._initSelections();

  subject.send = function(action) {
    assert.equal(action, 'selectionsMarker');
  };

  google.maps.event.trigger(subject.get('_drawingManager'), 'overlaycomplete', {
    type: google.maps.drawing.OverlayType.MARKER,
    overlay: { setMap: function() {} } // mock google overlay object
  });
});

test('circle selection should send action `selectionsCircle`', function(assert) {
  assert.expect(1);

  subject.setProperties({
    selections: true,
    isMapLoaded: true,
    googleMapsSupportsDrawingManager: true,
    map: { map: googleMap },
    $: Ember.$
  });

  subject._initSelections();

  subject.send = function(action) {
    assert.equal(action, 'selectionsCircle');
  };

  google.maps.event.trigger(subject.get('_drawingManager'), 'overlaycomplete', {
    type: google.maps.drawing.OverlayType.CIRCLE,
    overlay: { setMap: function() {} } // mock google overlay object
  });
});

test('rectangle selection should send action `selectionsRectangle`', function(assert) {
  assert.expect(1);

  subject.setProperties({
    selections: true,
    isMapLoaded: true,
    googleMapsSupportsDrawingManager: true,
    map: { map: googleMap },
    $: Ember.$
  });

  subject._initSelections();

  subject.send = function(action) {
    assert.equal(action, 'selectionsRectangle');
  };

  google.maps.event.trigger(subject.get('_drawingManager'), 'overlaycomplete', {
    type: google.maps.drawing.OverlayType.RECTANGLE,
    overlay: { setMap: function() {} } // mock google overlay object
  });
});

test('polygon selection should send action `selectionsPolygon`', function(assert) {
  assert.expect(1);

  subject.setProperties({
    selections: true,
    isMapLoaded: true,
    googleMapsSupportsDrawingManager: true,
    map: { map: googleMap },
    $: Ember.$
  });

  subject._initSelections();

  subject.send = function(action) {
    assert.equal(action, 'selectionsPolygon');
  };

  google.maps.event.trigger(subject.get('_drawingManager'), 'overlaycomplete', {
    type: google.maps.drawing.OverlayType.POLYGON,
    overlay: { setMap: function() {} } // mock google overlay object
  });
});

test('polyline selection should send action `selectionsPolyline`', function(assert) {
  assert.expect(1);

  subject.setProperties({
    selections: true,
    isMapLoaded: true,
    googleMapsSupportsDrawingManager: true,
    map: { map: googleMap },
    $: Ember.$
  });

  subject._initSelections();

  subject.send = function(action) {
    assert.equal(action, 'selectionsPolyline');
  };

  google.maps.event.trigger(subject.get('_drawingManager'), 'overlaycomplete', {
    type: google.maps.drawing.OverlayType.POLYLINE,
    overlay: { setMap: function() {} } // mock google overlay object
  });
});


/////////////////////////
// Teardown Selections
////////////////////////

test('`_teardownSelections` should correctly reset on `willDestroyElement`', function(assert) {
  subject.setProperties({
    selections: true,
    isMapLoaded: true,
    googleMapsSupportsDrawingManager: true,
    map: { map: googleMap },
    $: Ember.$
  });

  // Setup selections
  subject._initSelections();

  subject.trigger('willDestroyElement');

  assert.equal(subject.get('drawingManager'), null);
  assert.equal(subject.get('_selectionsEventOverlayComplete'), null);
});
