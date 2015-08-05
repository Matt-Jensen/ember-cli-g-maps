/* globals GMaps, google */
import Ember from 'ember';

const { isArray, merge }   = Ember;
const { pluralize } = Ember.String;

export default function gMapsPrototypeExt() {
  GMaps.prototype.circles = [];

  GMaps.prototype.drawCircle = function(options) {
    options = merge({
      map: this.map,
      center: new google.maps.LatLng(options.lat, options.lng)
    }, options);

    delete options.lat;
    delete options.lng;

    var circle = new google.maps.Circle(options),
        circle_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

    for (var ev = 0; ev < circle_events.length; ev++) {
      (function(object, name) {
        if (options[name]) {
          google.maps.event.addListener(object, name, function(e){
            options[name].apply(this, [e]);
          });
        }
      })(circle, circle_events[ev]);
    }

    this.circles.push(circle);

    return circle;
  };


  GMaps.prototype.hasChild = function(id, type) {
    const model = this[ pluralize(type) ];

    if( !isArray(model) ) {
      throw new Error('hasChild requires a name to valid GMap model array');
    }

    for(let i = 0, l = model.length; i < l; i++ ) {
      if(model[i].details.id === id) {
        return true;
      }
    }
    return false;
  };
}
