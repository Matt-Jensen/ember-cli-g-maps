import Ember                from 'ember';
import GMapsRectanglesMixin from 'ember-cli-g-maps/mixins/g-maps/rectangles';
import { module, test }     from 'qunit';
import sinon                from 'sinon';

let subject;

module('Unit | Mixin | g maps/rectangles', {
  beforeEach: function() {
    const GMapsRectanglesObject = Ember.Object.extend(GMapsRectanglesMixin, Ember.Evented);
    subject = GMapsRectanglesObject.create();
  }
});

test('it should trigger validate on `didInsertElement` event', function(assert) {
  subject._gmapRectangleValidate = sinon.spy();
  subject.trigger('didInsertElement');
  assert.ok(subject._gmapRectangleValidate.calledOnce);
});


test('it should throw an error when `rectangles` property is not an Ember array', function(assert) {
  subject.set('rectangles', {});

  assert.throws(
    function() { return subject._gmapRectangleValidate(); },
    new Error('g-maps component expects rectangles to be an Ember Array')
  );
});

test('it should throw an error when `rectangles.[].0.bounds` property is not an array', function(assert) {
  subject.set('rectangles', Ember.A([{ bounds: [ {} ] }]));

  assert.throws(
    function() { return subject._gmapRectangleValidate(); },
    new Error('g-maps rectangle bounds property expects Array of Arrays: [[lat, lng]]')
  );
});

test('it should sync on `isMapLoaded` and updates to `rectangles` model', function(assert) {
  subject.set('rectangles', Ember.A());
  
  // Replace sync with spy
  subject._gmapRectangleSync = Ember.observer(subject._gmapRectangleSync.__ember_observes__, sinon.spy());

  subject.set('isMapLoaded', true);
  assert.equal(subject._gmapRectangleSync.callCount, 1);

  subject.get('rectangles').pushObject({ bounds: [[1, 1]] });
  assert.equal(subject._gmapRectangleSync.callCount, 2);
});


test('it should not add rectangle when map is not loaded', function(assert) {
  const conf = {
    isMapLoaded: false, // Map is not loaded
    rectangles: Ember.A(),
    map: {
      addRectangle: sinon.spy()
    }
  };

  subject.setProperties(conf);
  subject.get('rectangles').pushObject({ bounds: [[1, 1]] });

  assert.equal(conf.map.addRectangle.called, false);
});


test('it should call `map.addRectangle` with rectangle when map child index does not exist yet', function(assert) {
  const rectangle = { bounds: [[1, 1]] };
  const conf = {
    isMapLoaded: true,
    rectangles: Ember.A(),
    map: {
      rectangles: [],
      addRectangle: function() {}
    }
  };

  sinon.stub(conf.map, 'addRectangle', function(r) {
    subject.map.rectangles.push(r);
    return r;
  });

  subject.setProperties(conf);
  subject.get('rectangles').pushObject(rectangle);

  assert.ok(conf.map.addRectangle.calledWith(rectangle));
});


test('it should NOT call `map.addRectangle` when map child at index equals rectangle at same index', function(assert) {
  const rectangle = { bounds: [[1, 1]] };
  const conf = {
    isMapLoaded: false,
    rectangles: Ember.A(),
    map: {
      rectangles: [rectangle],
      addRectangle: sinon.spy()
    }
  };

  subject.setProperties(conf);
  subject.setProperties({
    isMapLoaded: true, // allow sync to complete
    rectangles: Ember.A([rectangle]) // rectangle should === map[model]
  });

  assert.equal(conf.map.addRectangle.called, false);
});


test('it should call `map.removeRectangle` & `map.addRectangle` when new rectangle at exsiting index', function(assert) {
  const rectangleOne = { bounds: [[1, 1]] };
  const rectangleTwo = { id: 'two', bounds: [[2, 2]] };
  const diffRectangleTwo = { id: 'new-two', bounds: [[2, 2]] }; // change id
  const conf = {
    isMapLoaded: true,
    rectangles: Ember.A([rectangleOne, rectangleTwo]),
    map: {
      rectangles: [],
      addRectangle: function() {},
      removeRectangle: function() {}
    }
  };

  sinon.stub(conf.map, 'addRectangle', function(p) {
    subject.map.rectangles.push(p);
    return p;
  });

  sinon.stub(conf.map, 'removeRectangle', function() {
    subject.map.rectangles.splice(1, 1);
  });

  // Add non-existant map children
  subject.setProperties(conf);
  assert.equal(conf.map.addRectangle.called, true);

  // Add new array with new 2nd rectangle object
  subject.set('rectangles', Ember.A([rectangleOne, diffRectangleTwo]));
  assert.equal(conf.map.addRectangle.callCount, 3);
  assert.equal(conf.map.removeRectangle.callCount, 1);

  // assert new rectangle is at correct index
  assert.equal(conf.map.rectangles.pop().id, diffRectangleTwo.id);
});
