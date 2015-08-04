/* globals GMaps google */
import Ember           from 'ember';
import childCollection from 'ember-cli-g-maps/utils/g-maps/child-collection';


const { isArray } = Ember;

export default Ember.Mixin.create(
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

    events: [
      'click',
      'rightclick',
      'dblclick',
      'drag',
      'dragend',
      'dragstart',
      'mousedown',
      'mouseout',
      'mouseover',
      'mouseup',
      'mousemove'
    ],

    validate: function() {
      const polygons = this.get('polygons');
      if(polygons && !isArray(polygons)) {
        throw new Error('g-maps component expects polygons to be an Ember Array');
      }
    },

    onDestroy: function() {}
  })
);
