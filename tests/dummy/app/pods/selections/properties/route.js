import Ember from 'ember';

const { computed } = Ember;

export default Ember.Route.extend({
  setupController(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 5,

      selections: {
        visible: true,
        rectangleOptions: {
          fillColor: '#288edf',
          fillOpacity: 0.4,
          strokeColor: '#6fb5f1',
          strokeOpacity: 1,
          strokeWeight: 3,
          strokePosition: 2
        },
        circleOptions: {
          fillColor: '#288edf',
          fillOpacity: 0.4,
          strokeColor: '#6fb5f1',
          strokeOpacity: 1,
          strokeWeight: 3,
          strokePosition: 2
        },
        polygonOptions: {
          fillColor: '#288edf',
          fillOpacity: 0.4,
          strokeColor: '#6fb5f1',
          strokeOpacity: 1,
          strokeWeight: 3,
          strokePosition: 2
        },
        polylineOptions: {
          strokeColor: '#6fb5f1',
          strokeOpacity: 1,
          strokeWeight: 3,
          strokePosition: 2
        }
      },
      inputSelectionsDelay: 400,
      selectionsDelay: computed('inputSelectionsDelay', function() { 
        return (parseInt(this.get('inputSelectionsDelay'), 10) || 1);
      }),
      selectionsMode: '',
      selectionsModes: Ember.A([
        'marker',
        'circle',
        'polygon',
        'polyline',
        'rectangle'
      ]),
      selectionsPosition: 'top',

      hasMarker: computed('selectionsModes.[]', function() {
        return !!(this.get('selectionsModes').filter((m) => m === 'marker').length);
      }),
      hasCirlce: computed('selectionsModes.[]', function() {
        return !!(this.get('selectionsModes').filter((m) => m === 'circle').length);
      }),
      hasPolygon: computed('selectionsModes.[]', function() {
        return !!(this.get('selectionsModes').filter((m) => m === 'polygon').length);
      }),
      hasPolyline: computed('selectionsModes.[]', function() {
        return !!(this.get('selectionsModes').filter((m) => m === 'polyline').length);
      }),
      hasRectangle: computed('selectionsModes.[]', function() {
        return !!(this.get('selectionsModes').filter((m) => m === 'rectangle').length);
      })
    });
  },

  _positions: ['top', 'top-left', 'top-right', 'left-top', 'right-top', 'left', 'left-center', 'right', 'right-center', 'left-bottom', 'right-bottom', 'bottom', 'bottom-center', 'bottom-left', 'bottom-right'],

  actions: {
    toggleMode(mode) {
      const selectionsModes = this.controller.get('selectionsModes');
      const modeIndex = selectionsModes.indexOf(mode);
      
      if (modeIndex >= 0) {
        // toggle off
        selectionsModes.removeAt(modeIndex);
      } else {
        // toggle on
        selectionsModes.pushObject(mode);
      }
    },
    toggleVisibile() {
      this.controller.set('selections.visible', !this.controller.get('selections.visible'));
    },
    randomSelectionsPosition() {
      const positions = this.get('_positions');
      this.controller.set('selectionsPosition', positions[getRandomInt(0, positions.length - 1)]);
    },
    randomSelectionsMode() {
      const modes = this.controller.get('selectionsModes');
      this.controller.set('selectionsMode', modes[getRandomInt(0, modes.length - 1)]);
    }
  }
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}