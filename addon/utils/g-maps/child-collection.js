import Ember        from 'ember';

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

    settings = merge(defaults, settings);

    if(!settings.model) {
      throw new Error('childCollection requires a `model` string');
    }


    ////////////////////////////////////////////
    // Child Collection Factory Configuration
    ///////////////////////////////////////////

    const model             = settings.model;
    const namespace         = globalNamespace+capitalize(settings.namespace);
    const addMethod         = Ember.String.singularize(`add${model[0].toUpperCase()}${model.slice(1)}`);
    const removeMethod      = Ember.String.singularize(`remove${model[0].toUpperCase()}${model.slice(1)}`);
    const afterAddChild     = settings.onAddedItem || noop;
    const beforeRemoveChild = settings.onRemoveItem || noop;


    ////////////////////////////////////
    // Child Collection Mixin Factory
    ///////////////////////////////////

    return {

      /**
       * Reference to the GMap instance store
       */
      [model]: Ember.A(),


      /**
       * Optional method to ensure correct parent data for Child Collection
       */
      [namespace+'Validate']: on('didInsertElement', settings.validate || noop),


      /**
       * Optional method to remove event listeners ect.
       */
      [namespace+'OnDestroy']: on('willDestroyElement', settings.onDestroy || noop),


      /**
       * [Observer to sync the Parent with the GMap model, of the same name]
       * @requires  {[Parent Model]}
       * @requires  {[GMap Model]}
       * @requires  {[GMap create method]}
       */
      [`${namespace}Sync`]: observer('isMapLoaded', `${model}.[]`, function() {
        const map       = this.get('map');
        let parentModel = this.get(model);

        // If Items require syncing
        if(!this.get('isMapLoaded')) { return; }

        for(let i = 0, l = parentModel.length; i < l; i++) {
          let item         = parentModel[i];
          let mapChild     = map[model][i];
          let addedMapItem = null;

          // Map store doesn't have child
          if(!mapChild) {
            addedMapItem = map[addMethod](item);
          }

          // If map index item is different from model item
          else if(utils._modelVsMapChildDiff(item, mapChild)) {

            // Somethings different, so just rerender it!
            beforeRemoveChild(mapChild, map);
            map[ removeMethod ](mapChild);

            // Add to end of map[model]
            addedMapItem = map[ addMethod ](item);

            // So here we adjust it to be the current index
            map[model].splice(i, 0, map[model].pop());
          }

          // Hook for mixin
          if(addedMapItem) {
            afterAddChild(item, addedMapItem, map);
          }
        }

        // Remove any map children out of sync with model
        while(map[model].length !== parentModel.length) {
          let mapChild = map[model][map[model].length - 1];

          // Hook for mixin
          beforeRemoveChild(mapChild, map);
          map[removeMethod](mapChild);
        }
      })
    };
  },

  _modelVsMapChildDiff: function(model, mapChild) {
    for(let p in model) {
      if(model.hasOwnProperty(p)) {

        // Only diff one level deep on parent model
        if(typeof model[p] !== 'object' && model[p] !== mapChild[p]) { 
          return true;
        }
      }
    }
    return false;
  }
};
