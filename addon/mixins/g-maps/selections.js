/* globals google: true */
import Ember from 'ember';

const { on, observer, computed } = Ember;

export default Ember.Mixin.create({
  _drawingManager:     null,

  selectionsModes: [
    'marker',
    'circle',
    // 'polygon', <- Broken
    // 'polyline', <- Broken
    'rectangle'
  ],
  _gmapSelectionsModes: computed('selectionsModes', function() {
    const modes = [];
    const selectionsModes = this.get('selectionsModes').map((dm) => dm.toLowerCase());

    if(selectionsModes.indexOf('marker') > -1) {
      modes.push(google.maps.drawing.OverlayType.MARKER);
    }

    if(selectionsModes.indexOf('circle') > -1) {
      modes.push(google.maps.drawing.OverlayType.CIRCLE);
    }

    if(selectionsModes.indexOf('polygon') > -1) {
      modes.push(google.maps.drawing.OverlayType.POLYGON);
    }

    if(selectionsModes.indexOf('polyline') > -1) {
      modes.push(google.maps.drawing.OverlayType.POLYLINE);
    }

    if(selectionsModes.indexOf('rectangle') > -1) {
      modes.push(google.maps.drawing.OverlayType.RECTANGLE);
    }

    return modes;
  }),


  selectionsPosition: 'top',
  _gmapSelectionsPosition: computed('selectionsPosition', function() {
    let pos = 'TOP_CENTER';

    switch(Ember.String.dasherize(this.get('selectionsPosition')).toLowerCase()) {
      case 'top-left':
        pos = 'TOP_LEFT'; break;
      case 'top-right':
        pos = 'TOP_RIGHT'; break;
      case 'left-top':
        pos = 'LEFT_TOP'; break;
      case 'right-top':
        pos = 'RIGHT_TOP'; break;
      case 'left':
        pos = 'LEFT_CENTER'; break;
      case 'left-center':
        pos = 'LEFT_CENTER'; break;
      case 'right':
        pos = 'RIGHT_CENTER'; break;
      case 'right-center':
        pos = 'RIGHT_CENTER'; break;
      case 'left-bottom':
        pos = 'LEFT_BOTTOM'; break;
      case 'right-bottom':
        pos = 'RIGHT_BOTTOM'; break;
      case 'bottom':
        pos = 'BOTTOM_CENTER'; break;
      case 'bottom-center':
        pos = 'BOTTOM_CENTER'; break;
      case 'bottom-left':
        pos = 'BOTTOM_LEFT'; break;
      case 'bottom-right':
        pos = 'BOTTOM_RIGHT'; break;
    }

    return google.maps.ControlPosition[pos];
  }),


  selectionsMode:     '',
  _gmapSelectionsMode: computed('selectionsMode', function() {
    let mode = '';

    switch(this.get('selectionsMode').toLowerCase()) {
      case 'marker':
        mode = 'MARKER'; break;
      case 'circle':
        mode = 'CIRCLE'; break;
      case 'polygon':
        mode = 'POLYGON'; break;
      case 'polyline':
        mode = 'POLYLINE'; break;
      case 'rectangle':
        mode = 'RECTANGLE'; break;
    }

    return mode ? google.maps.drawing.OverlayType[mode] : null;
  }),


  // Added via `_validateSelections`
  // Observes ('isMapLoaded', 'selections')
  _setupSelections: function() {
    const continueSetup = (
      this.get('isMapLoaded') &&
      this.get('selections') &&
      this.get('googleMapsSupportsDrawingManager') &&
      !this.get('_drawingManager')
    );

    if(!continueSetup) { return; }

    const drawingManager = new google.maps.drawing.DrawingManager();
    this.set('_drawingManager', drawingManager);

    this.addObserver('drawManagerOptions', this, '_syncDrawMangagerOptions');
    // this.addObserver('selections', this, '_hideDrawManager');

    this._syncDrawMangagerOptions();

    drawingManager.setMap(this.get('map').map);

    // Remove observers added during `didInsertElement`
    this.removeObserver('isMapLoaded', this, '_setupSelections');
    this.removeObserver('selections', this, '_setupSelections');
  },


  drawManagerOptions: computed(
    'selections',
    'selections.drawingControlOptions.{position,drawingModes}',
    'selections.{drawingMode,drawingControl,markerOptions,circleOptions,polygonOptions,polylineOptions,rectangleOptions}',
    function() {
      const markerOptions    = this.get('selections.markerOptions');
      const circleOptions    = this.get('selections.circleOptions');
      const polygonOptions   = this.get('selections.polygonOptions');
      const polylineOptions  = this.get('selections.polylineOptions');
      const rectangleOptions = this.get('selections.rectangleOptions');

      const options = {
        drawingMode: this.get('_gmapSelectionsMode'),
        drawingControl: this.get('drawingControl'),
        drawingControlOptions: {
          position: this.get('_gmapSelectionsPosition'),
          drawingModes: this.get('_gmapSelectionsModes')
        }
      }

      if(markerOptions) {
        options.markerOptions = markerOptions;
      }

      if(circleOptions) {
        options.circleOptions = circleOptions;
      }

      if(polygonOptions) {
        options.polygonOptions = polygonOptions;
      }

      if(polylineOptions) {
        options.polylineOptions = polylineOptions;
      }

      if(rectangleOptions) {
        options.rectangleOptions = rectangleOptions;
      }

      console.log('drawManager options', options);
      return options;
    }
  ),


  // Added via `_setupSelections`
  // Observes ('drawManagerOptions')
  _syncDrawMangagerOptions: function() {
    Ember.run.throttle(this, this._setDrawingManagerOptions, 500);
  },

  _setDrawingManagerOptions: function() {
    console.log('synccy');
    return this.get('_drawingManager').setOptions(this.get('drawManagerOptions'));
  },


  googleMapsSupportsDrawingManager: computed(function() {
    return (
      google.maps &&
      google.maps.drawing && 
      google.maps.drawing.DrawingManager
    );
  }),


  _validateSelections: on('didInsertElement', function() {
    if(!this.get('selections')) { return; }

    if(!this.get('googleMapsSupportsDrawingManager')) {
      Ember.Logger.error('the g-map component requires the "drawing" library included in config/environment.js');
    }
    else {

      // Enable selections setup
      this.addObserver('isMapLoaded', this, '_setupSelections');
      this.addObserver('selections', this, '_setupSelections');
    }
  }),


  _teardownSelections: on('willDestroyElement', function() {
    const drawingManager = this.get('_drawingManager');

    if(drawingManager) {
      drawingManager.setMap(null);
      this.set('drawingManager', null);
    }
  })
});
