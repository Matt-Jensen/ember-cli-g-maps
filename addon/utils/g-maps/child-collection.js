
import Ember        from 'ember';
import configurator from 'ember-cli-g-maps/utils/g-maps/configurator';

const { merge, uuid, on, computed, observer } = Ember;
const { capitalize } = Ember.String;

export default {
  create: function createChildCollection(settings) {
    const utils           = this;
    const noop            = function() {};
    const globalNamespace = '_gmap';

    const defaults = {
      namespace: `gMapChildCollection_${uuid()}`
    };

    // TODO: Make these configurable
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

    const namespace = globalNamespace+capitalize(settings.namespace);
    const model     = settings.model;

    // TODO: abstract instance methods
    const removeItem = function(item, map) {
      if(item.setMap) {
        item.setMap(null);
      }

      if(settings.onRemoveItem) {
        settings.onRemoveItem(item, map);
      }

      return item;
    };
    const addedItem = settings.onAddedItem || noop;

    /////////////////////////////////////////
    // Child Collection Mixin Configuration
    ////////////////////////////////////////

    return {

      /**
       * Reference to the GMap instance store
       */
      [model]: Ember.A(),


      /**
       * Supported properties for the Child Collection
       */
      [namespace+'Props']: settings.props,


      /**
       * Supported events for the Child Collection
       */
      [namespace+'Events']: settings.events,


      /**
       * Optional method to ensure correct parent data for Child Collection
       */
      [namespace+'Validate']: on('didInsertElement', settings.validate || noop),


      /**
       * Optional method to remove any bound google.map.events ect
       */
      [namespace+'OnDestroy']: on('willDestroyElement', settings.onDestroy || noop),


      /**
       * [Computed property to map over parent model items, checking and returning ids]
       * @param  {[Child Collection item]}
       * @return {[Single level Array of Parent Model ids]}
       */
      [`${namespace}Ids`]: computed.map(`${model}.@each.id`, function(m) {
        if( !m.id ) { throw new Error(`${model} items require an id`); }
        return m.id;
      }),


      /**
       * [Computed property to determine differences between Parent and GMap models]
       * @return {[Boolean]}
       */
      [`${namespace}Updated`]: computed(`${namespace}Ids`, `${model}.@each.id`, {
        get: utils._wasModelUpdated(`${namespace}Ids`, model)
      }),


      /**
       * [Observer to sync the Parent with the GMap model, of the same name]
       * @requires  {[Parent Model]}
       * @requires  {[GMap Model]}
       * @requires  {[GMap create method]}
       */
      [`${namespace}Sync`]: observer('isMapLoaded', `${model}.@each.id`, function() {
        let parentModel    = this.get(model);
        const map          = this.get('map');
        const createMethod = Ember.String.singularize(`add${model[0].toUpperCase()}${model.slice(1)}`);

        // If Items require syncing
        if(!this.get('isMapLoaded') || !this.get(`${namespace}Updated`)) { return; }

        // Remove (deleted) Items from GMap
        for(let i = 0, l = map[model].length; i < l; i++) {
          let item  = map[model][i];
          let id    = item.details.id;

          if(utils._isItemRemoved(id, parentModel) === false) { 
            continue; // Item not removed
          }

          removeItem(item, map);

          // Remove Item from GMap store
          map[model].splice(i, 1);
          l--;
          i--;
        }

        // Build supported config parameters
        const confProps = configurator.getConfigParams(
          [`${namespace}Props`, `${namespace}Events`],
          this
        );

        // Add (unadded) Item to GMap
        for(let i = 0, l = parentModel.length; i < l; i++) {
          let item = parentModel[i];
          let id   = item.id;

          // Child Item is already on map
          if( id && map.hasChild(id, model) ) { continue; }

          let config = configurator.getConfig(confProps, item);

          // Merge marker source data into marker.details
          config.details = merge(
            configurator.getModelProperties(item), 
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
