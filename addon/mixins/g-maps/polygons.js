/* globals GMaps google */
import Ember         from 'ember';
import gmapChild     from 'ember-cli-g-maps/utils/g-maps/g-map-child';
import Configurables from 'ember-cli-g-maps/mixins/g-maps/configurables';

const { on, computed, observer, merge, isArray } = Ember;

export default Ember.Mixin.create(Configurables, {
  polygons: Ember.A(),


  ///////////////////////////
  // Polygon Configurables
  //////////////////////////

  _gmapPolygonProps: [
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

  _gmapPolygonEvents: [
    'mousemove'
  ],


  validatePolygons: on('didInsertElement', function() {
    const polygons = this.get('polygons');
    if(polygons && !isArray(polygons)) {
      throw new Error('g-maps component expects polygons to be an Ember Array');
    }
  }),


  destroyMarkers: on('willDestroyElement', function() { }),


  _polygonIds: computed.map('polygons.@each.id', function(polygon) {
    if( !polygon.id ) { throw new Error('Polygon items require an id'); }
    return polygon.id;
  }),


  _polygonsUpdated: computed('_polygonIds', {
    get: gmapChild.wasModelUpdated('_polygonIds', 'polygons')
  }),


  _syncPolygons: observer('isMapLoaded', 'polygons.@each.id', function() {
    let polygons = this.get('polygons');
    const map    = this.get('map');

    console.log(this.get('_polygonsUpdated'));

    // If polygons should sync
    if(!this.get('isMapLoaded') || !this.get('_polygonsUpdated')) { return; }

    const confProps = this.getConfigParams(
      '_gmapChildEvents',
      '_gmapPolygonProps',
      '_gmapPolygonEvents'
    );

    for(let i = 0, l = polygons.length; i < l; i++) {
      let p = polygons[i];
      let id = p.id;

      // Polygon is already on map
      if( id && map.hasChild(id, 'polygon') ) { continue; }

      let config = this.getConfig(confProps, p);

      // Merge marker source data into marker.details
      config.details = merge(
        this.getModelProperties(p), 
        config.details || {}
      );

      const polygon = map.drawPolygon(config);

      // More stuff
    }
  })




});
