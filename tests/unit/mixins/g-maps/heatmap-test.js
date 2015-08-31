/* globals google: true */
import Ember             from 'ember';
import GMapsHeatmapMixin from 'ember-cli-g-maps/mixins/g-maps/heatmap';
import { module, test }  from 'qunit';
import sinon             from 'sinon';

const { merge } = Ember;

const googleMap = new google.maps.Map(document.createElement('div'), {
  center: { lat: 0, lng: 0 },
  zoom: 10
});

function createSubject(isValid=false, hasInit=false) {
  let config = {};
  let subject;
  const GMapsHeatmapObject = Ember.Object.extend(Ember.Evented, GMapsHeatmapMixin);

  if(isValid) {
    merge(config, {
      heatmapMarkers: Ember.A(),
      isMapLoaded: true,
      map: googleMap
    });
  }

  subject = GMapsHeatmapObject.create(config);

  if(hasInit) { subject._initHeatmap(); }

  return subject;
};

module('Unit | Mixin | g maps/heatmap');


//////////////////////////////////
// Google Maps Supports Heatmap
/////////////////////////////////

test('`googleMapsSupportsHeatmap` returns false if Heatmap not supported', function(a) {
  const subject = createSubject();
  const originalHeatmapLayer = google.maps.visualization.HeatmapLayer;
  google.maps.visualization.HeatmapLayer = null;

  a.equal(subject.googleMapsSupportsHeatmap(), false);

  google.maps.visualization.HeatmapLayer = originalHeatmapLayer;
});

test('`googleMapsSupportsHeatmap` returns true if Heatmap is support', function(a) {
  const subject = createSubject();
  a.equal(subject.googleMapsSupportsHeatmap(), true);
});


//////////////////////
// Validate Heatmap
/////////////////////

test('`_validateHeatmap` should trigger on `didInsertElement`', function(a) {
  const subject = createSubject();
  subject._validateHeatmap = sinon.spy();
  subject.trigger('didInsertElement');
  a.ok(subject._validateHeatmap.called);
});

test('`_validateHeatmap` should throw error if Heatmap Layer not supported', function(a) {
  const subject = createSubject(true);
  subject.googleMapsSupportsHeatmap = function() { return false; };

  a.throws(
    function() { return subject._validateHeatmap(); },
    new Error('g-map component requires the "visualization" library included in `config/environment.js`')
  );
});

test('`_validateHeatmap` should add observers for `_initHeatmap` if supported', function(a) {
  const subject = createSubject(true);
  subject._validateHeatmap();
  a.ok(subject.hasObserverFor('isMapLoaded'));
  a.ok(subject.hasObserverFor('heatmapMarkers'));
});


//////////////////
// Init Heatmap
/////////////////

test('`_initHeatmap` should not init if google map is not loaded', function(a) {
  const subject = createSubject(true);
  subject.isMapLoaded = false;
  a.equal(subject._initHeatmap(), false);
});

test('`_initHeatmap` should create google MVC Array and Heatmap Layer', function(a) {
  const subject = createSubject(true);
  subject._initHeatmap();

  a.ok(subject._heatmapMarkersMVCArray instanceof google.maps.MVCArray);
  a.ok(subject._heatmap instanceof google.maps.visualization.HeatmapLayer);
  a.ok(subject._heatmap.data === subject._heatmapMarkersMVCArray);
});

test('`_initHeatmap` should correctly add and remove observers', function(a) {
  const subject = createSubject(true);
  subject._initHeatmap();

  // Added
  a.ok(subject.hasObserverFor('heatmapMarkers.[]'));
  a.ok(subject.hasObserverFor('heatmapRadius'));
  a.ok(subject.hasObserverFor('heatmapDissipating'));
  a.ok(subject.hasObserverFor('heatmapOpacity'));
  a.ok(subject.hasObserverFor('heatmapGradient.[]'));
  a.ok(subject.hasObserverFor('heatmapVisible'));

  // Removed
  a.equal(subject.hasObserverFor('isMapLoaded'), false);
  a.equal(subject.hasObserverFor('heatmapMarkers'), false);
});


//////////////////////
// Teardown Heatmap
/////////////////////

test('`_teardownHeatmap` should trigger on `willDestroyElement`', function(a) {
  const subject = createSubject();
  subject._teardownHeatmap = sinon.spy();
  subject.trigger('willDestroyElement');
  a.ok(subject._teardownHeatmap.called);
});

test('`_teardownHeatmap` should teardown the heatmap and MVC Array', function(a) {
  const subject = createSubject(true, true);
  const spy = subject._heatmap.setMap = sinon.spy();
  subject._teardownHeatmap();

  a.ok(spy.calledWith(null));
  a.equal(subject._heatmap, null);
  a.equal(subject._heatmapMarkersMVCArray, null);
});


//////////////////////////
// Sync Heatmap Markers
/////////////////////////

test('`_syncHeatmapMarkers` throws error for invalid heatmapMarker item object', function(a) {
  const subject = createSubject(true, true);
  subject.heatmapMarkers.push({ location: false });
  a.throws(
    function() { return subject._syncHeatmapMarkers(); },
    new Error('`heatmapMarkers` must be an array of objects with a location array')
  );
});