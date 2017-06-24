import Controller from 'ember-controller';
import {A} from 'ember-array/utils';
import set from 'ember-metal/set';
import {assign} from 'ember-platform';
import computed from 'ember-computed';

import GoogleMapConstants from '../../../mixins/google-map-constants';

export default Controller.extend(GoogleMapConstants, {
  /**
   * Whether to use the instance `options` or top-level properties as configuration
   * @type {Boolean}
   */
  useOptions: false,

  mapDefaults: {
    lat: 32.75494243654723,
    lng: -86.8359375,
    zoom: 5
  },

  rectangleDefaults: Object.freeze({
    bounds: A([{lat: 29.80319254629092, lng: -80.935546875}, {lat: 33.79125047210739, lng: -86.912109375}]),
    strokeColor: '#1A954A',
    strokeOpacity: 1,
    strokeWeight: 3,
    fillColor: '#1A954A',
    fillOpacity: 0.2,
    draggable: true,
    editable: true,
  }),

  rectLat: computed.oneWay('options.bounds.0.lat'),
  rectLng: computed.oneWay('options.bounds.0.lng'),

  init() {
    this._super(...arguments);
    set(this, 'lat', this.mapDefaults.lat);
    set(this, 'lng', this.mapDefaults.lng);
    set(this, 'zoom', this.mapDefaults.zoom);
    set(this, 'options', assign({}, this.rectangleDefaults));
  }
});
