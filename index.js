/* jshint node: true */
'use strict';

const path = require('path');
const fastbootTransform = require('fastboot-transform');

module.exports = {
  name: 'ember-cli-g-maps',

  options: {
    nodeAssets: {
      'gmaps-for-apps': {
        vendor: {
          srcDir: '',
          include: ['gmaps.js'],
          processTree(input) {
            return fastbootTransform(input);
          }
        }
      }
    }
  },

  included() {
    this._super.included.apply(this, arguments);
    this._ensureThisImport();

    this.import('vendor/gmaps-for-apps/gmaps.js');
  },
  _ensureThisImport() {
    if (!this.import) {
      this._findHost = function findHostShim() {
        let current = this;
        let app;

        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));
        return app;
      };
      this.import = function importShim(asset, options) {
        let app = this._findHost();
        app.import(asset, options);
      };
    }
  },

  // Request Google Maps script in consuming app
  contentFor(type, config) {
    var googleMapConfig = config.googleMap || {};

    var params = [];
    var content = '';
    var googleMapSrc, isClient;

    if (type === 'head') {
      googleMapSrc = 'maps.googleapis.com/maps/api/js';
      // let googleMapsScript = 'http://maps.google.com/maps/api/js?sensor=true'

      //Protocol setup
      googleMapConfig.protocol = googleMapConfig.protocol || '//';

      // default to Google Maps V3
      googleMapConfig.version = googleMapConfig.version || '3';
      params.push('v='+ encodeURIComponent(googleMapConfig.version));

      // grab either API key or client ID
      if (googleMapConfig.apiKey) {
        isClient = googleMapConfig.apiKey.substr(0, 4) === 'gme-';
        params.push((isClient ? 'client' : 'key') +'='+ encodeURIComponent( googleMapConfig.apiKey ));
      }

      // add any optional libraries
      if (googleMapConfig.libraries && googleMapConfig.libraries.length) {
        params.push('libraries='+ encodeURIComponent( googleMapConfig.libraries.join(',') ));
      }

      // add optional localization
      if (googleMapConfig.language) {
        params.push('language='+ encodeURIComponent( googleMapConfig.language ));
      }
      if (googleMapConfig.region) {
        params.push('region='+ encodeURIComponent( googleMapConfig.region ));
      }

      googleMapSrc = googleMapConfig.protocol + googleMapSrc;
      googleMapSrc += '?'+ params.join('&');

      if(googleMapConfig.lazyLoad) {
        content = '<meta name="ember-cli-g-maps-url" content="'+ googleMapSrc +'">';
      } else {
        content = '<script src="'+ googleMapSrc +'"></script>';
      }
    }

    return content;
  }
};
