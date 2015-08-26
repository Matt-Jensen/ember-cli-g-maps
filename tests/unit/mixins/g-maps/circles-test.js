import Ember             from 'ember';
import GMapsCirclesMixin from 'ember-cli-g-maps/mixins/g-maps/circles';
import { module, test }  from 'qunit';
import sinon             from 'sinon';

let subject;

module('Unit | Mixin | g maps/circles', {
  beforeEach: function() {
    const GMapsCirclesObject = Ember.Object.extend(GMapsCirclesMixin, Ember.Evented);
    subject = GMapsCirclesObject.create();
  }
});


test('it should trigger validate on `didInsertElement` event', function(assert) {
  subject._gmapCircleValidate = sinon.spy();
  subject.trigger('didInsertElement');
  assert.ok(subject._gmapCircleValidate.calledOnce);
});


test('it should throw an error when `circles` property is not an Ember array', function(assert) {
  subject.set('circles', {});

  assert.throws(
    function() { return subject._gmapCircleValidate(); },
    new Error('g-maps component expects circles to be an Ember Array')
  );
});


test('it should sync on `isMapLoaded` and updates to `circles` model', function(assert) {
  subject.set('circles', Ember.A());
  
  // Replace sync with spy
  subject._gmapCircleSync = Ember.observer(subject._gmapCircleSync.__ember_observes__, sinon.spy());

  subject.set('isMapLoaded', true);
  assert.equal(subject._gmapCircleSync.callCount, 1);

  subject.get('circles').pushObject({ lat: 0, lng: 0, radius: 1 });
  assert.equal(subject._gmapCircleSync.callCount, 2);
});


test('it should not add circle when map is not loaded', function(assert) {
  const conf = {
    isMapLoaded: false, // Map is not loaded
    circles: Ember.A(),
    map: {
      addCircle: sinon.spy()
    }
  };

  subject.setProperties(conf);
  subject.get('circles').pushObject({ lat: 0, lng: 0, radius: 1 });

  assert.equal(conf.map.addCircle.called, false);
});


test('it should call `map.addCircle` with circle when map child index does not exist yet', function(assert) {
  const circle = { lat: 0, lng: 0, radius: 1 };
  const conf = {
    isMapLoaded: true,
    circles: Ember.A(),
    map: {
      circles: [],
      addCircle: function() {}
    }
  };

  sinon.stub(conf.map, 'addCircle', function(c) {
    subject.map.circles.push(c);
    return c;
  });

  subject.setProperties(conf);
  subject.get('circles').pushObject(circle);

  assert.ok(conf.map.addCircle.calledWith(circle));
});


test('it should NOT call `map.addCircle` when map child at index equals circle at same index', function(assert) {
  const circle = { lat: 0, lng: 0, radius: 1 };
  const conf = {
    isMapLoaded: false,
    circles: Ember.A(),
    map: {
      circles: [circle],
      addCircle: sinon.spy()
    }
  };

  subject.setProperties(conf);
  subject.setProperties({
    isMapLoaded: true, // allow sync to complete
    circles: Ember.A([circle]) // circle should === map[model]
  });

  assert.equal(conf.map.addCircle.called, false);
});


test('it should call `map.removeCircle` & `map.addCircle` when new circle at exsiting index', function(assert) {
  const circleOne = { lat: 1, lng: 1, radius: 1 };
  const circleTwo = { lat: 2, lng: 2, radius: 2 };
  const diffCircleTwo = { lat: 2, lng: 2, radius: 3 }; // change radius
  const conf = {
    isMapLoaded: true,
    circles: Ember.A([circleOne, circleTwo]),
    map: {
      circles: [],
      addCircle: function() {},
      removeCircle: function() {}
    }
  };

  sinon.stub(conf.map, 'addCircle', function(c) {
    subject.map.circles.push(c);
    return c;
  });

  sinon.stub(conf.map, 'removeCircle', function() {
    subject.map.circles.splice(1, 1);
  });

  // Add non-existant map children
  subject.setProperties(conf);
  assert.equal(conf.map.addCircle.called, true);

  // Add new array with new 2nd circle object
  subject.set('circles', Ember.A([circleOne, diffCircleTwo]));
  assert.equal(conf.map.addCircle.callCount, 3);
  assert.equal(conf.map.removeCircle.callCount, 1);

  // assert new circle is at correct index
  assert.equal(conf.map.circles.pop().radius, diffCircleTwo.radius);
});
