import Ember from 'ember';
import loadGoogleMaps from 'dummy/utils/load-google-maps';
import { module, test } from 'qunit';

const { RSVP } = Ember;
const { google } = window;
const { getLazyLoadSrc, lazyLoadGoogleMap } = loadGoogleMaps;

module('Unit | Utility | load google maps');

test('`getLazyLoadSrc` should return false when no map src found', (assert) => {
  const msg = 'returned negative result';
  const expected = false;
  const actualA = getLazyLoadSrc('#invalid-query');

  assert.equal(actualA, expected, msg);

  // Mock query result w/ empty `content` attribute
  const actualB = getLazyLoadSrc({ getAttribute: () => null });
  assert.equal(actualB, expected, msg);
});

test('`lazyLoadGoogleMap` should reject when no src provided', (assert) => {
  const msg = 'successfully rejected promise';

  return lazyLoadGoogleMap(null)
    .then(() => assert.ok(false, msg))
    .catch(() => assert.ok(true, msg));
});

test('`lazyLoadGoogleMap` should reject after failing to fetch Google Maps', (assert) => {
  const msg = 'successfully rejected promise';
  const originalGetScript = Ember.$.getScript;
  const getScriptStub = function () {
    const methods = {
      done: () => methods,
      fail: (reject) => {
        reject();
        return methods;
      }
    };

    return methods;
  };

  Ember.$.getScript = getScriptStub;

  return lazyLoadGoogleMap('//google-maps.com')
    .then(() => assert.ok(false, msg))
    .catch(() => {
      assert.ok(true, msg);
      Ember.$.getScript = originalGetScript;
    });
});

test('`lazyLoadGoogleMap` should resolve google.maps after successfully fetching', (assert) => {
  const msg = 'successfully resolved google.maps';
  const expected = google.maps;
  const originalGetScript = Ember.$.getScript;
  const getScriptStub = function () {
    const methods = {
      done: (resolve) => {
        resolve();
        return methods;
      },
      fail: () => methods
    };

    return methods;
  };

  Ember.$.getScript = getScriptStub;

  return lazyLoadGoogleMap('//google-maps.com')
    .then((actual) => {
      assert.equal(actual, expected, msg);
      Ember.$.getScript = originalGetScript;
    });
});

test('it should resolve google.maps immediately if globally avialable', (assert) => {
  const msg = 'resolved payload immediately';
  const expected = google.maps;
  const stubLazyLoadRequest = () => assert.ok(false, 'does not attempt lazy load');

  loadGoogleMaps.lazyLoadGoogleMap = stubLazyLoadRequest;

  return loadGoogleMaps()
    .then((actual) => assert.equal(actual, expected, msg))
    .catch(() => assert.ok(false, msg))
    .then(() => loadGoogleMaps.lazyLoadGoogleMap = lazyLoadGoogleMap);
});

test('it should return the same promise if google.maps is not available', (assert) => {
  const msg = 'promise is the same instance';
  const originalGoogleMaps = google.maps;
  google.maps = false;
  loadGoogleMaps.lazyLoadGoogleMap = () => new RSVP.Promise(() => {});

  const expected = loadGoogleMaps();
  const actual = loadGoogleMaps();
  assert.equal(actual, expected, msg);

  loadGoogleMaps.lazyLoadGoogleMap = lazyLoadGoogleMap;
  google.maps = originalGoogleMaps;
});
