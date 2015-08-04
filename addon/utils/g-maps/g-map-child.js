export default {
  wasModelUpdated: function wasModelUpdated(modelIdsKey, model) {
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
    }
  }
}
