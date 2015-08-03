import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat:  -12.043333,
      lng:  -77.028333,
      zoom: 4,
      markers: Ember.A([
        {id: '1231darsa2', lat:  -12.043333, lng:  -77.028333, title: 'One', click: function(e) {console.log(e); } }, 
        {id: '7643darsa2', lat:  -12.5, lng:  -77.5, title: 'Two', click: function(e) {console.log(e); } }
      ]),
      ploygons: Ember.A([
        {}
      ])
    });

    // window.setInterval(() => {
    //   let lat = controller.get('lat')+ 0.5;
    //   controller.set('lat', lat);
    //   console.log(lat, 'upward');
    // }, 1000);
  },

  actions: {
    onClick: function(e) {
      const controller = this.controller;
      let markers = controller.markers;
      const id = Ember.uuid()+'-ember-g-map-id';

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