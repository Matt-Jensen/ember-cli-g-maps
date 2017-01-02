export default {
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
  }
};
