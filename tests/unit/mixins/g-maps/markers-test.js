import Ember             from 'ember';
import GMapsMarkersMixin from 'ember-cli-g-maps/mixins/g-maps/markers';
import { module, test }  from 'qunit';
import sinon             from 'sinon';

let subject;

module('Unit | Mixin | g maps/markers', {
  beforeEach: function() {
    const GMapsMarkersObject = Ember.Object.extend(GMapsMarkersMixin, Ember.Evented);
    subject = GMapsMarkersObject.create();
  }
});

test('it should trigger validate on `didInsertElement` event', function(assert) {
  subject._gmapMarkerValidate = sinon.spy();
  subject.trigger('didInsertElement');
  assert.ok(subject._gmapMarkerValidate.calledOnce);
});

test('it should throw an error when `markers` property is not an Ember array', function(assert) {
  subject.set('markers', {});

  assert.throws(
    function() { return subject._gmapMarkerValidate(); },
    new Error('g-maps component expects markers to be an Ember Array')
  );
});

test('it should not add marker when map is not loaded', function(assert) {
  const conf = {
    isMapLoaded: false, // Map is not loaded
    markers: Ember.A(),
    map: {
      addMarker: sinon.spy()
    }
  };

  subject.setProperties(conf);
  subject.get('markers').pushObject({ lat: 0, lng: 0 });

  assert.equal(conf.map.addMarker.called, false);
});

test('it should call `map.addMarker` with marker when map child index does not exist yet', function(assert) {
  const marker = { lat: 0, lng: 0, radius: 1 };
  const conf = {
    isMapLoaded: true,
    markers: Ember.A(),
    map: {
      markers: [],
      addMarker: function() {}
    }
  };

  sinon.stub(conf.map, 'addMarker', function(m) {
    subject.map.markers.push(m);
    return m;
  });

  subject._gmapMarkerAfterAddChild = sinon.spy();

  subject.setProperties(conf);
  subject.get('markers').pushObject(marker);

  assert.ok(conf.map.addMarker.calledWith(marker));

  // Should of invoked `addedItem` config method
  assert.ok(subject._gmapMarkerAfterAddChild.called);
});

test('it should NOT call `map.addMarker` when map child at index equals marker at same index', function(assert) {
  const marker = { lat: 0, lng: 0 };
  const conf = {
    isMapLoaded: false,
    markers: Ember.A(),
    map: {
      markers: [marker],
      addMarker: sinon.spy()
    }
  };

  subject.setProperties(conf);
  subject.setProperties({
    isMapLoaded: true, // allow sync to complete
    markers: Ember.A([marker]) // marker prop should === map[model]
  });

  assert.equal(conf.map.addMarker.called, false);
});

test('it should call `map.removeMarker` & `map.addMarker` when new marker at exsiting index', function(assert) {
  const markerOne = { lat: 1, lng: 1, radius: 1 };
  const markerTwo = { lat: 2, lng: 2, radius: 2 };
  const diffMarkerTwo = { lat: 2, lng: 2, radius: 3 }; // change radius
  const conf = {
    isMapLoaded: true,
    markers: Ember.A([markerOne, markerTwo]),
    map: {
      markers: [],
      addMarker: function() {},
      removeMarker: function() {}
    }
  };

  sinon.stub(conf.map, 'addMarker', function(marker) {
    subject.map.markers.push(marker);
    return marker;
  });

  sinon.stub(conf.map, 'removeMarker', function() {
    subject.map.markers.splice(1, 1);
  });

  subject._gmapMarkerBeforeRemoveChild = sinon.spy();

  // Add non-existant map children
  subject.setProperties(conf);
  assert.equal(conf.map.addMarker.called, true);

  // Add new array with new 2nd marker object
  subject.set('markers', Ember.A([markerOne, diffMarkerTwo]));
  assert.equal(conf.map.addMarker.callCount, 3);
  assert.equal(conf.map.removeMarker.callCount, 1);

  // assert new marker is at correct index
  assert.equal(conf.map.markers.pop().radius, diffMarkerTwo.radius);

  // Should of invoked `removeItem` config method
  assert.ok(subject._gmapMarkerBeforeRemoveChild.called);
});

test('it should trigger destroy on `willDestroyElement` event', function(assert) {
  subject._gmapMarkerDestroy = sinon.spy();
  subject.trigger('willDestroyElement');
  assert.ok(subject._gmapMarkerDestroy.calledOnce);
});
