# Ember CLI G-Maps [![Ember Badge](https://embadge.io/b/8.svg)](https://embadge.io/badges/8) [![Build Status](https://travis-ci.org/Matt-Jensen/ember-cli-g-maps.svg)](https://travis-ci.org/Matt-Jensen/ember-cli-g-maps.svg?branch=master) [![Ember Observer Score](http://emberobserver.com/badges/ember-cli-g-maps.svg)](http://emberobserver.com/addons/ember-cli-g-maps)

> Ember CLI G-Maps is a Google Map component for map driven applications.

A map driven application responds to map interactions with fresh data. What this means for the developer is that you will need consistent access to the state of the map as well as intuitive ways to efficiently render large amounts of data.

Ember-cli-g-maps seeks to give you the information you need, when you need it, so that you can make the necessary requests and render the most relevant map data for your users.

Built with the [GMaps-For-Apps.js library](https://github.com/Matt-Jensen/gmaps-for-apps), a fork of GMaps.

Installation
------------

[Full installation & configuration documentation.](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/index)

Supports:
- Ember >=1.13
- Google Maps v3

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

Documentation
----------------

**Install and Configuration**

- [Installation and Configuration](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/index)
- [Setting Google API Key](http://matt-jensen.github.io/ember-cli-g-maps/#/setup/apiKey)
- [Adding Libraries](http://matt-jensen.github.io/ember-cli-g-maps/#/setup/libraries)
- [Misc Setup Options](http://matt-jensen.github.io/ember-cli-g-maps/#/setup/misc)

**Component Properties and Events**

- [Basic Map Example](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/index)
- [Supported Component Properties](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/map-properties)
- [Supported Component Events](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/map-events)

**Elements**

- [Marker Elements](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/markers)
- [Circle Elements](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/circles)
- [Polygon Elements](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/polygons)
- [Polyline Elements](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/polylines)
- [Rectangle Elements](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/rectangles)
- [Overlay Elements](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/overlays)

**Services**
- [Geocoding](http://matt-jensen.github.io/ember-cli-g-maps/#/service/geocoding)
- [Refreshing](http://matt-jensen.github.io/ember-cli-g-maps/#/service/refresh)

**Selections**

- [Setup](http://matt-jensen.github.io/ember-cli-g-maps/#/selections/index)
- [Properties](http://matt-jensen.github.io/ember-cli-g-maps/#/selections/properties)
- [Events](http://matt-jensen.github.io/ember-cli-g-maps/#/selections/events)
- [Marker Options](http://matt-jensen.github.io/ember-cli-g-maps/#/selections/marker)
- [Rectangle Options](http://matt-jensen.github.io/ember-cli-g-maps/#/selections/rectangle)
- [Circle Options](http://matt-jensen.github.io/ember-cli-g-maps/#/selections/circle)
- [Polygon Options](http://matt-jensen.github.io/ember-cli-g-maps/#/selections/polygon)
- [Polyline Options](http://matt-jensen.github.io/ember-cli-g-maps/#/selections/polyline)

**Heatmap**

- [Setup](http://matt-jensen.github.io/ember-cli-g-maps/#/heatmap/index)
- [Properties](http://matt-jensen.github.io/ember-cli-g-maps/#/heatmap/properties)
- [Marker](http://matt-jensen.github.io/ember-cli-g-maps/#/heatmap/marker)


Currently Supports
-------------------

- [Polygons](http://hpneo.github.io/gmaps/documentation.html#GMaps-drawPolygon)
- [Markers](http://hpneo.github.io/gmaps/documentation.html#GMaps-createMarker)
- [Circles](http://hpneo.github.io/gmaps/documentation.html#GMaps-drawCircle)
- [Polylines](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polyline)
- [Rectangles](http://hpneo.github.io/gmaps/documentation.html#GMaps-drawRectangle)
- [Overlays](https://developers.google.com/maps/documentation/javascript/3.exp/reference#OverlayView)
- [Selections](http://matt-jensen.github.io/ember-cli-g-maps/#/selections/index)
- [Heatmap Layer](https://developers.google.com/maps/documentation/javascript/examples/layer-heatmap)

Usage
------

**Simplest Possible G-Map**

[Full simple map documentation](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/index)

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

**Adding Markers**

[Full marker documentation](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/markers)

```js
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      // Must be an Ember Array
      markers: Ember.A([
        {
          id: 'unique-marker-id',  // Recommended
          lat: 33.516674497188255, // Required
          lng: -86.80091857910156, // Required
          infoWindow: {
            content: '<p>Birmingham</p>',
            visible: true
          },
          click: function(event, marker) {},
          rightclick: function(event, marker) {},
          dblclick: function(event, marker) {},
          mouseover: function(event, marker) {},
          mouseout: function(event, marker) {},
          mouseup: function(event, marker) {},
          mousedown: function(event, marker) {},
          drag: function(e, marker) {},
          dragstart: function(e, marker) {},
          dragend: function(e, marker) {}
        }
     ]);
    });
  }
});
```

```handlebars
{{g-maps ... markers=markers}}
```

**Adding Polygons**

[Full polygon documentation](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/polygons)

```js
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      // Must be an Ember Array
      polygons: Ember.A([
        {
          id: 'unique-polygon-id', // Recommended
          paths: [ // Required
            [35.0041, -88.1955], // Lat, Lng
            [31.0023, -84.9944], // Lat, Lng
            [30.1546, -88.3864], // Lat, Lng
            [34.9107, -88.1461]  // Lat, Lng
          ],
          click: function(event, polygon) {},
          rightclick: function(event, polygon) {},
          dblclick: function(event, polygon) {},
          mouseover: function(event, polygon) {},
          mouseout: function(event, polygon) {},
          mouseup: function(event, polygon) {},
          mousedown: function(event, polygon) {},
          mousemove: function(event, polygon) {},
          drag: function(event, polygon) {},
          dragstart: function(event, polygon) {},
          dragend: function(event, polygon) {},
          set_at: function(polygonPath) {},
          insert_at: function(polygonPath) {},
          remove_at: function(polygonPath) {}
        }
      ])
    });
  }
});
```

```handlebars
{{g-maps ... polygons=polygons}}
```

**Adding Polylines**

[Full polyline documentation](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/polylines)

```js
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      // Must be an Ember Array
      polylines: Ember.A([
        {
          id: 'unique-polyline-id', // Recommended
          strokeColor: 'blue',
          strokeOpacity: 1,
          strokeWeight: 6,
          path: [ // Required
            [34.220, -100.7], // Lat, Lng
            [33.783, -92.81], // Lat, Lng
            [35.946, -94.83], // Lat, Lng
            [32.458, -95.71], // Lat, Lng
            [33.783, -92.85]  // Lat, Lng
          ],
          click: function(event, polyline) {},
          rightclick: function(event, polyline) {},
          dblclick: function(event, polyline) {},
          mouseover: function(event, polyline) {},
          mouseout: function(event, polyline) {},
          mouseup: function(event, polyline) {},
          mousedown: function(event, polyline) {},
          mousemove: function(event, polyline) {},
          set_at: function(polylinePath) {},
          insert_at: function(polylinePath) {},
          remove_at: function(polylinePath) {}
        }
      ])
    });
  }
});
```

```handlebars
{{g-maps ... polylines=polylines}}
```

**Adding Circles**

[Full circle documentation](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/circles)

```js
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      // Must be an Ember Array
      circles: Ember.A([
        {
          id: 'unique-circle-id', // Recommended
          lat: 32.75494243654723, // Required
          lng: -86.8359375,       // Required
          radius: 500000          // Not Required, but you'll probaby want to see it
          click: function(event, circle) {},
          rightclick: function(event, circle) {},
          dblclick: function(event, circle) {},
          mouseover: function(event, circle) {},
          mouseout: function(event, circle) {},
          mouseup: function(event, circle) {},
          mousedown: function(event, circle) {},
          mousemove: function(event, circle) {},
          drag: function(e, circle) {},
          dragstart: function(e, circle) {},
          dragend: function(e, circle) {},
          radius_changed: function(circle) {},
          center_changed: function(circle) {}
        }
      ])
    });
  }
});
```

```handlebars
{{g-maps ... circles=circles}}
```

**Adding Rectangles**

[Full rectangle documentation](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/rectangles)

```js
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      // Must be an Ember Array
      rectangles: Ember.A([
        {
          id: 'unique-rectangle-id',            // Recommended
          bounds: [
            [40.300476079749465, -102.3046875], // NE lat, lng
            [26.258936094468414, -73.828125]    // SW lat, lng
          ],
          strokeColor: 'green',
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: 'green',
          fillOpacity: 0.2,
          click: function(event, rectangle) {},
          rightclick: function(event, rectangle) {},
          dblclick: function(event, rectangle) {},
          mouseover: function(event, rectangle) {},
          mouseout: function(event, rectangle) {},
          mouseup: function(event, rectangle) {},
          mousedown: function(event, rectangle) {},
          mousemove: function(event, rectangle) {},
          drag: function(e, rectangle) {},
          dragstart: function(e, rectangle) {},
          dragend: function(e, rectangle) {},
          bounds_changed: function(rectangle) {}
        }
      ])
    });
  }
});
```

```handlebars
{{g-maps ... rectangles=rectangles}}
```

**Adding Overlays**

[Full overlay documentation](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/overlays)

```js
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      // Must be an Ember Array
      overlays: Ember.A([
        {
          id: 'unique-overlay-id', // Recommended
          lat: 32.75494243654723,  // Required
          lng: -86.8359375,        // Required
          content: '<strong class="my-class">Some HTML</strong>',
          verticalAlign: 'top',
          horizontalAlign: 'center',
          click: function(event, overlay) {},
          dblclick: function(event, overlay) {},
          mouseup: function(event, overlay) {},
          mousedown: function(event, overlay) {},
          mouseover: function(event, overlay) {},
          mousemove: function(event, overlay) {},
          mouseout: function(event, overlay) {}
        }
      ])
    });
  }
});
```

```handlebars
{{g-maps ... rectangles=rectangles}}
```

**Basic G-Map Component Event**
```js
export default Ember.Route.extend({
  actions: {
    onMapEvent: function(event) {
      console.info('Click coordinate',
        event.latLng.lat(), // Latitude
        event.latLng.lng()  // Longitude
      );
      console.info('Map boundaries',
        event.bounds[0], // Northeast map coordinate
        event.bounds[1]  // Southwest map coordinate
      );
      console.info('Map\'s center',
        this.controller.lat,
        this.controller.lng
      );
      event.mapIdle.then(function() { // Promise
        console.log('maps done loading tiles and user is not interacting with map');
      });
      event.mapTilesLoaded.then(function() { // Promise
        console.log('Map tiles have finished loading');
      });
    }
  }
});
```

```handlebars
{{g-maps ... click="onMapClick"}}
```

**Setting Map Properties**

[Full component properties documentation](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/map-properties)

```js
// Default settings
export default Ember.Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat: 33.5205556,
      lng: -86.8025,
      mapType: 'satellite', // Accepts 'roadmap', 'satellite', 'hybrid', or 'terrain'
      showMapTypeControl: true,
      clickableIcons: true,
      draggable: true,
      disableDefaultUI: false,
      disableDoubleClickZoom: false,
      scrollwheel: true,
      showZoomControl: true,
      showScaleControl: true
    });
  }
});
```

```handlebars
{{g-maps ... mapType=myMapType}}
```

```handlebars
{{g-maps ... showMapTypeControl=true}}
```

```handlebars
{{g-maps ... draggable=true}}
```

```handlebars
{{g-maps ... disableDefaultUI=true}}
```

```handlebars
{{g-maps ... clickableIcons=true}}
```

```handlebars
{{g-maps ... disableDoubleClickZoom=true}}
```

```handlebars
{{g-maps ... scrollwheel=true}}
```

```handlebars
{{g-maps ... showZoomControl=true}}
```

```handlebars
{{g-maps ... showScaleControl=true}}
```

**React to Map Loading Completion**
```js
export default Ember.Route.extend({
  actions: {
    onMapLoad: function(e) {
      console.log(e.map +' has finished loading!');
      // > "my-map has finished loading!"
    }
  }
});
```

```handlebars
{{g-maps name="my-map" loaded="onMapLoad"}}
```

## Supported G-Maps Events ##

[Full component events documentation](http://matt-jensen.github.io/ember-cli-g-maps/#/basic-usage/map-events)

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

Selections
------------

[Full selections documentation](http://matt-jensen.github.io/ember-cli-g-maps/#/selections/index)

Repurposed from the [Google Maps Drawing Manager](https://developers.google.com/maps/documentation/javascript/drawinglayer), Selections allow you to draw shapes on your map instance.  This allows users to select areas on the map to interact with.  Supported selection types include:

- Markers
- Rectangles
- Circles
- Polygons
- Polylines

**Selections Requirements**

Selections requires the Google Maps Drawing library.  To add this library in:
`config/environment.js` add:

```json
ENV.googleMap = {
  libraries: ['drawing']
};
```

**Actions**

Actions are fired when a selections are completed.  Available selections actions are:

- selectionsMarker
- selectionsCircle
- selectionsRectangle
- selectionsPolygon
- selectionsPolyline

Heatmap
--------

[Full heatmap documentation](http://matt-jensen.github.io/ember-cli-g-maps/#/heatmap/index)

Heatmap is an abstraction of the [Google Maps Heatmap Layer](https://developers.google.com/maps/documentation/javascript/examples/layer-heatmap).

**Heatmap Requirements**

Heatmap requires the Google Maps Visualization library.  To add this library in:
`config/environment.js` add:

```json
ENV.googleMap = {
  libraries: ['visualization']
};
```

Planned Features
----------------

- [Routes](https://hpneo.github.io/gmaps/documentation.html#GMaps-drawRoute)
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
  apiKey: 'your-unique-google-map-api-key',
  lazyLoad: false, // default
  language: 'ja', // optional
  region: 'JA' // optional
}
```

Contributors
-------------
- :star2: [@LauLaman](https://github.com/LauLaman)
- :fire: [@sukima](https://github.com/sukima)

Changelog
---------

0.5.0
------------
* Fixes bug when Ember-Data not included
* Adds Map refresh service
* Adds Map theming
* Adds Lazy Load support

0.4.0
------------
* Adds Geocoding
* Adds Google Places Autocomplete
* Wrap GMaps-for-apps geocoding service in Promise

0.3.3
------------
* Adds scale control support
* Adds work client api-key support
* Unit test refactor
* Restructures g-maps core functionality

0.3.2
------------
* Delegated gMap service onLoad to component loaded action
* Fixed some core mixin test race conditions
* Updated readme

0.3.1
------------
* Upgrade to Ember-cli@1.13.8
* Reverted to RSVP.Promise for tests
* Unit test for Overlay Mixin
* Travis-CI Badge
* Ember Observer Badge
* Passing Phantom Tests

0.3.0
------------
* Google Maps Overlays child
* README Overlay examples
* Document supported child events

0.2.1
------------
* Google Maps API updates
* Heatmap tests

0.2.0
------------
* Heatmap Extension

0.1.2
------------
* Full test coverage

0.1.1-beta
------------
* Fixed GMap zooming lat lng hijacking
* Added warnings for invalid selections' props
* Added syncing of DrawingManager controls to selectionsMode
* Fix auto setting of map type to 'undefined'

0.1.0-beta
------------
* Added Rectangle Maps Child
* Map selections
* fixed g-maps bindings on center_changed

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


License
--------

The MIT License (MIT)

Copyright (c) 2015 Matt Jensen. github.com/Matt-Jensen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
