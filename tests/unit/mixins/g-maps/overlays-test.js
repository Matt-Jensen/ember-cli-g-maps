import Ember              from 'ember';
import GMapsOverlaysMixin from 'ember-cli-g-maps/mixins/g-maps/overlays';
import { module, test }   from 'qunit';
import sinon              from 'sinon';

let subject;

module('Unit | Mixin | g maps/overlays', {
  beforeEach: function() {
    const GMapsOverlaysObject = Ember.Object.extend(GMapsOverlaysMixin, Ember.Evented);
    subject = GMapsOverlaysObject.create();
  }
});

test('it should trigger validate on `didInsertElement` event', function(assert) {
  subject._gmapOverlayValidate = sinon.spy();
  subject.trigger('didInsertElement');
  assert.ok(subject._gmapOverlayValidate.calledOnce);
});


test('it should throw an error when `overlays` property is not an Ember array', function(assert) {
  subject.set('overlays', {});

  assert.throws(
    function() { return subject._gmapOverlayValidate(); },
    new Error('g-maps component expects overlays to be an Ember Array')
  );
});

test('it should throw an error when `overlays.[].0` property is not an object', function(assert) {
  subject.set('overlays', Ember.A([ [] ]));

  assert.throws(
    function() { return subject._gmapOverlayValidate(); },
    new Error('g-maps overlay items must be objects')
  );
});

test('it should not add overlay when map is not loaded', function(assert) {
  const conf = {
    isMapLoaded: false, // Map is not loaded
    overlays: Ember.A(),
    map: {
      addOverlay: sinon.spy()
    }
  };

  subject.setProperties(conf);
  subject.get('overlays').pushObject({ lat: 1, lng: 1, content: 'test' });

  assert.equal(conf.map.addOverlay.called, false);
});


test('it should call `map.addOverlay` /w overlay when map child index empty', function(assert) {
  const overlay = { lat: 1, lng: 1, content: 'test' };
  const conf = {
    isMapLoaded: true,
    overlays: Ember.A(),
    map: {
      overlays: [],
      addOverlay: function() {}
    }
  };

  sinon.stub(conf.map, 'addOverlay', function(r) {
    subject.map.overlays.push(r);
    return r;
  });

  subject.setProperties(conf);
  subject.get('overlays').pushObject(overlay);

  assert.ok(conf.map.addOverlay.calledWith(overlay));
});


test('it should NOT call `map.addOverlay` when map child at index equals overlay at same index', function(assert) {
  const overlay = { lat: 1, lng: 1, content: 'test' };
  const conf = {
    isMapLoaded: false,
    overlays: Ember.A(),
    map: {
      overlays: [overlay],
      addOverlay: sinon.spy()
    }
  };

  subject.setProperties(conf);
  subject.setProperties({
    isMapLoaded: true, // allow sync to complete
    overlays: Ember.A([overlay]) // overlay should === map[model]
  });

  assert.equal(conf.map.addOverlay.called, false);
});


test('it should call `map.removeOverlay` & `map.addOverlay` when new overlay at exsiting index', function(assert) {
  const overlayOne     = { lat: 1, lng: 1, content: 'test' };
  const overlayTwo     = { id: 'two', lat: 2, lng: 2, content: 'test-two' };
  const diffOverlayTwo = { id: 'new-two', lat: 2, lng: 2, content: 'test-two' }; // change id
  const conf = {
    isMapLoaded: true,
    overlays: Ember.A([overlayOne, overlayTwo]),
    map: {
      overlays: [],
      addOverlay: function() {},
      removeOverlay: function() {}
    }
  };

  sinon.stub(conf.map, 'addOverlay', function(p) {
    subject.map.overlays.push(p);
    return p;
  });

  sinon.stub(conf.map, 'removeOverlay', function() {
    subject.map.overlays.splice(1, 1);
  });

  // Add non-existant map children
  subject.setProperties(conf);
  assert.equal(conf.map.addOverlay.called, true);

  // Add new array with new 2nd overlay object
  subject.set('overlays', Ember.A([overlayOne, diffOverlayTwo]));
  assert.equal(conf.map.addOverlay.callCount, 3);
  assert.equal(conf.map.removeOverlay.callCount, 1);

  // assert new overlay is at correct index
  assert.equal(conf.map.overlays.pop().id, diffOverlayTwo.id);
});
