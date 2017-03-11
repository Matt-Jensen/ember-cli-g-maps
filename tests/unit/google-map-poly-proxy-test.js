import GoogleMapPolyProxy from 'dummy/google-map-poly-proxy';
import {module, test} from 'qunit';

module('Unit | Proxy | Google Map Poly');

test('it only allows setting a valid path value', function(assert) {
  const expected = [{lat: 2, lng: 2}];
  const instance = createInstance();

  assert.throws(() => instance.set('path', true), 'rejects non-array path');
  assert.throws(() => instance.set('path', [1, 2]), 'rejects array without LatLng literals');
  assert.throws(() => instance.set('path', [{lat: 1}]), 'rejects valid LatLng literal');

  instance.set('path', expected);
  assert.deepEqual(instance.get('path'), expected, 'updated path');
});

test('it never replaces the paths\' underlying MVCArray', function(assert) {
  const instance = createInstance();
  const expected = instance.content.getPath();

  instance.set('path', [{lat: 2, lng: 2}]);

  const actual = instance.content.getPath();
  assert.strictEqual(actual, expected, 'path MVCArray is the same instance');
});

test('it correctly updates coordinates of paths\' underlying MVCArray', function(assert) {
  const instance = createInstance();

  const expected = {lat: 3, lng: 3};
  instance.set('path', [{lat: 1, lng: 1}, {lat: 2, lng: 2}]);
  instance.set('path', [expected]);

  const pathMVC = instance.content.getPath();
  assert.equal(pathMVC.getLength(), 1, 'path MVCArray has correct length');

  const actual = pathMVC.getAt(0);
  assert.equal(actual.lat(), expected.lat, 'path MVCArray coordinate has updated lat');
  assert.equal(actual.lng(), expected.lng, 'path MVCArray coordinate has updated lng');
});

function createInstance() {
  return GoogleMapPolyProxy.create({
    content: new google.maps.Polygon()
  });
}
