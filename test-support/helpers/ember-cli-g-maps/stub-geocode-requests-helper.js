import RSVP from 'rsvp';
import Ember from 'ember';
import getOwner from 'ember-owner/get';
import { assert, copy } from 'ember-metal/utils';
import run from 'ember-runloop';

const { Logger } = Ember;
const ORIGINAL_GEOCODE = GMaps.prototype.geocode;
const IS_PHANTOMJS_ENV = (typeof window === 'object' && window.hasOwnProperty('_phantom'));

export default function(app, config = {}) {
  const onlyPhantomJS = Boolean(config.onlyPhantomJS);

  // Abandon if only stubbing phantomJS
  if (onlyPhantomJS && IS_PHANTOMJS_ENV === false) { return; }

  assert('A results array is required', config.results && config.results instanceof Array && config.results.length);

  let stubs;
  if (config.results[0] instanceof Array) {
    // Clone 2 demensional array
    stubs = config.results.map((results) => results.map(toPlaceResult));
  } else {
    // Clone 1 demensional into 2 demensional array
    stubs = [config.results.map(toPlaceResult)];
  }

  assert('Geocode stubbed requests are still unresolved', ORIGINAL_GEOCODE === GMaps.prototype.geocode);

  let stubIndex = 0;

  /*
   * Stub GMaps geocode
   */
  GMaps.prototype.geocode = function geocodeStub({ callback }) {
    run(() => {
      callback(stubs[stubIndex], 'OK');
      stubIndex += 1;

      if (stubIndex >= stubs.length) {
        GMaps.prototype.geocode = ORIGINAL_GEOCODE;
      }
    });
  };
}

export function toPlaceResult(result) {
  const clone = copy(result, true);
  clone.geometry = (clone.geometry || {});
  clone.geometry.location = (clone.geometry.location || {});

  if (clone.hasOwnProperty('lat') && typeof clone.geometry.location.lat !== 'function') {
    clone.geometry.location.lat = () => clone.lat;
  }

  if (clone.hasOwnProperty('lng') && typeof clone.geometry.location.lng !== 'function') {
    clone.geometry.location.lng = () => clone.lng;
  }

  if (clone.hasOwnProperty('address') && !clone.formatted_address) {
    clone.formatted_address = clone.address;
  }

  return clone;
}
