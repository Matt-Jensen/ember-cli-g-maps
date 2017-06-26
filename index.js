/* jshint node: true */
/* global process */
'use strict';

const path = require('path');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const map = require('broccoli-stew').map;
const debug = require('broccoli-stew').debug;

module.exports = {
  name: 'ember-cli-g-maps',

  included(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    app.import('vendor/gmaps.js');
  },

  treeForVendor(vendorNode) {
    let gmapsNode = new Funnel(path.join(this.app.project.root, this.app.bowerDirectory, 'gmaps-for-apps'), {
      allowEmpty: false,
      files: ['gmaps.js']
    });

    return new MergeTrees([
      vendorNode,
      map(gmapsNode, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`)
    ]);
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
