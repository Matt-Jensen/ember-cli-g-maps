export default {
  propertyDefaults: {
    clickable: true,
    draggable: false,
    editable: false,
    fillColor: '#000000',
    fillOpacity: 1,
    geodesic: false,
    opacity: 1,
    strokeColor: '#000000',
    strokeOpacity: 1,
    strokePosition: 'CENTER',
    strokeWeight: 3,
    visible: true
  },

  googleMap: {
    scope: 'map',

    events: [
      'bounds_changed',
      'center_changed',
      'click',
      'dblclick',
      'drag',
      'dragend',
      'dragstart',
      'heading_changed',
      'idle',
      'maptypeid_changed',
      'mousemove',
      'mouseout',
      'mouseover',
      'projection_changed',
      'resize',
      'rightclick',
      'tilesloaded',
      'tilt_changed',
      'zoom_changed'
    ],

    staticOptions: [
      'backgroundColor',
      'styles'
    ],

    boundOptions: [
      'center',
      'clickableIcons',
      'disableDefaultUI',
      'disableDoubleClickZoom',
      'draggable',
      'draggableCursor',
      'draggingCursor',
      'fullscreenControl',
      'fullscreenControlOptions',
      'gestureHandling',
      'heading',
      'keyboardShortcuts',
      'mapTypeControl',
      'mapTypeControlOptions',
      'mapTypeId',
      'maxZoom',
      'minZoom',
      'noClear',
      'panControl',
      'panControlOptions',
      'rotateControl',
      'rotateControlOptions',
      'scaleControl',
      'scaleControlOptions',
      'scrollwheel',
      'streetView',
      'streetViewControl',
      'streetViewControlOptions',
      'tilt',
      'zoom',
      'zoomControl',
      'zoomControlOptions'
    ]
  },

  googleMapMarker: {
    scope: 'marker',

    events: [
      'animation_changed',
      'click',
      'clickable_changed',
      'cursor_changed',
      'dblclick',
      'drag',
      'dragend',
      'draggable_changed',
      'dragstart',
      'icon_changed',
      'mousedown',
      'mouseout',
      'mouseover',
      'mouseup',
      'position_changed',
      'rightclick',
      'shape_changed',
      'title_changed',
      'visible_changed',
      'zindex_changed'
    ],

    boundOptions: [
      'anchorPoint',
      'clickable',
      'crossOnDrag',
      'cursor',
      'draggable',
      'icon',
      'label',
      'opacity',
      'optimized',
      'position',
      'shape',
      'title',
      'visible',
      'zIndex',
      'animation' // NOTE must be set after icon & optimized
    ]
  },

  googleMapCircle: {
    scope: 'circle',

    events: [
      'center_changed',
      'click',
      'dblclick',
      'drag',
      'dragend',
      'dragstart',
      'mousedown',
      'mousemove',
      'mouseout',
      'mouseover',
      'mouseup',
      'radius_changed',
      'rightclick'
    ],

    boundOptions: [
      'center',
      'clickable',
      'draggable',
      'editable',
      'fillColor',
      'fillOpacity',
      'radius',
      'strokeColor',
      'strokeOpacity',
      'strokePosition',
      'strokeWeight',
      'visible',
      'zIndex'
    ]
  },

  googleMapPolygon: {
    scope: 'polygon',

    events: [
      'click',
      'dblclick',
      'drag',
      'dragend',
      'dragstart',
      'insert_at',
      'mousedown',
      'mousemove',
      'mouseout',
      'mouseover',
      'mouseup',
      'remove_at',
      'rightclick',
      'set_at'
    ],

    boundOptions: [
      'clickable',
      'draggable',
      'editable',
      'fillColor',
      'fillOpacity',
      'geodesic',
      'strokeColor',
      'strokeOpacity',
      'strokePosition',
      'strokeWeight',
      'visible',
      'zIndex'
    ]
  },

  googleMapPolyline: {
    scope: 'polyline',

    events: [
      'click',
      'dblclick',
      'drag',
      'dragend',
      'dragstart',
      'insert_at',
      'mousedown',
      'mousemove',
      'mouseout',
      'mouseover',
      'mouseup',
      'remove_at',
      'rightclick',
      'set_at'
    ],

    boundOptions: [
      'clickable',
      'draggable',
      'editable',
      'geodesic',
      'icons',
      'strokeColor',
      'strokeOpacity',
      'strokeWeight',
      'visible',
      'zIndex'
    ]
  }
};
