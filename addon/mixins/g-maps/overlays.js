import Ember           from 'ember';
import childCollection from 'ember-cli-g-maps/utils/g-maps/child-collection';

const { isArray } = Ember;

export default Ember.Mixin.create(
  childCollection.create({
    model: 'overlays',

    namespace: 'overlay',

    /* Supported:
    props: [ 'clickable', 'draggable', 'editable', 'fillColor', 'fillOpacity', 'geodesic', 'paths', 'strokeColor', 'strokeOpacity', 'strokePosition', 'strokeWeight', 'visible', 'zIndex' ],

    events: [ 'click', 'rightclick', 'dblclick', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'mousemove' ],
    */

    validate: function validatePolygons() {
      const overlays = this.get('overlays');

      if(!overlays) { return; } // validation not necessary

      if(!isArray(overlays)) {
        throw new Error('g-maps component expects overlays to be an Ember Array');
      }

      // End validation
      if(!overlays[0]) { return; }

      // Reminder for well formed polygon paths
      if(typeof overlays[0] !== 'object' || isArray(overlays[0])) {
        throw new Error('g-maps overlay items must be objects');
      }
    }
  })
);
