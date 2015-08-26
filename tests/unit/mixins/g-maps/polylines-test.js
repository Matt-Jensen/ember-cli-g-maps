import Ember               from 'ember';
import GMapsPolylinesMixin from 'ember-cli-g-maps/mixins/g-maps/polylines';
import { module, test }    from 'qunit';
import sinon               from 'sinon';

let subject;

module('Unit | Mixin | g maps/polylines', {
  beforeEach: function() {
    const GMapsPolylineObject = Ember.Object.extend(GMapsPolylinesMixin, Ember.Evented);
    subject = GMapsPolylineObject.create();
  }
});

test('it should trigger validate on `didInsertElement` event', function(assert) {
  subject._gmapPolylineValidate = sinon.spy();
  subject.trigger('didInsertElement');
  assert.ok(subject._gmapPolylineValidate.calledOnce);
});


test('it should throw an error when `polylines` property is not an Ember array', function(assert) {
  subject.set('polylines', {});

  assert.throws(
    function() { return subject._gmapPolylineValidate(); },
    new Error('g-maps component expects polylines to be an Ember Array')
  );
});

test('it should throw an error when `polylines.[].0.path` property is not an array', function(assert) {
  subject.set('polylines', Ember.A([{ path: [ {} ] }]));

  assert.throws(
    function() { return subject._gmapPolylineValidate(); },
    new Error('g-maps polyline path property expects Array of Arrays: [[lat, lng]]')
  );
});

test('it should sync on `isMapLoaded` and updates to `polylines` model', function(assert) {
  subject.set('polylines', Ember.A());
  
  // Replace sync with spy
  subject._gmapPolylineSync = Ember.observer(subject._gmapPolylineSync.__ember_observes__, sinon.spy());

  subject.set('isMapLoaded', true);
  assert.equal(subject._gmapPolylineSync.callCount, 1);

  subject.get('polylines').pushObject({ path: [[1, 1]] });
  assert.equal(subject._gmapPolylineSync.callCount, 2);
});

test('it should not add polyline when map is not loaded', function(assert) {
  const conf = {
    isMapLoaded: false, // Map is not loaded
    polylines: Ember.A(),
    map: {
      addPolyline: sinon.spy()
    }
  };

  subject.setProperties(conf);
  subject.get('polylines').pushObject({ path: [[1, 1]] });

  assert.equal(conf.map.addPolyline.called, false);
});


test('it should call `map.addPolyline` with polyline when map child index does not exist yet', function(assert) {
  const polyline = { lat: 0, lng: 0, radius: 1 };
  const conf = {
    isMapLoaded: true,
    polylines: Ember.A(),
    map: {
      polylines: [],
      addPolyline: function() {}
    }
  };

  sinon.stub(conf.map, 'addPolyline', function(p) {
    subject.map.polylines.push(p);
    return p;
  });

  subject.setProperties(conf);
  subject.get('polylines').pushObject(polyline);

  assert.ok(conf.map.addPolyline.calledWith(polyline));
});


test('it should NOT call `map.addPolyline` when map child at index equals polyline at same index', function(assert) {
  const polyline = { path: [[1, 1]] };
  const conf = {
    isMapLoaded: false,
    polylines: Ember.A(),
    map: {
      polylines: [polyline],
      addPolyline: sinon.spy()
    }
  };

  subject.setProperties(conf);
  subject.setProperties({
    isMapLoaded: true, // allow sync to complete
    polylines: Ember.A([polyline]) // polyline should === map[model]
  });

  assert.equal(conf.map.addPolyline.called, false);
});


test('it should call `map.removePolyline` & `map.addPolyline` when new polyline at exsiting index', function(assert) {
  const polylineOne = { path: [[1, 1]] };
  const polylineTwo = { id: 'two', path: [[2, 2]] };
  const diffPolylineTwo = { id: 'new-two', path: [[2, 2]] }; // change id
  const conf = {
    isMapLoaded: true,
    polylines: Ember.A([polylineOne, polylineTwo]),
    map: {
      polylines: [],
      addPolyline: function() {},
      removePolyline: function() {}
    }
  };

  sinon.stub(conf.map, 'addPolyline', function(p) {
    subject.map.polylines.push(p);
    return p;
  });

  sinon.stub(conf.map, 'removePolyline', function() {
    subject.map.polylines.splice(1, 1);
  });

  // Add non-existant map children
  subject.setProperties(conf);
  assert.equal(conf.map.addPolyline.called, true);

  // Add new array with new 2nd polyline object
  subject.set('polylines', Ember.A([polylineOne, diffPolylineTwo]));
  assert.equal(conf.map.addPolyline.callCount, 3);
  assert.equal(conf.map.removePolyline.callCount, 1);

  // assert new polyline is at correct index
  assert.equal(conf.map.polylines.pop().id, diffPolylineTwo.id);
});
