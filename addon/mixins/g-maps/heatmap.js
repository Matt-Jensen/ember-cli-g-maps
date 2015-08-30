import Ember from 'ember';

export default Ember.Mixin.create({
  _heatmap: null,
  heatmapMarkers: Ember.A(),

  _heatMarkersMVC: computed(function() {
      let signatures = this.get('signatures');

      if( signatures.length ) { 
        signatures = signatures.map((m) => { 
          return new google.maps.LatLng(m.get('lat'), m.get('lng'));
        }).toArray();
      }

      return new google.maps.MVCArray( signatures );
    }
  ),

  googleMapsSupportsHeatmap: computed(function() {
    return (
      google.maps &&
      google.maps.visualization &&
      google.maps.visualization.HeatmapLayer
    );
  }),

  _initHeatmap: on('didInsertElement', function() {
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.get('_heatMarkersMVC')
    });

    heatmap.setMap( this.googleObject );
    heatmap.set('radius', 40);

    this.set('_heatmap', heatmap);
  }),

  _updateHeatmap: observer('isMapLoaded', 'signatures.[]', function() {
    const heatmap = this.get('_heatmap');

    if( heatmap && this.get('isMapLoaded') ) {
      heatmap.data = this.get('_heatMarkersMVC');
    }
  }),
});
