import Ember from 'ember';

const { merge, uuid, on, computed, observer, isArray } = Ember;
const { capitalize } = Ember.String;

export default {
  create: function createChildCollection(settings) {
    const utils = this;
    const globalNamespace = '_gmap';
    const defaults = {
      namespace: `gMapChildCollection_${uuid()}`
    };
    const gmapCreate = {
      polygons:   'drawPolygon',
      markers:    'addMarker',
      polylines:  'drawPolyline',
      circles:    'drawCircle',
      rectangles: 'drawRectangle',
      overlays:   'drawOverlay',
      routes:     'drawRoute',
      controls:   'addControl'
    };

    settings = merge(defaults, settings);

    if(!settings.model) {
      throw new Error('childCollection requires a `model` string');
    }

    const namespace  = globalNamespace+capitalize(settings.namespace);
    const model      = settings.model;
    const removeItem = function(item, map) {
      if(settings.onRemoveItem) {
        settings.onRemoveItem(item, map);
      }

      if(item.setMap) {
        item.setMap(null);
      }

      return item;
    };
    const addedItem = settings.onAddedItem || function() {};

    return {
      [model]:                 Ember.A(),
      [namespace+'Props']:     settings.props,
      [namespace+'Events']:    settings.events,

      [namespace+'Validate']:  on('didInsertElement', settings.validate),

      [namespace+'OnDestroy']: on('willDestroyElement', settings.onDestroy),
      [`${namespace}Ids`]:     computed.map(`${model}.@each.id`, function(m) {
        if( !m.id ) { throw new Error(`${model} items require an id`); }
        return m.id;
      }),

      [`${namespace}Updated`]: computed(`${namespace}Ids`, {
        get: utils._wasModelUpdated(`${namespace}Ids`, model)
      }),

      [`${namespace}Sync`]:    observer('isMapLoaded', `${model}.@each.id`, function() {
        let parentModel    = this.get(model);
        const map          = this.get('map');
        const createMethod = gmapCreate[model];

        // If Items require syncing
        if(!this.get('isMapLoaded') || !this.get(`${namespace}Updated`)) { return; }

        // Remove (deleted) Items from GMap
        for(let i = 0, l = map[model].length; i < l; i++) {
          let item  = map[model][i];
          if(!item) { console.log(map[model], i); }
          let id    = item.details.id;

          if(utils._isItemRemoved(id, parentModel) === false) { 
            continue;
          }

          removeItem(item, map);

          // Remove Item from GMap store
          map[model].splice(i, 1);
          l--;
        }


        const confProps = this.getConfigParams(
          '_gmapChildEvents', // Set in configurables
          `${namespace}Props`,
          `${namespace}Events`
        );

        // Add (unadded) Item to GMap
        for(let i = 0, l = parentModel.length; i < l; i++) {
          let item = parentModel[i];
          let id   = item.id;

          // Child Item is already on map
          if( id && map.hasChild(id, model) ) { continue; }

          let config = this.getConfig(confProps, item);

          // Merge marker source data into marker.details
          config.details = merge(
            this.getModelProperties(item), 
            config.details || {}
          );

          const mapItem = map[createMethod](config);

          addedItem(item, mapItem, map);
        }
      })
    };
  },

  _isItemRemoved: function(id, models) {
    for(let i = 0, l = models.length; i < l; i++ ) {
      if(models[i].id === id) { return false; }
    }
    return true;
  },

  _wasModelUpdated: function wasModelUpdated(modelIdsKey, model) {
    return function() {
      if(!this.get('map')){ return false; }
      const _modelIds  = this.get(modelIdsKey);
      const mapModel   = this.get('map')[model];

      // Model were updated
      if(mapModel.length !== _modelIds.length) { return true; }

      for(let i = 0, l = mapModel.length; i < l; i++) {

        // Compare GMap marker id's to Model markers id's
        if(_modelIds.indexOf(mapModel[i].id) === -1) {
          return true; // Model were updated
        }
      }

      return false; // Model not updated
    };
  }
};
