import Ember from 'ember';

const { computed, uuid } = Ember;
const defaultAddress = '716 Richard Arrington Jr Blvd N, Birmingham, AL';

export default Ember.Route.extend({
  gMap: Ember.inject.service(),

  setupController(controller) {
    this._makeGeoRequest({ address: defaultAddress });

    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 5,
      geocode: defaultAddress,
      isRequesting: true,
      markers: Ember.A(),
      results: Ember.A(),
      suggestions: computed('results.[]', function() {
        return controller.get('results').filter((r) => {
          return r && r.formatted_address;
        }).map((r) => r.formatted_address);
      })
    });
  },

  actions: {
    click(e) {
      const controller = this.controller;
      if(controller.get('isRequesting')) { return; }

      this._makeGeoRequest({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    },

    searchGeocode(address) {
      this._makeGeoRequest({ address });
    }
  },

  _makeGeoRequest(req) {
    const controller = this.controller;

    controller.set('isRequesting', true);

    this.get('gMap')
      .geocode(Ember.merge(req, {
          "language" : 'ja'
      }))
      .then((results) => {
        controller.setProperties({
          markers: Ember.A(results.map(this._geocodeToMarker)),
          results: Ember.A(results),
          isRequesting: false
        });

        if(results.length) {
          controller.set('geocode', results[0].formatted_address);
        } else {
          controller.set('geocode', '');
        }

        return results;
      })
      .then(this._refocusMapViewport.bind(this))
      .catch(this._handleGeocodeError);
  },

  _refocusMapViewport(results) {
    if(results.length) {
      this.controller.setProperties({
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng()
      });
    }

    return results;
  },

  _geocodeToMarker(geocode, index) {
    const marker = {
      id: `marker-id-${uuid()}`,
      lat: geocode.geometry.location.lat(),
      lng: geocode.geometry.location.lng()
    };

    if(typeof index === 'number') { marker.label = `${index}`; }

    return marker;
  },

  _handleGeocodeError(err) {
    console.error(err);
    alert(err.status);
  }
});