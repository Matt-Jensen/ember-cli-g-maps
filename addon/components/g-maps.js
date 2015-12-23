import Ember from 'ember';

// Core //
import coreMain from 'ember-cli-g-maps/mixins/g-maps/core/main';
import twoWayLatLng from 'ember-cli-g-maps/mixins/g-maps/core/two-way-lat-lng';
import twoWayZoom from 'ember-cli-g-maps/mixins/g-maps/core/two-way-zoom';
import twoWayDraggable from 'ember-cli-g-maps/mixins/g-maps/core/two-way-draggable';
import twoWayDisableDoubleClickZoom from 'ember-cli-g-maps/mixins/g-maps/core/two-way-disable-double-click-zoom';
import twoWayScrollWheel from 'ember-cli-g-maps/mixins/g-maps/core/two-way-scroll-wheel';
import twoWayZoomControl from 'ember-cli-g-maps/mixins/g-maps/core/two-way-zoom-control';
import twoWayScaleControl from 'ember-cli-g-maps/mixins/g-maps/core/two-way-scale-control';
import twoWayMapType from 'ember-cli-g-maps/mixins/g-maps/core/two-way-map-type';
import twoWayMapTypeControl from 'ember-cli-g-maps/mixins/g-maps/core/two-way-map-type-control';

// Map Childs //
import gMapCircles from 'ember-cli-g-maps/mixins/g-maps/circles';
import gMapMarkers from 'ember-cli-g-maps/mixins/g-maps/markers';
import gMapPolygons from 'ember-cli-g-maps/mixins/g-maps/polygons';
import gMapOverlays from 'ember-cli-g-maps/mixins/g-maps/overlays';
import gMapPolylines from 'ember-cli-g-maps/mixins/g-maps/polylines';
import gMapRectangles from 'ember-cli-g-maps/mixins/g-maps/rectangles';

// Extensions //
import gMapHeatmap from 'ember-cli-g-maps/mixins/g-maps/heatmap';
import gMapSelections from 'ember-cli-g-maps/mixins/g-maps/selections';

export default Ember.Component.extend(
  gMapCircles,
  gMapMarkers,
  gMapPolygons,
  gMapOverlays,
  gMapPolylines,
  gMapRectangles,
  gMapSelections,
  gMapHeatmap,
  twoWayLatLng,
  twoWayZoom,
  twoWayDraggable,
  twoWayDisableDoubleClickZoom,
  twoWayScrollWheel,
  twoWayZoomControl,
  twoWayScaleControl,
  twoWayMapType,
  twoWayMapTypeControl,
  coreMain
);
