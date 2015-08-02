/* jshint node: true */

module.exports = {
  name: 'ember-cli-g-maps',

  // Include Gmaps code in consuming app
  included: function(app) {
    this._super.included(app);

    app.import('bower_components/gmaps/gmaps.js');
  },

  // Request Google Maps script in consuming app
  contentFor: function(type, config) {
    // Const
    var googleMapConfig = config.googleMap || {};

    // Let
    var params = [];
    var content = '';
    var googleMapSrc;

    if(type === 'head') {
      googleMapSrc = '//maps.googleapis.com/maps/api/js';
      // let googleMapsScript = 'http://maps.google.com/maps/api/js?sensor=true'

      // default to Google Maps V3
      googleMapConfig.version = googleMapConfig.version || '3';
      params.push('v='+ encodeURIComponent(googleMapConfig.version));

      // grab either API key or client ID
      if(googleMapConfig.apiKey) {
        params.push('key='+ encodeURIComponent( googleMapConfig.apiKey ));
      }

      // add any optional libraries
      if (googleMapConfig.libraries && googleMapConfig.libraries.length) {
        params.push('libraries='+ encodeURIComponent( google.libraries.join(',') ));
      }

      // Build URL
      googleMapSrc += '?'+ params.join('&');
      if(googleMapConfig.lazyLoad) {
        content = '<meta name="ember-cli-g-maps-sdk-url" content="'+ googleMapSrc +'">';
      } else {
        content = '<script src="'+ googleMapSrc +'"></script>';
      }
    }

    return content;
  }
};
