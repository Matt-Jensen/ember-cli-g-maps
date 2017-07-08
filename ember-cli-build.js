/* eslint-env node */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    autoprefixer: {
      browsers: ['last 2 versions']
    },

    babel: {
      optional: ['es6.spec.symbols'],
    },

    'ember-cli-babel': {
      compileModules: true,
      includePolyfill: true,
      disableDebugTooling: true
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
