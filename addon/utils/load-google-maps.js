import Ember from 'ember';

const { RSVP } = Ember;

/**
 * Get the content of element referencing the Google Maps src
 * @param {String} query [location of HTML element]
 * @return {String|Boolean}
 */
export function getLazyLoadSrc(query = 'meta[name="ember-cli-g-maps-url"]') {
  const $meta = Ember.$(query);

  if ($meta.length === 0) {
    return false;
  }

  // Return content property or bust
  return ($meta.attr('content') || false);
}

/**
 * Request Google Maps script and promise result
 * @param {String} src
 * @return {Promise}
 */
export function lazyLoadGoogleMap(src) {
  if (!src) {
    return RSVP.Promise.reject(); // Google Maps source undefined
  }

  return new RSVP.Promise((resolve, reject) => {
    Ember.$.getScript(src)
      .success(function emberCliGMapsLazyLoadSuccess() {
        resolve(window.google.maps);
      })
      .fail(function emberCliGMapsLazyLoadFailure(jqXhr) {
        reject(jqXhr); // resolve error
      });
  });
}

export default (function () {
  let googleMapPromise;

  /**
   * Attempts to resolve global `google.maps` -> then attempts lazy load -> otherwise rejects
   * @type {Function} loadGoogleMaps
   * @return {Promise}
   * - @resolve {Object} google.maps
   */
  return function loadGoogleMaps() {

    /**
     * Resolve available global google.maps
     */

    if (typeof google === 'object' && typeof google.maps === 'object') {
      return RSVP.Promise.resolve(window.google.maps); // Google maps is loaded
    }

    /**
     * Resolve existing `googleMapsPromise` or initiate lazy load
     */

    if (typeof googleMapPromise === 'undefined') {
      googleMapPromise = lazyLoadGoogleMap( getLazyLoadSrc() );
    }

    return googleMapPromise;
  };
})();
