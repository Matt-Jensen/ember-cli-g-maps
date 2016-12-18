import Route from 'ember-route';
import run from 'ember-runloop';
import {assert} from 'ember-metal/utils';
import {A} from 'ember-array/utils';

const colorfulStyles = [{"featureType":"all","elementType":"all","stylers":[{"saturation":"0"}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"saturation":"-77"},{"lightness":"-84"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"hue":"#72ff00"},{"saturation":"-63"},{"lightness":"36"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"color":"#ff0000"},{"visibility":"off"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.fill","stylers":[{"saturation":"3"},{"lightness":"-1"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"saturation":"14"},{"lightness":"-12"},{"color":"#c3e66b"}]},{"featureType":"poi.park","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#000000"},{"weight":"1.12"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#ffb800"},{"weight":"3.84"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#d3c624"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"weight":"0.99"},{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"lightness":"0"},{"color":"#f2a146"},{"visibility":"simplified"},{"weight":"2.92"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"hue":"#ff0000"},{"visibility":"simplified"},{"weight":"0.24"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"0"},{"color":"#cacaca"},{"visibility":"on"},{"weight":"0.68"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"hue":"#ff0000"},{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#5d5d5d"},{"weight":"0.90"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"color":"#ebebeb"},{"weight":"0.99"}]},{"featureType":"transit.line","elementType":"geometry.fill","stylers":[{"lightness":"-38"},{"color":"#c92db1"},{"weight":"0.33"}]},{"featureType":"transit.line","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"geometry.fill","stylers":[{"weight":"0.77"},{"visibility":"off"},{"color":"#000000"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#00b4ff"},{"weight":"0.86"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"weight":"1.91"},{"visibility":"off"},{"hue":"#1400ff"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"},{"weight":"0.55"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#00b4ff"},{"weight":"2.42"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"hue":"#ff0000"},{"visibility":"off"}]}];
const CSS_CURSORS = ['default', 'pointer', 'crosshair', 'alias', 'move', 'zoom-in', 'grab'];
const CONTROL_POSITIONS = ['BOTTOM_CENTER', 'BOTTOM_LEFT', 'BOTTOM_RIGHT', 'LEFT_BOTTOM', 'LEFT_CENTER', 'LEFT_TOP', 'RIGHT_BOTTOM', 'RIGHT_CENTER', 'RIGHT_TOP', 'TOP_CENTER', 'TOP_LEFT', 'TOP_RIGHT'];
const GESTURE_HANDLERS = ['cooperative', 'greedy', 'none', 'auto'];
const MAP_TYPE_CONTROL_STYLES = ['DEFAULT', 'DROPDOWN_MENU', 'HORIZONTAL_BAR'];
const MAP_TYPES = ['ROADMAP', 'SATELLITE', 'HYBRID', 'TERRAIN'];
const SCALE_CONTROL_STYLES = ['DEFAULT'];

export default Route.extend({
  setupController(controller) {
    controller.setProperties({
      lat: 30.2672,
      lng: -97.7431,
      backgroundColor: '#4285f4',
      clickableIcons: true,
      disableDefaultUI: false,
      disableDoubleClickZoom: false,
      draggable: true,
      draggableCursor: 'default',
      draggingCursor: 'default',
      fullscreenControl: true,
      fullscreenControlOptions: 'RIGHT_TOP',
      gestureHandling: 'auto',
      heading: -78.41318697649092,
      keyboardShortcuts: true,
      mapTypeId: 'ROADMAP',
      mapTypeControl: true,
      mapTypeControlOptions: {
        mapTypeIds: A(MAP_TYPES), // copy all types
        position: 'TOP_LEFT',
        style: 'DEFAULT'
      },
      maxZoom: 20,
      minZoom: 2,
      panControl: true,
      panControlOptions: 'BOTTOM_LEFT',
      rotateControl: true,
      rotateControlOptions: 'LEFT_BOTTOM',
      scaleControl: true,
      scaleControlOptions: 'DEFAULT',
      scrollwheel: true,
      signInControl: true,
      styles: colorfulStyles,
      streetViewControl: true,
      streetViewControlOptions: 'RIGHT_BOTTOM',
      zoom: 5,
      zoomControl: true,
      zoomControlOptions: 'RIGHT_BOTTOM',
      allMapTypes: [].concat(MAP_TYPES), // copy all types
      allControlPositions: [].concat(CONTROL_POSITIONS)
    });
  },

  actions: {
    setToNext(scope, type) {
      const current = this.controller.get(scope);
      let model;

      if (type === 'cursor') {
        model = CSS_CURSORS;
      } else if (type === 'position') {
        model = CONTROL_POSITIONS;
      } else if (type === 'gesture') {
        model = GESTURE_HANDLERS;
      } else if (type === 'mapTypeControlStyles') {
        model = MAP_TYPE_CONTROL_STYLES;
      } else if (type === 'scaleControlStyles') {
        model = SCALE_CONTROL_STYLES;
      }

      assert('set to next type was invalid', model);

      const next = model[model.indexOf(current) + 1] || model[0];
      this.controller.set(scope, next);
      this.controller.notifyPropertyChange(scope.split('.')[0]);
    },

    setRandomHeading() {
      const heading = google.maps.geometry.spherical.computeHeading(
        new google.maps.LatLng(getRandomLatitude(), getRandomLongitude()),
        new google.maps.LatLng(getRandomLatitude(), getRandomLongitude())
      );

      this.controller.set('heading', heading);
    },

    /*
     * Heading changes are spammy so only accpet the latest
     */
    onHeadingChanged(value) {
      const applyUpdatedHeading = () => {
        if (this.controller.get('heading') !== value) {
          this.controller.set('heading', value);
        }
      };

      run.debounce(this, applyUpdatedHeading, 500);
    },

    toggleSplice(scope, value, source) {
      const current = this.controller.get(scope);
      const sourceIndex = source.indexOf(value);
      const index = current.indexOf(value);
      const isActive = index > -1;

      if (isActive) {
        current.splice(index, 1);
      } else {
        current.splice(sourceIndex, 0, value);
      }

      this.controller.set(scope, current);
      this.controller.notifyPropertyChange('mapTypeControlOptions');
      current.arrayContentDidChange();
    },

    setMapType(type) {
      this.controller.set('mapTypeId', type);
    },

    onMapTypeIdChange(mapType = '') {
      if (this.controller.get('mapTypeId') !== mapType) {
        this.controller.set('mapTypeId', mapType);
      }
    },

    onZoomChanged(zoom) {
      if (parseInt(this.controller.get('zoom'), 10) !== parseInt(zoom, 10)) {
        this.controller.set('zoom', zoom);
      }
    }
  }
});

function getRandomLatitude() {
  return (Math.random() * 90) * (Math.random() > 0.5 ? -1 : 1);
}

function getRandomLongitude() {
  return (Math.random() * 180) * (Math.random() > 0.5 ? -1 : 1);
}
