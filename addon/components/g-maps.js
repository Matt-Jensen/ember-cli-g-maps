import Ember          from 'ember';

// Map Childs //
import GMapMarkers    from 'ember-cli-g-maps/mixins/g-maps/markers';
import GMapPolygons   from 'ember-cli-g-maps/mixins/g-maps/polygons';
import GMapCircles    from 'ember-cli-g-maps/mixins/g-maps/circles';
import GMapPolylines  from 'ember-cli-g-maps/mixins/g-maps/polylines';
import GMapRectangles from 'ember-cli-g-maps/mixins/g-maps/rectangles';

// Extensions //
import GMapSelections from 'ember-cli-g-maps/mixins/g-maps/selections';

import GMapCore       from 'ember-cli-g-maps/mixins/g-maps/core';

export default Ember.Component.extend(
  Ember.Evented,
  GMapMarkers,
  GMapPolygons,
  GMapCircles,
  GMapPolylines,
  GMapRectangles,
  GMapSelections,
  GMapCore
);
