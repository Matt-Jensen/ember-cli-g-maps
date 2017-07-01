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
    lat: 30.2672,
    lng: -97.74310000000003,
    zoom: 5
  },

  rectangleDefaults: Object.freeze({
    bounds: A([{lat: 28.382, lng: -94.935}, {lat: 32.584, lng: -100.623046875}]),
    clickable: true,
    draggable: true,
    editable: true,
    fillColor: '#1A954A',
    fillOpacity: 0.2,
    strokeColor: '#1A954A',
    strokeOpacity: 1,
    strokeWeight: 3,
    strokePosition: 'CENTER',
    visible: true,
    zIndex: 1
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
