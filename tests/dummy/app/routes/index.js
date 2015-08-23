import Ember from 'ember';

const { bind } = Ember.run;
const pathToAlabama = [[35.0041, -88.1955], [34.9918, -85.6068], [32.8404, -85.1756], [32.2593, -84.8927], [32.1535, -85.0342], [31.7947, -85.1358], [31.52,   -85.0438], [31.3384, -85.0836], [31.2093, -85.107], [31.0023, -84.9944], [30.9953, -87.6009], [30.9423, -87.5926], [30.8539, -87.6256], [30.6745, -87.4072], [30.4404, -87.3688], [30.1463, -87.524], [30.1546, -88.3864], [31.8939, -88.4743], [34.8938, -88.1021], [34.9479, -88.1721], [34.9107, -88.1461]];

export default Ember.Route.extend({
  gMap: Ember.inject.service(),

  setupController: function(controller) {
    Ember.run.scheduleOnce('afterRender', this, function() {
      const mapHelper = this.get('gMap').maps.select('main-map');
      if( !mapHelper ) { return; }
      mapHelper.onLoad.then(function() {
        console.info('Google map has finished loading!');
      });
    });

    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 4,
      draggable: true,
      mapType: 'roadMap',
      markers: Ember.A([
        {
          id: 'jdlkfajs22',
          lat: 33.516674497188255,
          lng: -86.80091857910156,
          infoWindow: { content: '<p>Birmingham</p>',
          visible: true },
          click: function() {console.log('Boo Boo Boo'); }
        },
        {
          id: 'jdlkfajs23',
          lat: 34.516674497188255,
          lng: -85.80091857910156,
        }
      ]),
      polygons: Ember.A([
        {
          id: 'lka234klafj23', 
          paths: pathToAlabama,
          zIndex: 10
        }
      ]),
      circles: Ember.A([
        {
          id: 'lfkjasd23faj2f31',
          lat: 32.75494243654723,
          lng: -86.8359375,
          radius: 500000,
          fillOpacity: '0.1',
          fillColor: 'red',
          zIndex: 9,
          click: bind(this, function(e, circle) { 
            console.log('I miss \'ole\' \'bamy once again and I think it\'s a sin'); 
            console.log('Route context:', this);
            console.log('Event data:', e);
            console.log('Circle data:', circle);
          })
        }
      ]),
      polylines: Ember.A([
        {
          id: 'jlkasdjfww-dfkad-oadfkj-sadf322',
          strokeColor: 'blue',
          strokeOpacity: 1,
          strokeWeight: 6,
          path: [
            [34.22088697429015, -100.72265625],
            [33.78371305547283, -92.8125],
            [35.94688293218141, -94.833984375],
            [32.45879106783458, -95.712890625],
            [33.78371305547283, -92.8125]
          ],
          editable: true,
          mouseup: function(e, polyline) {
            console.log('done editing. Here\'s new polyline path:', polyline.getPath());
          }
        }
      ]),
      rectangles: Ember.A([
        {
          bounds: [[40.300476079749465, -102.3046875],[26.258936094468414, -73.828125]],
          strokeColor: 'green',
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: 'green',
          fillOpacity: 0.2,
          click: function(e, rectangle) {
            console.log('Big wheels keep on turnin\'', e, rectangle);
          }
        }
      ]),
      selections: {
        visible: true,
        circleOptions: {
          fillColor: getRandomColor(),
          fillOpacity: 1,
        }
      }
    });

    // window.setInterval(() => {
    //   let lat = controller.get('lat')+ 0.5;
    //   controller.set('lat', lat);
    //   console.log(lat, 'upward');
    // }, 1000);
  },

  actions: {
    selctionsBinding: function() {
      this.controller.set('selections.circleOptions.fillColor', getRandomColor());
    },

    selectionsMarker: function(marker) {
      console.log('marker selection', marker);
    },

    selectionsCircle: function(circle) {
      console.log('circular selection', circle);
    },

    selectionsRectangle: function(rectangle) {
      console.log('rectangular selection', rectangle);
    },

    selectionsPolygon: function(polygon) {
      console.log('polygon selection', polygon);
    },

    selectionsPolyline: function(polyline) {
      console.log('polyline selection', polyline);
    },

    hideMapSelections: function() {
      this.controller.set('selections.visible', !this.controller.get('selections.visible'));
    },

    onClickRectangle: function(e) {
      const color = getRandomColor();
      const rectangles = this.controller.get('rectangles');

      rectangles.pushObject({
        id: 'jafs3239-kdafj32-dajfk332',
        bounds: [[e.latLng.A - 5, e.latLng.F - 5], [e.latLng.A + 5, e.latLng.F + 5]],
        strokeColor: color,
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: color,
        fillOpacity: 0.2,
        click: function(e, rect) {
          const rect_id = rect.id;

          // Remove marker
          for(let i = 0, l = rectangles.length; i < l; i++) {
            if(rectangles[i].id !== rect_id) { continue; }

            rectangles.removeAt(i, 1);
            break;
          }
        }
      });
    },

    onClickPolygons: function() {
      const controller = this.controller;

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

    onCircleClick: function() {
      const controller = this.controller;
      let circles      = controller.get('circles');

      // circles.removeAt(0);

      // const rand = Math.round(Math.random() * (circles.length - 1) + 0);

      controller.get('circles').pushObject({
        id: 'zfkj234d23faj2f31-'+Ember.uuid(),
        lat: (Math.random() * (55 - 22) + 22),
        lng: (Math.random() * (-102 - -115) + -115),
        radius: (Math.random() * (500000 - 10000) + 10000),
        fillOpacity: (Math.random() * (1 - 0) + 0),
        fillColor: getRandomColor(),
        zIndex: 9,
        click: function(e, cir) {
          const cir_id = cir.id;

          // Remove marker
          for(let i = 0, l = circles.length; i < l; i++) {
            if(circles[i].id !== cir_id) { continue; }

            circles.removeAt(i, 1);
            break;
          }
        }
      });

      // controller.circles.arrayContentDidChange(circles.length - 1, null, 1);
    },

    onClickMarkers: function(e) {
      const controller = this.controller;
      let markers      = controller.markers;
      const markerId   = Ember.uuid()+'-ember-g-map-id';

      e.mapIdle.then(function() {
        console.log(e.latLng.A, e.latLng.F);
      });


      // Relocate a random marker in markers
      // const rand = Math.round(Math.random() * (markers.length - 1) + 0);
      // if(markers[rand]) {
      //   markers[rand].lat = (Math.random() * (55 - 22) + 22);
      //   markers[rand].lng = (Math.random() * (-102 - -115) + -115);
      // }

      // Add One Marker
      markers.pushObject({
        id: markerId,
        lat:  e.latLng.A,
        lng:  e.latLng.F,
        title: 'The title is -'+ markerId,
        click: function(e) {
          const m_id = e.id;
          // Remove marker
          for(let i = 0, l = markers.length; i < l; i++) {
            if(markers[i].id !== m_id) { continue; }

            markers.removeAt(i, 1);
            break;
          }
        },
        infoWindow: {
          content: '<p>Here I come, Alabama!</p>',
          visible: true
        }
      });

      // Mix up All Markers
      // controller.set('markers', Ember.A(markers.map((m, i) => {
      //   const rand = Math.round(Math.random() * (markers.length - 1) + 0);
      //   return Ember.merge(m, {
      //     lat: (Math.random() * (55 - 22) + 22),
      //     lng: (Math.random() * (-102 - -115) + -115)
      //   });
      // })));

      // controller.markers.arrayContentDidChange(markers.length - 1, null, 1);
    },

    removeAllMarkers: function() {
      this.controller.set('markers', Ember.A([]));
    }
  }
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}