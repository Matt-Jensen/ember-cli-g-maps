/* globals GMaps google */
import Ember           from 'ember';
import Configurables   from 'ember-cli-g-maps/mixins/g-maps/configurables';
import childCollection from 'ember-cli-g-maps/utils/g-maps/child-collection';


const { isArray } = Ember;

export default Ember.Mixin.create(
  Configurables,
  childCollection.create({
    model: 'polygons',

    namespace: 'polygon',

    props: [
      'clickable',
      'draggable',
      'editable',
      'fillColor',
      'fillOpacity',
      'geodesic',
      'map',
      'paths',
      'strokeColor',
      'strokeOpacity',
      'strokePosition',
      'strokeWeight',
      'visible',
      'zIndex'
    ],

    events: ['mousemove'],

    validate: function() {
      const polygons = this.get('polygons');
      if(polygons && !isArray(polygons)) {
        throw new Error('g-maps component expects polygons to be an Ember Array');
      }
    },

    onDestroy: function() {}
  })
);
