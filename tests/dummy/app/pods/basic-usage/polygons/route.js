import Ember from 'ember';

const { computed } = Ember;

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 5,
      polygons: Ember.A([
        {
          id: 'lakdj2-23klf-324lkd',
          editable: true,
          paths: [
            [34.84748359721185, -88.49430490212399],
            [33.702902055376036, -84.99747778496362],
            [31.711731375210594, -84.77907335431985],
            [31.521255572586213, -88.99936034397501],
            [32.939329395182014, -89.26768954918873]
          ],
          strokeColor: '#03a9f4',
          fillColor: '#03a9f4',
          draggable: true,
          dragstart: function() {
            controller.set('isPolygonDragging', true);
          },
          dragend: function() {
            controller.set('isPolygonDragging', false);
          },
          set_at: function(polygonPath) {
            controller.set('polygons.[].0.paths', getPaths(polygonPath));
          },
          insert_at: function(polygonPath) {
            controller.set('polygons.[].0.paths', getPaths(polygonPath));
          },
          remove_at: function(polygonPath) {
            controller.set('polygons.[].0.paths', getPaths(polygonPath));
          }
        }
      ]),

      polygon: computed.oneWay('polygons.[].0'),
      polygonPathStr: computed('polygon.paths.[]', function() {
        return this.get('polygon.paths').map((p) => `[${p[0]},${p[1]}]`).join(', ');
      }),
      isPolygonDragging: false
    });
  }
});

function getPaths(paths) {
  const newPaths = [];
  paths.forEach((p) => newPaths.push([p.lat(), p.lng()]));
  return newPaths;
}