import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat:  -12.043333,
      lng:  -77.028333,
      zoom: 6,
      markers: Ember.A([
        {
          id: '1231darsa2',
          lat:  -12.043333,
          lng:  -77.028333,
          title: 'One',
          click: function(e) {
            console.log(e);
          }
        },
        {
          id: '7643darsa2',
          lat:  -12.5,
          lng:  -77.5,
          title: 'Two',
          click: function(e) {
            console.log(e);
          }
        }
      ])
    });
  },

  actions: {
    onClick: function(e) {
      const controller = this.controller;
      let markers = controller.markers;
      const id = Ember.uuid()+'-strigified';

      markers.pushObject({
        id,
        lat:  e.latLng.A,
        lng:  e.latLng.F,
        title: 'The title is -'+ id,
        click: function(e) {
          const m_id = e.details.id;

          for(let i = 0, l = markers.length; i < l; i++) {
            if(markers[i].id !== m_id) { continue; }

            markers.removeAt(i, 1);
            break;
          }

          console.log(markers.length);
        },
        infoWindow: {
          content: '<p>Mark that down!</p>',
          visible: true
        }
      });
    }
  }
});