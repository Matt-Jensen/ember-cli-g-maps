import Ember from 'ember';
import computed from 'ember-computed';
import { assert } from 'ember-metal/utils';
import { assign } from 'ember-platform';

const MAP_DEFAULTS = {
  minZoom: 0,
  maxZoom: Infinity,
  clickableIcons: true,
  tilt: 0
};

export default function googleMap(element, options = {}) {
  const settings = assign({}, MAP_DEFAULTS);
  const map = new google.maps.Map(element, assign(settings, options));

  const proxy = Ember.ObjectProxy.extend({
    /**
     * @type {Object}
     * Update the center of the Google Map instance via LatLngLiterals
     */
    center: computed({
      get() {
        const center = this.content.getCenter();
        return { lat: center.lat(), lng: center.lng() };
      },

      set(key, {lat, lng}) {
        assert('center was set without a lat number', typeof lat === 'number');
        assert('center was set without a lng number', typeof lng === 'number');
        this.content.setCenter({lat, lng});
        return this.get('center');
      }
    }),

    /**
     * @type {Number}
     * Minimum map zoom level
     */
    minZoom: computed({
      get() {
        return this.content.minZoom;
      },

      set(key, minZoom) {
        assert('minZoom was set without number', typeof minZoom);
        assert('minZoom was set above maxZoom', minZoom < this.get('maxZoom'));
        return this.content.minZoom = minZoom;
      }
    }),

    /**
     * @type {Number}
     * Maximum map zoom level
     */
    maxZoom: computed({
      get() {
        return this.content.maxZoom;
      },

      set(key, maxZoom) {
        assert('maxZoom was set without number', typeof maxZoom);
        assert('maxZoom was set below minZoom', maxZoom > this.get('minZoom'));
        return this.content.maxZoom = maxZoom;
      }
    }),

    /**
     * @type {Number}
     * Google map instance zoom level
     */
    zoom: computed({
      get() {
        return this.content.getZoom();
      },

      set(key, zoom) {
        const min = this.get('minZoom');
        const max = this.get('maxZoom');

        assert('zoom was set without a number', typeof zoom === 'number');
        assert('zoom was set above maxZoom', zoom <= max);
        assert('zoom was set below minZoom', zoom >= min);

        this.content.setZoom(zoom);
        return this.get('zoom');
      }
    }),

    /**
     * @type {String}
     * Google Map type
     */
    mapTypeId: computed({
      get() {
        return this.content.getMapTypeId().toUpperCase();
      },

      set(key, mapTypeId) {
        const mapTypes = Object.keys(google.maps.MapTypeId);

        assert('mapTypeId was set without a string', typeof mapTypeId === 'string');
        assert('mapTypeId is not a valid map type', mapTypes.indexOf(mapTypeId.toUpperCase()) > -1);

        this.content.setMapTypeId(google.maps.MapTypeId[mapTypeId.toUpperCase()]);
        return this.get('mapTypeId');
      }
    }),

    /**
     * @type {Boolean}
     * Google Map POI icon clickablity
     */
    clickableIcons: computed({
      get() {
        return this.content.getClickableIcons();
      },

      set(key, clickableIcons) {
        assert('clickableIcons was set without a boolean', typeof clickableIcons === 'boolean');
        this.content.setClickableIcons(clickableIcons);
        return this.get('clickableIcons');
      }
    }),

    /**
     * @type {Number}
     * Google Map tilt view perspective
     */
    tilt: computed({
      get() {
        return this.content.getTilt();
      },

      set(key, tilt) {
        assert('tilt was set without a number', typeof tilt === 'number');
        assert('tilt is not `0` or `45`', tilt === 0 || tilt === 45);
        this.content.setTilt(tilt);
        return this.get('tilt');
      }
    })

    // heading number
    // - getHeading()
    // - setHeading()

    // disableDefaultUI Boolean
    // disableDoubleClickZoom Boolean
    // draggable Boolean
    // draggableCursor String
    // draggingCursor String
    // fullscreenControl Boolean
    // fullscreenControlOptions google.maps.FullscreenControlOptions
    // gestureHandling String
    // keyboardShortcuts Boolean
    // mapTypeControl Boolean
    // mapTypeControlOptions google.maps.MapTypeControlOptions
    // noClear Boolean
    // panControl Boolean
    // panControlOptions google.maps.PanControlOptions
    // rotateControl Boolean
    // rotateControlOptions google.maps.RotateControlOptions
    // scaleControl Boolean
    // scaleControlOptions google.maps.ScaleControlOptions
    // scrollwheel Boolean
    // signInControl Boolean
    // streetView google.maps.StreetViewPanorama
    // streetViewControl Boolean
    // streetViewControlOptions google.maps.StreetViewControlOptions
    // styles [google.maps.MapTypeStyle]
    // zoomControl Boolean
    // zoomControlOption google.maps.ZoomControlOptions
  });

  return proxy.create({ content: map });
}
