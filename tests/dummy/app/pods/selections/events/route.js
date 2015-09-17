import Ember from 'ember';

const { later } = Ember.run;

export default Ember.Route.extend({
  setupController(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 5,

      selections: {
        visible: true,
        rectangleOptions: {
          fillColor: '#288edf',
          fillOpacity: 0.4,
          strokeColor: '#6fb5f1',
          strokeOpacity: 1,
          strokeWeight: 3,
          strokePosition: 2
        },
        circleOptions: {
          fillColor: '#288edf',
          fillOpacity: 0.4,
          strokeColor: '#6fb5f1',
          strokeOpacity: 1,
          strokeWeight: 3,
          strokePosition: 2
        },
        polygonOptions: {
          fillColor: '#288edf',
          fillOpacity: 0.4,
          strokeColor: '#6fb5f1',
          strokeOpacity: 1,
          strokeWeight: 3,
          strokePosition: 2
        },
        polylineOptions: {
          strokeColor: '#6fb5f1',
          strokeOpacity: 1,
          strokeWeight: 3,
          strokePosition: 2
        }
      },

      markers: Ember.A(),
      circles: Ember.A(),
      polygons: Ember.A(),
      polylines: Ember.A(),
      rectangles: Ember.A()
    });
  },

  actions: {
    selectionsMarker(e) {
      later(() => {
        this.controller.get('markers').pushObject({
          id: `marker-${Ember.uuid()}`,
          lat: e.lat,
          lng: e.lng,
          icon: 'beachflag.png'
        });
      }, 500);
    },
    selectionsCircle(e) {
      later(() => {
        this.controller.get('circles').pushObject({
          id: `marker-${Ember.uuid()}`,
          lat: e.lat,
          lng: e.lng,
          radius: e.radius,
          fillOpacity: '0.1',
          fillColor: '#D43029',
          strokeColor: '#D43029'
        });
      }, 500);
    },
    selectionsRectangle(e) {
      later(() => {
        this.controller.get('rectangles').pushObject({
          id: `marker-${Ember.uuid()}`,
          bounds: [[e.bounds[1].lat, e.bounds[1].lng], [e.bounds[0].lat, e.bounds[0].lng]],
          strokeColor: '#1A954A',
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: '#1A954A',
          fillOpacity: 0.2,
        });
      }, 500);
    },
    selectionsPolygon(e) {
      later(() => {
        this.controller.get('polygons').pushObject({
          id: `marker-${Ember.uuid()}`,
          paths: e.coords.map((c) => [c.lat, c.lng]),
          strokeColor: '#F6D622',
          fillColor: '#F6D622'
        });
      }, 500);
    },
    selectionsPolyline(e) {
      later(() => {
        this.controller.get('polylines').pushObject({
          id: `marker-${Ember.uuid()}`,
          path: e.coords.map((c) => [c.lat, c.lng]),
          strokeColor: '#03a9f4',
          strokeOpacity: 1,
          strokeWeight: 6,
        });
      }, 500);
    }
  }
});