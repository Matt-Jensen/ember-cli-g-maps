import Ember from 'ember';
import {assert} from 'ember-metal/utils';
import {assign} from 'ember-platform';
import {isPresent} from 'ember-utils';
import computed from 'ember-computed';
import {warn} from 'ember-debug';
import set from 'ember-metal/set';

import configuration from '../../configuration';

const CLICKALBE_LAYERS = ['overlayMouseTarget', 'floatPane'];
const BOUND_PROPERTIES = configuration.googleMapOverlayView.boundOptions;
const DEFAULTS = Object.freeze(assign(Ember.getProperties(
  configuration.propertyDefaults,
  'visible'
), {
  zIndex: 1,
  layer: 'overlayMouseTarget',
  style: {borderWidth: 0, position: 'absolute'}
}));

export const GoogleMapOverlayViewProxy = Ember.ObjectProxy.extend({
  /**
   * Default property values
   * @type {Object}
   */
  defaults: DEFAULTS,

  /**
   * Defines namespace used for assertions
   * @type {String}
   */
  name: 'g-map-overlay-view',

  /**
   * Marker position
   * @required
   * @type {Object}
   */
  position: computed({
    get() {
      const projection = this.content.getProjection();
      if (!projection) { return null; }
      const position = projection.fromContainerPixelToLatLng();
      return {lat: position.lat(), lng: position.lng()};
    },

    set(key, value) {
      assert(`${this.name} "position" is an Object`, typeof value === 'object');

      const {lat, lng} = value;
      assert(`${this.name} "position.lat" is a Number`, typeof lat === 'number' && lat === lat);
      assert(`${this.name} "position.lng" is a Number`, typeof lng === 'number' && lat === lat);

      this.content.position = value;
      if (this.content.isAddedToMap) { this.content.draw(); } // render update
      return value;
    }
  }).volatile(),

  /**
   * @type {Boolean}
   */
  visible: computed({
    get() {
      const {visible} = this.content;
      return isPresent(visible) ? visible : this.defaults.visible;
    },

    set(key, value) {
      if (!value) { value = false; }

      assert(`${this.name} "visible" is a Boolean`, typeof value === 'boolean');

      this.content.visible = value;
      if (this.content.isAddedToMap) { this.content.draw(); } // render update
      return value;
    }
  }),

  /**
   * @type {Number|Undefined}
   */
  zIndex: computed({
    get() {
      return this.content.zIndex;
    },

    set(key, value) {
      if (!value && value !== 0) {
        this.content.setOptions({zIndex: null}); // remove
        return;
      }

      assert(`${this.name} "zIndex" is a Number`, typeof value === 'number');
      assert(`${this.name} "zIndex" is a Whole Number`, value % 1 === 0);

      this.content.zIndex = value;
      if (this.content.isAddedToMap) { this.content.draw(); } // render update
      return value;
    }
  })
});

/**
 * Create a Google Maps OverlayView instance
 * @param  {Map|StreetViewPanorama} canvas
 * @param  {Object}                 options
 * @return {google.maps.OverlayView} overlay
 */
export function createOverlayView(canvas, options) {
  const settings = assign(assign({}, DEFAULTS), options);
  const overlay = new google.maps.OverlayView();

  overlay.setMap(canvas);
  overlay.position = settings.position;

  warn(
    `Setting Google Map Overlay View to an unclickable layer will cause your pointer actions to be ignored.\nPlease set: {{g-map-overlay-view layer="overlayMouseTarget"}}`,
    (settings.mouseEvents ? CLICKALBE_LAYERS.includes(settings.layer) : true),
    {id: `ember-cli-g-maps.g-map-overlay-view.factory.layer`}
  );

  Object.defineProperty(overlay, 'isAddedToMap', {
    configurable: false,
    get() {
      return Boolean(this.element);
    }
  });

  /**
   * Create DOM element and append them as children of configured layer
   * @return {google.maps.OverlayView} overlay
   */
  overlay.onAdd = function onAdd() {
    const element = this.element = document.createElement('div');
    element.innerHTML = options.innerHTML;

    Object.keys(settings.style).forEach((name) => {
      set(element, `style.${name}`, settings.style[name]);
    });

    const panes = (this.getPanes() || {});
    assert(`layer is a valid google.maps.MapPanes selection`, Boolean(panes[options.layer]));
    const overlayLayer = panes[options.layer];

    overlayLayer.appendChild(element);
    return overlay;
  };

  /**
   * Position and style the previously rendered Overlay View element
   * @return {google.maps.OverlayView} overlay
   */
  overlay.draw = function draw() {
    const projection = this.getProjection();
    const pixel = projection.fromLatLngToDivPixel(new google.maps.LatLng(
      this.position.lat, // bound option
      this.position.lng  // bound option
    ));

    const {verticalAlign, horizontalAlign} = settings;
    const verticalOffset = (settings.verticalOffset || 0);
    const horizontalOffset = (settings.horizontalOffset || 0);

    const {element} = this;
    const [content] = element.children;
    const {clientHeight, clientWidth} = content;

    if (verticalAlign === 'top') {
      element.style.top = `${pixel.y - clientHeight + verticalOffset}px`;
    } else if (verticalAlign === 'bottom') {
      element.style.top = `${pixel.y + verticalOffset}px`;
    } else {
      // NOTE default alignment: `middle`
      element.style.top = `${pixel.y - (clientHeight / 2) + verticalOffset}px`;
    }

    if (horizontalAlign === 'left') {
      element.style.left = `${pixel.x - clientWidth + horizontalOffset}px`;
    } else if (horizontalAlign === 'right') {
      element.style.left = `${pixel.x + horizontalOffset}px`;
    } else {
      // NOTE default alignment: `center`
      element.style.left = `${pixel.x - (clientWidth / 2) + horizontalOffset}px`;
    }

    // Set bound options: `visible` & `zIndex`
    element.style.display = (this.visible ? 'block' : 'none');
    element.style.zIndex = this.zIndex;

    return this;
  };

  /**
   * Remove previously rendered Overlay View element from the DOM
   * @return {google.maps.OverlayView} overlay
   */
  overlay.onRemove = function onRemove() {
    this.element.parentNode.removeChild(this.element);
    this.element = null;
    return this;
  };

  return overlay;
}

/**
 * Render a new Google Map OverlayView on a canvas with the given options
 * and return its' Google Map OverlayView Proxy instance
 * @param  {Map|StreetViewPanorama} canvas   Google Maps' Map or Street View Panorama
 * @param  {Object}                 options  Overlay View instance defaults (requires position, innerHTML, mouseEvents)
 * @return {ObjectProxy}  Ember.ObjectProxy instance
 */
export default function googleMapOverlayView(canvas, options = {}) {
  assert(
    'Google Map OverlayView requires a Google Map or Street View Panorama instance',
    canvas instanceof google.maps.Map || canvas instanceof google.maps.StreetViewPanorama
  );

  assert('Google Map OverlayView requires `innerHTML`', options.innerHTML);
  assert('Google Map OverlayView requires a `position`', options.position);
  assert('Google Map OverlayView requires a `mouseEvents` boolean declaration', typeof options.mouseEvents === 'boolean');

  const settings = assign(assign({}, DEFAULTS), options);
  const proxy = GoogleMapOverlayViewProxy.create({
    content: createOverlayView(canvas, settings)
  });

  // Set any configured bound options via proxy API
  BOUND_PROPERTIES.forEach((key) => {
    if (settings.hasOwnProperty(key)) {
      proxy.set(key, settings[key]);
    }
  });

  return proxy;
}
