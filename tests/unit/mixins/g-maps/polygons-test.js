import Ember              from 'ember';
import GMapsPolygonsMixin from 'ember-cli-g-maps/mixins/g-maps/polygons';
import { module, test }   from 'qunit';
import sinon              from 'sinon';

let subject;

module('Unit | Mixin | g maps/polygons', {
  beforeEach: function() {
    const GMapsPolygonsObject = Ember.Object.extend(GMapsPolygonsMixin, Ember.Evented);
    subject = GMapsPolygonsObject.create();
  }
});

test('it should trigger validate on `didInsertElement` event', function(assert) {
  subject._gmapPolygonValidate = sinon.spy();
  subject.trigger('didInsertElement');
  assert.ok(subject._gmapPolygonValidate.calledOnce);
});


test('it should throw an error when `polygons` property is not an Ember array', function(assert) {
  subject.set('polygons', {});

  assert.throws(
    function() { return subject._gmapPolygonValidate(); },
    new Error('g-maps component expects polygons to be an Ember Array')
  );
});

test('it should throw an error when `polygons.[].0.paths` property is not an array', function(assert) {
  subject.set('polygons', Ember.A([{ paths: [ {} ] }]));

  assert.throws(
    function() { return subject._gmapPolygonValidate(); },
    new Error('g-maps polygon paths expects Array of Arrays: [[lat, lng]]')
  );
});

test('it should not add polygon when map is not loaded', function(assert) {
  const conf = {
    isMapLoaded: false, // Map is not loaded
    polygons: Ember.A(),
    map: {
      addPolygon: sinon.spy()
    }
  };

  subject.setProperties(conf);
  subject.get('polygons').pushObject({ paths: [[1, 1]] });

  assert.equal(conf.map.addPolygon.called, false);
});


test('it should call `map.addPolygon` with polygon when map child index does not exist yet', function(assert) {
  const polygon = { paths: [[1, 1]] };
  const conf = {
    isMapLoaded: true,
    polygons: Ember.A(),
    map: {
      polygons: [],
      addPolygon: function() {}
    }
  };

  sinon.stub(conf.map, 'addPolygon', function(p) {
    subject.map.polygons.push(p);
    return p;
  });

  subject.setProperties(conf);
  subject.get('polygons').pushObject(polygon);

  assert.ok(conf.map.addPolygon.calledWith(polygon));
});


test('it should NOT call `map.addPolygon` when map child at index equals polygon at same index', function(assert) {
  const polygon = { paths: [[1, 1]] };
  const conf = {
    isMapLoaded: false,
    polygons: Ember.A(),
    map: {
      polygons: [polygon],
      addPolygon: sinon.spy()
    }
  };

  subject.setProperties(conf);
  subject.setProperties({
    isMapLoaded: true, // allow sync to complete
    polygons: Ember.A([polygon]) // polygon should === map[model]
  });

  assert.equal(conf.map.addPolygon.called, false);
});


test('it should call `map.removePolygon` & `map.addPolygon` when new polygon at exsiting index', function(assert) {
  const polygonOne = { paths: [[1, 1]] };
  const polygonTwo = { id: 'two', paths: [[2, 2]] };
  const diffPolygonTwo = { id: 'new-two', paths: [[2, 2]] }; // change id
  const conf = {
    isMapLoaded: true,
    polygons: Ember.A([polygonOne, polygonTwo]),
    map: {
      polygons: [],
      addPolygon: function() {},
      removePolygon: function() {}
    }
  };

  sinon.stub(conf.map, 'addPolygon', function(p) {
    subject.map.polygons.push(p);
    return p;
  });

  sinon.stub(conf.map, 'removePolygon', function() {
    subject.map.polygons.splice(1, 1);
  });

  // Add non-existant map children
  subject.setProperties(conf);
  assert.equal(conf.map.addPolygon.called, true);

  // Add new array with new 2nd polygon object
  subject.set('polygons', Ember.A([polygonOne, diffPolygonTwo]));
  assert.equal(conf.map.addPolygon.callCount, 3);
  assert.equal(conf.map.removePolygon.callCount, 1);

  // assert new polygon is at correct index
  assert.equal(conf.map.polygons.pop().id, diffPolygonTwo.id);
});
