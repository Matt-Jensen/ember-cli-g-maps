# Ember CLI G-Maps

Ember CLI G-Maps is a Google Map component for map driven applications.

A map driven application responds to map interactions with fresh data. What this means for the developer is that you will need consistent access to the state of the map as well as intuitive ways to efficiently render large amounts of data.

Ember-cli-g-maps seeks to give you the information you need, when you need it, so that you can make the necessary requests and render the most relevant map data for your users.

Built with the [GMaps-For-Apps.js library](https://github.com/Matt-Jensen/gmaps-for-apps), a fork of GMaps.

Installation
------------

Requires: Ember-CLI >= 1.13.7 & Ember > 1.13.6

In terminal:

```bash
ember install ember-cli-g-maps
```
This will install the `ember-cli-g-maps` node module and the `gmaps` bower component.  The g-maps component will be available to your application, however you need to update your environment configuration to avoid violating the content security policy.

Update your `config/environment.js` Content Security Policy to contain:

```js
ENV.contentSecurityPolicy = {
  'default-src': "'none'",
  'script-src': "'self' 'unsafe-eval' *.googleapis.com maps.gstatic.com",
  'font-src': "'self' fonts.gstatic.com",
  'connect-src': "'self' maps.gstatic.com",
  'img-src': "'self' *.googleapis.com maps.gstatic.com csi.gstatic.com",
  'style-src': "'self' 'unsafe-inline' fonts.googleapis.com maps.gstatic.com"
};
```

You wont see your map unless it has height. In `app/styles/app.css`:

```css
.ember-cli-g-map {
    height: 300px;
}
```

Currently Supports
-------------------

- [Polygons](http://hpneo.github.io/gmaps/documentation.html#GMaps-drawPolygon)
- [Markers](http://hpneo.github.io/gmaps/documentation.html#GMaps-createMarker)
- [Circles](http://hpneo.github.io/gmaps/documentation.html#GMaps-drawCircle)
- [Polylines](https://developers.google.com/maps/documentation/javascript/3.exp/reference#CircleOptions#FusionTablesPolylineOptions)

Usage
------

**Simplest Possible G-Map**

In your route:
```js
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({ 
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 4
    });
  }
});
```

In your template:
```handlebars
{{g-maps name="my-map" lat=lat lng=lng zoom=zoom}}
```

**Add Markers**
```js
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 4,
      // Must be an Ember Array
      markers: Ember.A([
        {
          id: 'jdlkfajs22', // Recommended
          lat: 33.516674497188255, // Required
          lng: -86.80091857910156, // Required
          infoWindow: { 
            content: '<p>Birmingham</p>',
            visible: true
          }, 
          click: function() {
            console.log('You clicked me!');
          }
        }
     ]);
    });
  }
});
```

```handlebars
{{g-maps ... markers=markers}}
```

**Add Polygons**
```js
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 4,
      // Must be an Ember Array
      polygons: Ember.A([
        {
          id: 'lka234klafj23', // Recommended
          paths: [ // Required
            [35.0041, -88.1955], // Lat, Lng
            [31.0023, -84.9944], // Lat, Lng
            [30.1546, -88.3864], // Lat, Lng
            [34.9107, -88.1461]  // Lat, Lng
          ]
        }
      ])
    });
  }
});
```

```handlebars
{{g-maps ... polygons=polygons}}
```

**Add Polylines**
```js
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 4,
      // Must be an Ember Array
      polylines: Ember.A([
        {
          id: 'lka234klafj23', // Recommended
          strokeColor: 'blue',
          strokeOpacity: 1,
          strokeWeight: 6,
          path: [ // Required
            [34.220, -100.7], // Lat, Lng
            [33.783, -92.81], // Lat, Lng
            [35.946, -94.83], // Lat, Lng
            [32.458, -95.71], // Lat, Lng
            [33.783, -92.85]  // Lat, Lng
          ]
        }
      ])
    });
  }
});
```

```handlebars
{{g-maps ... polylines=polylines}}
```

**Add Circles**
```js
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 4,
      // Must be an Ember Array
      circles: Ember.A([
        {
          id: 'lfkjasd23faj2f31', // Recommended
          lat: 32.75494243654723, // Required
          lng: -86.8359375,       // Required
          radius: 500000          // Not Required, but you'll probaby want to see it
        }
      ])
    });
  }
});
```

```handlebars
{{g-maps ... circles=circles}}
```

**Add G-Map Component Events**
```js
export default Ember.Route.extend({
  actions: {
    onMapEvent: function(e) {
      console.info('Click coordinate', 
        e.latLng.A, // Latitude
        e.latLng.F  // Longitude
      );
      console.info('Map boundaries',
        e.bounds[0], // Top left map coordinate
        e.bounds[1], // Top right map coordinate
        e.bounds[2], // Bottom left map coordinate
        e.bounds[3]  // Bottom right map coordinate
      );
      console.info('Map\'s center', 
        this.controller.lat, 
        this.controller.lng
      );
      e.mapIdle.then(function() { // Promise
        console.log('maps done loading tiles and user is not interacting with map'); 
      });
      e.mapTilesLoaded.then(function() { // Promise
        console.log('Map tiles have finished loading');
      });
    }
  }
});
```

```handlebars
{{g-maps ... click="onMapClick"}}
```

**Set Map Type**
```js
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      mapType: 'satellite' // Accepts 'roadmap', 'satellite', 'hybrid', or 'terrain'
    });
  }
});
```

```handlebars
{{g-maps ... mapType=mapType}}
```

**Set Draggable**
```js
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      draggable: false // default = true
    });
  }
});
```

```handlebars
{{g-maps ... draggable=draggable}}
```

**Wait For Map To Load**
```js
export default Ember.Route.extend({
  // Inject the gMap service
  gMap: Ember.inject.service(),

  setupController: function(controller) {

    // Schedule after map rendering
    Ember.run.scheduleOnce('afterRender', this, function() {
      
      // Get the service and select desired G-Map
      const mapUtil = this.get('gMap').maps.select('my-map');
      
      // onLoad Promise resolved
      mapUtil.onLoad.then(function() {
        console.log('my-map has finished loading!');
      });
    });
  }
});
```

```handlebars
{{g-maps name="my-map" ...}}
```

## Supported G-Maps Events ##
- click
- bounds_changed
- center_changed
- dblclick
- drag
- dragend
- dragstart
- heading_changed
- idle
- maptypeid_changed
- mousemove
- mouseout
- mouseover
- projection_changed
- resize
- rightclick
- tilesloaded
- tilt_changed
- zoom_changed

```handlebars
{{g-maps
    click="myClickAction"
    bounds_changed="myBounds_changedAction"
    center_changed="myCenter_changedAction"
    dblclick="myDblclickAction"
    drag="myDragAction"
    dragend="myDragendAction"
    dragstart="myDragstartAction"
    heading_changed="myHeading_changedAction"
    idle="myIdleAction"
    maptypeid_changed="myMaptypeid_changedAction"
    mousemove="myMousemoveAction"
    mouseout="myMouseoutAction"
    mouseover="myMouseoverAction"
    projection_changed="myProjection_changedAction"
    resize="myResizeAction"
    rightclick="myRightclickAction"
    tilesloaded="myTilesloadedAction"
    tilt_changed="myTilt_changedAction"
    zoom_changed="myZoom_changedAction"}}
```

Planned Features
----------------

- [Overlays](https://developers.google.com/maps/documentation/javascript/3.exp/reference#CircleOptions#MapPanes)
- [Controls](http://hpneo.github.io/gmaps/examples/custom_controls.html)
- [Layers & KML Layers](https://developers.google.com/maps/documentation/javascript/3.exp/reference#CircleOptions#KmlLayerOptions)
- [Routes](http://hpneo.github.io/gmaps/examples/routes.html)
- [Info Windows](https://github.com/huafu/ember-google-map/wiki/Provided-Tools-and-Classes-%28API%29#info-windows)
- Text labels

Customization
-------------

In `config/environment.js`

```js
ENV.googleMap = {
  // your configuration goes in here
  libraries: ['places', 'geometry'], // milage varies based on g-maps supported features
  version: '3', // not recommended
  apiKey: 'your-unique-google-map-api-key'
}
```

Changelog
---------

0.0.14-beta
------------
* Fixed Bower dependency

0.0.13-beta
-----------
* GMaps-For-Apps.js rendering layer
* Improved Map Child bindings
  * No longer requires id property
* Polyline Map Child
* Performant Map destroy

0.0.12-beta
------------
* Basic Map Component
  * Bound MapType
* Map service
  * map idle promise
  * map tilesLoaded promise
* Marker Map Child
* Circle Map Child
* Polygon Map Child


