/* globals google: true */
import Ember from 'ember';

const { computed } = Ember;

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat: 34.964248174211896,
      lng: -85.2078054060438,
      zoom: 5,
      polylines: Ember.A([
        {
          id: 'udfkasf-23jadfj-23kljfds',
          path: [
            [36.13552131660174, -86.82438302712399],
            [35.82399971421625, -84.2849538435438],
            [36.02399569836512, -83.45469237675371],
            [35.57168242716115, -82.95167101835864],
            [35.55934926996324, -82.56832440166113],
            [35.051082528086845, -81.98114328081238],
            [34.322154293996654, -83.23966528496362],
            [33.671703015361174, -84.51540147931985],
            [33.558625563057014, -86.58236815647496]
          ],
          strokeColor: '#D43029',
          strokeWeight: 8,
          editable: true,
          icons: [
            {
              icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
              offset: '100%'
            }
          ],
          set_at: function(polylinePath) {
            console.log(polylinePath);
            controller.set('polylines.[].0.path', getPaths(polylinePath));
          },
          insert_at: function(polylinePath) {
            controller.set('polylines.[].0.path', getPaths(polylinePath));
          },
          remove_at: function(polylinePath) {
            controller.set('polylines.[].0.path', getPaths(polylinePath));
          }
        }
      ]),

      polyline: computed.oneWay('polylines.[].0'),

      polylinePathStr: computed('polyline.path.[]', function() {
        return this.get('polylines.[].0.path').map((p) => `[${p[0]}, ${p[1]}]`).join(', ');
      })
    });
  }
});

function getPaths(paths) {
  const newPaths = [];
  paths.forEach((p) => newPaths.push([p.lat(), p.lng()]));
  return newPaths;
}