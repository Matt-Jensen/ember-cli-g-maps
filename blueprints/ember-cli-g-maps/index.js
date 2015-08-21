module.exports = {
  // description: '',

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackageToProject('gmaps-for-apps');
  }
};
