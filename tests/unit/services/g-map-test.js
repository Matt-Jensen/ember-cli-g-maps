import { moduleFor, test } from 'ember-qunit';

let service;

moduleFor('service:g-map', 'Unit | Service | g map', {
  beforeEach: function() {
    service = this.subject();
  }
});

test('it should throw an error if name is not a string', function(assert) {
  assert.throws(
    function() { return service.maps.add(2, {}); },
    new Error('GMap name must be a string')
  );
});

test('it should throw an error if a map with the same name exists', function(assert) {
  service.maps.add('test-2', {});
  assert.throws(
    function() { return service.maps.add('test-2', {}); },
    new Error('GMap name is taken, select a new GMap name')
  );
});

test('it should add,select a map to,from a private array', function(assert) {
  service.maps.add('test-3', {});
  assert.equal(service.maps.select('test-3').name, 'test-3');
});

test('it should provide an onLoad promise', function(assert) {
  service.maps.add('test-4', {});
  assert.ok(service.maps.select('test-4').onLoad instanceof Promise);
});

test('it should successfully remove map instance with `remove`', function(assert) {
  service.maps.add('test-5', {});
  service.maps.remove('test-5');
  assert.equal(service.maps.select('test-5'), undefined);
});