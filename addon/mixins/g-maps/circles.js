import Ember from 'ember';
import childCollection from 'ember-cli-g-maps/utils/g-maps/child-collection';

const { isArray } = Ember;

export default Ember.Mixin.create(
  childCollection.create({
    model: 'circles',

    namespace: 'circle',

    /* Supported:
    props: [ 'lat', 'lng', 'clickable', 'draggable', 'editable', 'fillColor', 'fillOpacity', 'radius', 'strokeColor', 'strokeOpacity', 'strokePosition', 'visible', 'zIndex' ],

    events: [ 'center_changed', 'click', 'dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'radius_changed', 'rightclick' ],
    */

    validate: function validateCircles() {
      const circles = this.get('circles');
      if(circles && !isArray(circles)) {
        throw new Error('g-maps component expects circles to be an Ember Array');
      }
    }
  })
);
