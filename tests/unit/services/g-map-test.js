/* globals google: true */
import Ember               from 'ember';
import { moduleFor, test } from 'ember-qunit';
import sinon               from 'sinon';

moduleFor('service:g-map', 'Unit | Service | g map', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('it should throw an error if name is not a string', function(a) {
  const service = this.subject();

  a.throws(
    function() { return service.maps.add(2, {}); },
    new Error('GMap name must be a string')
  );
});

test('it should throw an error if a map with the same name exists', function(a) {
  const service = this.subject();

  service.maps.add('test-2', {});
  a.throws(
    function() { return service.maps.add('test-2', {}); },
    new Error('GMap name is taken, select a new GMap name')
  );
});

test('it should add,select a map to,from a private array', function(a) {
  const service = this.subject();

  service.maps.add('test-3', {});
  a.equal(service.maps.select('test-3').name, 'test-3');
});

test('it should provide an onLoad promise', function(a) {
  const service = this.subject();

  service.maps.add('test-4', {});
  a.ok(service.maps.select('test-4').onLoad instanceof Ember.RSVP.Promise);
});

test('it should create a deprecation warning when onLoad is invoked', function(a) {
  a.expect(1);
  
  const service = this.subject();
  const originalEmberWarning = Ember.Logger.warn;
  const originalAddListenerOnce = google.maps.event.addListenerOnce;

  google.maps.event.addListenerOnce = function(map, event, invoke) {
    invoke();
  };

  Ember.Logger.warn = sinon.spy();
  service.maps.add('test-5', {});

  service.maps.select('test-5').onLoad.then(function() {
    a.ok(Ember.Logger.warn.called);
    Ember.Logger.warn = originalEmberWarning;
    google.maps.event.addListenerOnce = originalAddListenerOnce;
  });
});

test('it should successfully remove map instance with `remove`', function(a) {
  const service = this.subject();

  service.maps.add('test-6', {});
  service.maps.remove('test-6');
  a.equal(service.maps.select('test-6'), undefined);
});
