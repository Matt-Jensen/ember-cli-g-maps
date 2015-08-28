import Ember          from 'ember';

import GMapCore       from 'ember-cli-g-maps/mixins/g-maps/core';

// Map Childs //
import GMapCircles    from 'ember-cli-g-maps/mixins/g-maps/circles';
import GMapMarkers    from 'ember-cli-g-maps/mixins/g-maps/markers';
import GMapPolygons   from 'ember-cli-g-maps/mixins/g-maps/polygons';
import GMapPolylines  from 'ember-cli-g-maps/mixins/g-maps/polylines';
import GMapRectangles from 'ember-cli-g-maps/mixins/g-maps/rectangles';

// Extensions //
import GMapSelections from 'ember-cli-g-maps/mixins/g-maps/selections';

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
