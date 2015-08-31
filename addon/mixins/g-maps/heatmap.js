import Ember from 'ember';

const { computed, on, isArray } = Ember;

export default Ember.Mixin.create({
  heatmapRadius: null,
  heatmapOpacity: 1,
  heatmapVisible: true,
  heatmapGradient: null,
  heatmapDissipating: false,
  heatmapMarkers: null,


  /**
   * [_heatmap stores reference to google.maps.visualization.HeatmapLayer instance]
   * @type {[Object]}
   */
  _heatmap: null,


  /**
   * [_heatmapMarkersMVCArray stores reference to `_heatmap.data` MVC Array]
   * @type {[Google MVCArray]}
   */
  _heatmapMarkersMVCArray: null,


  /**
   * [_toJSArray converts any Ember Array instance to a JS Array]
   * @param  {[Array]} arr [Ember Array|JS Array]
   * @return {[Array]}     [JS Array]
   */
  _toJSArray: function(arr) {
    return (typeof arr.toArray === 'function' ? arr.toArray() : arr);
  },


  /**
   * [googleMapsSupportsHeatmap returns a boolean indicating if HeatmapLayer is supported]
   * @return {[Boolean]}
   */
  googleMapsSupportsHeatmap: computed(function() {
    return (
      google.maps &&
      google.maps.visualization &&
      google.maps.visualization.HeatmapLayer
    );
  }),


  /**
   * [_validateHeatmap determines if heatmap can instantiate, if so adds init observers]
   * @param  {[String]} )[triggered on element insertion]
   * @return {[Oberservers]}   [if valid adds obersvers to init method]
   */
  _validateHeatmap: on('didInsertElement', function() {
    if(!this.get('heatmapMarkers')) { return false; }

    if(!this.get('googleMapsSupportsHeatmap')) {
      throw new Error('the g-map component requires the "visualization" library included in `config/environment.js`');
    }
    else {

      // Enable Heatmap setup
      this.addObserver('isMapLoaded', this, '_initHeatmap');
      this.addObserver('heatmapMarkers', this, '_initHeatmap');
    }
  }),


  /**
   * [_initHeatmap runs once per heatmap instance instantiation]
   * [Added via `_validateHeatmap`]
   * [Observes ('isMapLoaded', 'heatmapMarkers')]
   */
  _initHeatmap: function() {
    const continueSetup = (
      this.get('isMapLoaded') &&
      this.get('heatmapMarkers') &&
      this.get('googleMapsSupportsHeatmap') &&
      !this.get('_heatmap')
    );

    if(!continueSetup) { return; }

    const googleMVCArray = new google.maps.MVCArray();
    this.set('_heatmapMarkersMVCArray', googleMVCArray);

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: googleMVCArray
    });

    this.set('_heatmap', heatmap);

    this.addObserver('heatmapMarkers.[]', this, '_syncHeatmapMarkers');
    this._syncHeatmapMarkers();

    this.addObserver('heatmapRadius', this, '_syncHeatmapRadius');
    this._syncHeatmapRadius();

    this.addObserver('heatmapDissipating', this, '_syncHeatmapDissipating');
    this._syncHeatmapDissipating();

    this.addObserver('heatmapOpacity', this, '_syncHeatmapOpacity');
    this._syncHeatmapOpacity();

    this.addObserver('heatmapGradient.[]', this, '_syncHeatmapGradient');
    this._syncHeatmapGradient();

    this.addObserver('heatmapVisible', this, '_syncHeatmapVisible');
    this._syncHeatmapVisible();

    // Remove Init observers
    this.removeObserver('isMapLoaded', this, '_initHeatmap');
    this.removeObserver('heatmapMarkers', this, '_initHeatmap');
  },


  /**
   * [_teardownHeatmap removes the heatmap from the map, clears up memory, and unbinds any events]
   * @param  {[String]} [triggered on element destroy]
   */
  _teardownHeatmap: on('willDestroyElement', function() {
    const heatmap = this.get('_heatmap');

    if(heatmap) {
      heatmap.setMap(null);
      delete heatmap.data;
      this.set('_heatmap', null);
      this.set('_heatmapMarkersMVCArray', null);
    }
  }),


  /**
   * [_syncHeatmapMarkers syncs data of `heatmapMarkers` array to the heatmap.data's MVC Array]
   * [Added via `_initHeatmap`]
   * [Observes ('heatmapMarkers.[]')]
   */
  _syncHeatmapMarkers: function() {
    const heatmapMarkers = this._toJSArray(this.get('heatmapMarkers') || []);
    const mvcArray = this.get('_heatmapMarkersMVCArray');

    if(heatmapMarkers[0]) {

      // is an object without a location array
      if(!isArray(heatmapMarkers[0]) && !isArray(heatmapMarkers[0].location)) {
        throw new Error('`heatmapMarkers` must be an array of objects with a location array');
      }
      // is something other than an array of array/objects
      else if(typeof heatmapMarkers[0] !== 'object') {
        throw new Error('`heatmapMarkers` must be an array of arrays');
      }
    }

    heatmapMarkers.forEach((hm, i) => {
      const lat = (isArray(hm) ? hm[0] : hm.location[0]);
      const lng = (isArray(hm) ? hm[1] : hm.location[1]);
      const current = mvcArray.getAt(i);
      const marker = {};

      // if index is out of sync
      if(!current || current.location.lat() !== lat || current.location.lng() !== lng) {

        marker.location = new google.maps.LatLng(lat, lng);

        // Optional `weight` parameter
        if(hm.weight) { marker.weight = hm.weight; }

        // create and set new LatLng instance
        mvcArray.setAt(i, marker);
      }
    });

    // Remove latLng's from end of mvcArray until length is the same
    while(mvcArray.length > heatmapMarkers.length) {
      mvcArray.pop();
    }
  },

  _syncHeatmapRadius: function() {
    const radius = (typeof this.heatmapRadius === 'number' ? this.heatmapRadius : null);
    const heatmap = this.get('_heatmap');

    if(!heatmap) { return false; }

    heatmap.set('radius', radius);
  },

  _syncHeatmapVisible: function() {
    const heatmap = this.get('_heatmap');
    const visible = this.get('heatmapVisible');

    if(!heatmap) { return false; }

    heatmap.setMap(visible ? this.get('map').map : null);
  },

  _syncHeatmapDissipating: function() {
    const heatmap = this.get('_heatmap');
    const dissipating = this.get('heatmapDissipating');

    if(!heatmap) { return false; }

    heatmap.set('dissipating', dissipating);
  },

  _syncHeatmapOpacity: function() {
    const heatmap = this.get('_heatmap');
    const opacity = (typeof this.heatmapOpacity === 'number' ? this.heatmapOpacity : 1);

    if(!heatmap) { return false; }

    heatmap.set('opacity', opacity);
  },

  _syncHeatmapGradient: function() {
    const heatmap = this.get('_heatmap');
    const gradient = (isArray(this.heatmapGradient) ? this._toJSArray(this.heatmapGradient) : null);

    if(!heatmap) { return false; }

    heatmap.set('gradient', gradient);
  }
});
