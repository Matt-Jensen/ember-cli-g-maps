import Ember from 'ember';
import loadGoogleMaps from 'ember-cli-g-maps/utils/load-google-maps';

const { later } = Ember.run;
const { on, computed, isArray } = Ember;

export default Ember.Mixin.create({

  // Stores reference to google DrawingManager instance
  _drawingManager: null,


  /**
   * [selectionsDelay time it takes to remove last selection from the map]
   * @type {Number}
   */
  selectionsDelay: null,


  // Default to all supported mode
  selectionsModes: [
    'marker',
    'circle',
    'polygon',
    'polyline',
    'rectangle'
  ],


  /**
   * [_gmapSelectionsModes]
   * @param  {String}  [observes `selectionsModes` binding options]
   * @return {[Array]} [Returns array of matched google OverlayType's]
   */
  _gmapSelectionsModes: computed('selectionsModes.[]', function() {
    const modes = [];

    if(isArray(this.get('selectionsModes')) === false) {
      Ember.Logger.error('`selectionsModes` property expects an array');
    }

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


  // Default to controls on top
  selectionsPosition: 'top',

  /**
   * [_gmapSelectionsPosition ]
   * @param  {String}            [observes `selectionsPosition` binding]
   * @return {[ControlPosition]} [Returns matching google ControlPosition]
   */
  _gmapSelectionsPosition: computed('selectionsPosition', function() {
    let pos = 'TOP_CENTER';

    if(typeof this.get('selectionsPosition') !== 'string') {
      Ember.Logger.error('`selectionsPosition` property expects a string');
    }

    switch(Ember.String.dasherize(this.get('selectionsPosition').replace('_', '-')).toLowerCase()) {
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


  // Default to no active selection tool
  selectionsMode: '',

  /**
   * [_gmapSelectionsMode]
   * @param  {String}             [observes `selectionsMode` binding]
   * @return {[OverlayType|null]} [Returns matching google OverlayType]
   */
  _gmapSelectionsMode: computed('selectionsMode', function() {
    let mode = '';

    if(typeof this.get('selectionsMode') !== 'string') {
      Ember.Logger.error('`selectionsMode` property expects a string');
    }

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

    return (mode ? google.maps.drawing.OverlayType[mode] : null);
  }),


  // Stores reference to `overlaycomplete` event
  _selectionsEventOverlayComplete: null,


  /**
   * [_initSelections runs once per selections instance instantiation]
   * [Added via `_validateSelections`]
   * [Observes ('isMapLoaded', 'selections')]
   */
  _initSelections: function() {
    const continueSetup = (
      this.get('isMapLoaded') &&
      this.get('selections') &&
      this.get('googleMapsSupportsDrawingManager') &&
      !this.get('_drawingManager')
    );

    if(!continueSetup) { return; }

    // Create DrawingManager Instance and store
    const drawingManager = new google.maps.drawing.DrawingManager();
    this.set('_drawingManager', drawingManager);

    // Watch for changes to selections configuration and inital sync
    this.addObserver('_drawManagerOptions', this, '_syncDrawingMangagerOptions');
    this._syncDrawingMangagerOptions();

    // Add the drawing manager to the map
    drawingManager.setMap(this.get('map').map);

    let lastSelection;

    // Bind selection events
    const overlayListener = google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {

      // Prohibit simultanious selections
      if(lastSelection && lastSelection.map) {
        lastSelection.setMap(null);
      }

      lastSelection = event.overlay;

      if (event.type === google.maps.drawing.OverlayType.MARKER) {
        this.send('selectionsMarker', event.overlay);
      }
      else if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
        this.send('selectionsCircle', event.overlay);
      }
      else if(event.type === google.maps.drawing.OverlayType.RECTANGLE) {
        this.send('selectionsRectangle', event.overlay);
      }
      else if(event.type === google.maps.drawing.OverlayType.POLYGON) {
        this.send('selectionsPolygon', event.overlay);
      }
      else if(event.type === google.maps.drawing.OverlayType.POLYLINE) {
        this.send('selectionsPolyline', event.overlay);
      }

      // Remove the last drawing from map
      later(() => { event.overlay.setMap(null); }, this.get('selectionsDelay') || 400);
    });

    // create reference to event
    this.set('_selectionsEventOverlayComplete', overlayListener);

    // Add listener to sync user selection of map drawing controls
    this.$().on('click', '.gmnoprint > div', Ember.run.bind(this, this._syncDrawingManagerModeControls));

    // Remove observers added during `didInsertElement`
    this.removeObserver('isMapLoaded', this, '_initSelections');
    this.removeObserver('selections', this, '_initSelections');
  },


  /**
   * [Return the configuration object for the drawingManager]
   * @param  {[Strings]}  [Observes all relevant properties on `selections` config]
   * @return {[Object]}   [Drawing Manager Configuration Object]
   */
  _drawManagerOptions: computed(
    'selections',
    '_gmapSelectionsMode',
    '_gmapSelectionsModes',
    '_gmapSelectionsPosition',
    'selections.{visible,markerOptions,circleOptions,polygonOptions,polylineOptions,rectangleOptions}',
    function() {
      const isVisible        = this.get('selections.visible');
      const markerOptions    = this.get('selections.markerOptions');
      const circleOptions    = this.get('selections.circleOptions');
      const polygonOptions   = this.get('selections.polygonOptions');
      const polylineOptions  = this.get('selections.polylineOptions');
      const rectangleOptions = this.get('selections.rectangleOptions');

      const options = {
        drawingMode: this.get('_gmapSelectionsMode'),
        drawingControl: (typeof isVisible === 'boolean' ? isVisible : true), // Shows or hides draw manager
        drawingControlOptions: {
          position: this.get('_gmapSelectionsPosition'),
          drawingModes: this.get('_gmapSelectionsModes')
        }
      };

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

      return options;
    }
  ),


  /**
   * [_syncDrawingMangagerOptions finally sets the options on the drawManager instance]
   * [Added via `_initSelections`]
   * [Observes ('_drawManagerOptions')]
   */
  _syncDrawingMangagerOptions: function() {
    return this.get('_drawingManager').setOptions(this.get('_drawManagerOptions'));
  },


  /**
   * [_syncDrawingManagerModeControls get active drawingMode and bind to parent, enforces string type if falsey]
   */
  _syncDrawingManagerModeControls: function() {
    const mode = this.get('_drawingManager').drawingMode || '';
    this.set('selectionsMode', mode);
  },


  /**
   * [googleMapsSupportsDrawingManager returns a boolean indicating if DrawingManager is supported]
   * @return {[Boolean]}
   */
  googleMapsSupportsDrawingManager: computed(function() {
    return (
      google.maps &&
      google.maps.drawing &&
      google.maps.drawing.DrawingManager
    );
  }),


  /**
   * [_validateSelections determines if selections can instantiate, if so adds init observers]
   * @param  {[String]} )[triggered on element insertion]
   * @return {[Oberservers]} [if valid adds obersvers to init method]
   */
  _validateSelections: on('didInsertElement', function() {
    return loadGoogleMaps()
      .then(() => {
        if(!this.get('selections')) { return false; }

        if(!this.get('googleMapsSupportsDrawingManager')) {
          throw new Error('g-map component requires the "drawing" library included in `config/environment.js`');
        }
        else {

          // Enable selections setup
          this.addObserver('isMapLoaded', this, '_initSelections');
          this.addObserver('selections', this, '_initSelections');
        }
      });
  }),


  /**
   * [_teardownSelections removes the draw manager from the map, clears up memory, and unbinds events]
   * @param  {[String]} [triggered on element destroy]
   */
  _teardownSelections: on('willDestroyElement', function() {
    const drawingManager = this.get('_drawingManager');

    if(drawingManager) {
      drawingManager.setMap(null);
      this.set('drawingManager', null);

      // Remove overlay complete listener
      this.get('_selectionsEventOverlayComplete').remove();
      this.set('_selectionsEventOverlayComplete', null);

      // Remove select control sync listener
      this.$().off('click', '.gmnoprint > div');
    }
  }),

  actions: {
    selectionsMarker: function(marker) {
      this.sendAction('selectionsMarker', {
        marker,
        lat: marker.position.lat(),
        lng: marker.position.lng()
      });
    },

    selectionsCircle: function(circle) {
      this.sendAction('selectionsCircle', {
        circle,
        radius: circle.getRadius(),
        lat: circle.center.lat(),
        lng: circle.center.lng()
      });
    },

    selectionsRectangle: function(rectangle) {
      const ne = rectangle.bounds.getNorthEast();
      const sw = rectangle.bounds.getSouthWest();

      this.sendAction('selectionsRectangle', {
        rectangle,
        bounds: [
          { lat: ne.lat(), lng: ne.lng(), location: 'northeast' }, // Northeast
          { lat: sw.lat(), lng: sw.lng(), location: 'southwest' }  // Southwest
        ]
      });
    },

    selectionsPolygon: function(polygon) {
      let pathTarget = polygon.latLngs.getArray()[0];

      if(typeof pathTarget.getArray === 'function') {
        pathTarget = pathTarget.getArray();
      }

      this.sendAction('selectionsPolygon', {
        polygon,
        coords: pathTarget.map((c) => { return { lat: c.lat(), lng: c.lng() }; })
      });
    },

    selectionsPolyline: function(polyline) {
      let pathTarget = polyline.latLngs.getArray()[0];

      if(typeof pathTarget.getArray === 'function') {
        pathTarget = pathTarget.getArray();
      }

      this.sendAction('selectionsPolyline', {
        polyline,
        coords: pathTarget.map((c) => { return { lat: c.lat(), lng: c.lng() }; })
      });
    }
  }
});
