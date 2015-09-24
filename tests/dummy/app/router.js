import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('setup', function() {
    this.route('index');
    this.route('apiKey');
    this.route('libraries');
    this.route('misc');
  });
  this.route('basicUsage', { path: '/basic-usage' }, function() {
    this.route('index');
    this.route('mapProperties', { path: '/map-properties' });
    this.route('mapEvents', { path: '/map-events' });
    this.route('markers');
    this.route('circles');
    this.route('polygons');
    this.route('polylines');
    this.route('rectangles');
    this.route('overlays');
  });
  this.route('service', function() {
    this.route('index');
    this.route('travelRoute', { path: '/travel-route' });
    this.route('suggestFrame', { path: '/suggest-frame' });
    this.route('geocoding');
    this.route('refresh');
  });
  this.route('selections', function() {
    this.route('index');
    this.route('properties');
    this.route('events');
    this.route('marker');
    this.route('rectangle');
    this.route('circle');
    this.route('polygon');
    this.route('polyline');
  });
  this.route('heatmap', function() {
    this.route('index');
    this.route('properties');
    this.route('marker');
  });
  this.route('misc', function() {
    this.route('index');
  });
});

export default Router;
