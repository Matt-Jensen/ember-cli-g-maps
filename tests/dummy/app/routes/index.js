import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat:  -12.043333,
      lng:  -77.028333,
      zoom: 4,
      markers: Ember.A([
        {id: '1231darsa2', lat:  -12.043333, lng:  -77.028333, title: 'One', click: function(e) {console.log(e); } }, 
        {id: '7643darsa2', lat:  -12.5, lng:  -77.5, title: 'Two', click: function(e) {console.log(e); }, hugs: true }
      ]),
      polygons: Ember.A([
        {
          id: 'lka234klafj23', 
          paths: [
            [-0.19226038138120835, -120.498046875],
            [1.0381511983133254, -104.0625],
            [-9.725300127953915, -95.185546875],
            [-14.365512629178598, -112.060546875],
            [-7.204450551811732, -126.03515625]
          ]
        }
      ])
    });

    // window.setInterval(() => {
    //   let lat = controller.get('lat')+ 0.5;
    //   controller.set('lat', lat);
    //   console.log(lat, 'upward');
    // }, 1000);
  },

  actions: {
    onClickPolygons: function(e) {
      const controller = this.controller;
      let polygons     = controller.polygons;

      controller.set('polygons', Ember.A());

      Ember.run.later(() => {
        controller.get('polygons').pushObject({
          id: 'ldfa3fadkafa32234klafj23', 
          paths: [
            [-0.19226038138120835, -120.498046875],
            [1.0381511983133254, -104.0625],
            [-9.725300127953915, -95.185546875],
            [-14.365512629178598, -112.060546875],
            [-7.204450551811732, -126.03515625]
          ]
        });
      }, 1000);
    },

    onClickMarkers: function(e) {
      const controller = this.controller;
      let markers      = controller.markers;
      const id         = Ember.uuid()+'-ember-g-map-id';

      console.log(e.latLng.A, e.latLng.F);

      // Mix up Markers
      // controller.set('markers', Ember.A(markers.map((m, i) => {
      //   const mid = Ember.uuid()+'-ember-g-map-id';
      //   return {
      //     id: mid,
      //     lat: e.latLng.A + (i * 0.5),
      //     lng: e.latLng.F + (i * 0.5)
      //   }
      // })));

      // Add One Marker
      markers.pushObject({
        id,
        lat:  e.latLng.A,
        lng:  e.latLng.F,
        title: 'The title is -'+ id,
        click: function(e) {
          const m_id = e.details.id;
          // Remove marker
          for(let i = 0, l = markers.length; i < l; i++) {
            if(markers[i].id !== m_id) { continue; }

            markers.removeAt(i, 1);
            break;
          }
        },
        infoWindow: {
          content: '<p>Mark that down!</p>',
          visible: true
        }
      });
    }
  }
});