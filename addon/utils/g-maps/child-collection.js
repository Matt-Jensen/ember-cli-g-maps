import Ember from 'ember';

const { capitalize } = Ember.String;
const { merge, uuid, on, observer } = Ember;

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
    const addMethod         = `add${capitalize(settings.namespace)}`;
    const removeMethod      = `remove${capitalize(settings.namespace)}`;


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
      [namespace+'Destroy']: on('willDestroyElement', settings.destroy || noop),


      /**
       * Optional method to call after a map child item has been added.
       */
      [namespace+'AfterAddChild']: settings.addedItem || noop,


      /**
       * Optional method to call before a map child item has been removed.
       */
      [namespace+'BeforeRemoveChild']: settings.removeItem || noop,


      /**
       * [Observer to sync the Parent with the GMap model, of the same name]
       * @requires  {[Parent Model]}
       * @requires  {[GMap Model]}
       * @requires  {[GMap create method]}
       */
      [`${namespace}Sync`]: observer('isMapLoaded', `${model}.[]`, function sync() {
        const map       = this.get('map');
        let parentModel = this.get(model);

        // If Items require syncing
        if(!this.get('isMapLoaded') || !parentModel) { return; }

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
            this[namespace+'BeforeRemoveChild'](mapChild, map);
            map[ removeMethod ](mapChild);

            // Add to end of map[model]
            addedMapItem = map[addMethod](item);

            // So here we adjust it to be the current index
            map[model].splice(i, 0, map[model].pop());
          }

          // Hook for mixin
          if(addedMapItem) {
            this[namespace+'AfterAddChild'](item, addedMapItem, map);
          }
        }

        // Remove any map children out of sync with model
        while(map[model].length > parentModel.length) {
          let mapChild = map[model][map[model].length - 1];

          // Hook for mixin
          this[namespace+'BeforeRemoveChild'](mapChild, map);
          map[removeMethod](mapChild);
        }
      })
    };
  },

  _modelVsMapChildDiff: function(model, mapChild) {
    for(let p in model) {
      if(model.hasOwnProperty(p)) {

        // Only diff one level deep on parent model
        if(typeof model[p] === 'object') { continue; }

        if(model[p] !== mapChild[p]) {
          return true;
        }
      }
    }
    return false;
  }
};
