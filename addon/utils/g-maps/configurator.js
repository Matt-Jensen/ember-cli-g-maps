import Ember from 'ember';

const { isArray } = Ember;

export default Ember.Object.create({

  getConfigParams: function(params, context=this) {
    const groups  = this.getProperties.apply(context, params);
    let confProps = [];

    // Convert all configuration options to single level Array
    for(let p in groups) {
      if(!groups.hasOwnProperty(p)) { continue; }
      if(isArray(groups[p])) {
        confProps = confProps.concat(groups[p]);
      } else {
        confProps.push(groups[p]);
      }
    }

    return confProps;
  },


  getConfig: function(params, context=this) {
    const config = this.getProperties.apply(context, params);

    for(let p in config) {
      if(!config.hasOwnProperty(p)) { continue; }
      if(typeof config[p] === 'undefined') {
        delete config[p];
      }
    }

    return config;
  },


  /**
   * [getModelProperties convert Class or Object into POJO without prototype]
   * @param  {[Class|Object]} model [Ember]
   * @return {[Object]}       [POJO containing only model properties]
   */
  getModelProperties: function(model) {
    const keys = Object.keys(model);
    return this.getProperties.apply(model, keys);
  }
});
