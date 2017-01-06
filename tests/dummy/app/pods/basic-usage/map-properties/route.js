import Route from 'ember-route';
import run from 'ember-runloop';
import {A} from 'ember-array/utils';
import {assign} from 'ember-platform';

import DocumentationHelpers from '../../../mixins/documentation-actions';

const colorfulStyles = [{"featureType":"all","elementType":"all","stylers":[{"saturation":"0"}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"saturation":"-77"},{"lightness":"-84"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"hue":"#72ff00"},{"saturation":"-63"},{"lightness":"36"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"color":"#ff0000"},{"visibility":"off"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.fill","stylers":[{"saturation":"3"},{"lightness":"-1"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"saturation":"14"},{"lightness":"-12"},{"color":"#c3e66b"}]},{"featureType":"poi.park","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#000000"},{"weight":"1.12"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#ffb800"},{"weight":"3.84"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#d3c624"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"weight":"0.99"},{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"lightness":"0"},{"color":"#f2a146"},{"visibility":"simplified"},{"weight":"2.92"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"hue":"#ff0000"},{"visibility":"simplified"},{"weight":"0.24"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"0"},{"color":"#cacaca"},{"visibility":"on"},{"weight":"0.68"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"hue":"#ff0000"},{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#5d5d5d"},{"weight":"0.90"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"color":"#ebebeb"},{"weight":"0.99"}]},{"featureType":"transit.line","elementType":"geometry.fill","stylers":[{"lightness":"-38"},{"color":"#c92db1"},{"weight":"0.33"}]},{"featureType":"transit.line","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"geometry.fill","stylers":[{"weight":"0.77"},{"visibility":"off"},{"color":"#000000"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#00b4ff"},{"weight":"0.86"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"weight":"1.91"},{"visibility":"off"},{"hue":"#1400ff"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"},{"weight":"0.55"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#00b4ff"},{"weight":"2.42"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"hue":"#ff0000"},{"visibility":"off"}]}];
const CONTROL_POSITIONS = ['BOTTOM_CENTER', 'BOTTOM_LEFT', 'BOTTOM_RIGHT', 'LEFT_BOTTOM', 'LEFT_CENTER', 'LEFT_TOP', 'RIGHT_BOTTOM', 'RIGHT_CENTER', 'RIGHT_TOP', 'TOP_CENTER', 'TOP_LEFT', 'TOP_RIGHT'];
const MAP_TYPES = ['ROADMAP', 'SATELLITE', 'HYBRID', 'TERRAIN'];
const MAP_DEFAULTS = {
  lat: 30.2672,
  lng: -97.74310000000003,
  backgroundColor: '#4285f4',
  clickableIcons: true,
  disableDefaultUI: true,
  disableDoubleClickZoom: false,
  draggable: true,
  draggableCursor: 'default',
  draggingCursor: 'default',
  fullscreenControl: true,
  fullscreenControlOptions: 'RIGHT_TOP',
  gestureHandling: 'auto',
  heading: -78.41318697649092,
  keyboardShortcuts: true,
  mapTypeId: 'SATELLITE',
  mapTypeControl: true,
  mapTypeControlOptions: {
    mapTypeIds: A(MAP_TYPES), // copy all types
    position: 'TOP_LEFT',
    style: 'DEFAULT'
  },
  maxZoom: 20,
  minZoom: 2,
  panControl: true,
  panControlOptions: 'TOP_RIGHT',
  rotateControl: true,
  rotateControlOptions: 'LEFT_BOTTOM',
  scaleControl: true,
  scaleControlOptions: 'DEFAULT',
  scrollwheel: false,
  styles: colorfulStyles,
  streetViewControl: true,
  streetViewControlOptions: 'RIGHT_BOTTOM',
  tilt: 45,
  zoom: 18,
  zoomControl: true,
  zoomControlOptions: 'RIGHT_BOTTOM'
};

export default Route.extend(DocumentationHelpers, {
  setupController(controller) {
    controller.setProperties({
      options: assign({}, MAP_DEFAULTS),
      allMapTypes: [].concat(MAP_TYPES), // copy all types
      allControlPositions: [].concat(CONTROL_POSITIONS),
      useOptionsMap: false
    });
  },

  actions: {
    setRandomHeading() {
      const {controller} = this;
      const heading = google.maps.geometry.spherical.computeHeading(
        new google.maps.LatLng(getRandomLatitude(), getRandomLongitude()),
        new google.maps.LatLng(getRandomLatitude(), getRandomLongitude())
      );

      controller.set('options.heading', heading);
      controller.notifyPropertyChange('options');
    },

    /*
     * Heading changes are spammy so only accpet the latest
     */
    onHeadingChanged(value) {
      const {controller} = this;
      const applyUpdatedHeading = () => {
        if (controller.get('options.heading') !== value) {
          controller.set('options.heading', value);
          controller.notifyPropertyChange('options');
        }
      };

      run.debounce(this, applyUpdatedHeading, 500);
    },

    toggleSplice(scope, value, source) {
      const {controller} = this;
      const current = controller.get(`options.${scope}`);
      const sourceIndex = source.indexOf(value);
      const index = current.indexOf(value);
      const isActive = index > -1;

      if (isActive) {
        current.splice(index, 1);
      } else {
        current.splice(sourceIndex, 0, value);
      }

      controller.set(`options.${scope}`, current);

      current.arrayContentDidChange();
      controller.notifyPropertyChange('options');
      controller.notifyPropertyChange('options.mapTypeControlOptions');
    },

    setMapType(type) {
      const {controller} = this;
      controller.set('options.mapTypeId', type);
      controller.notifyPropertyChange('options');
    },

    toggleTilt() {
      const {controller} = this;
      const value = controller.get('options.tilt') === 0 ? 45 : 0;
      controller.set('options.tilt', value);
      controller.notifyPropertyChange('options');
    },

    toogleOptionsMap(force) {
      const {controller} = this;
      const current = controller.get('useOptionsMap');
      controller.set('useOptionsMap', force === undefined ? !current : force);
    },

    resetMapState() {
      const {controller} = this;
      controller.set('options', assign({}, MAP_DEFAULTS));
      controller.notifyPropertyChange('options');
    },

    onMapTypeIdChange(mapType = '') {
      const {controller} = this;

      if (mapType && controller.get('options.mapTypeId') !== mapType) {
        controller.set('options.mapTypeId', mapType);
      }
    },

    onZoomChanged(zoom) {
      const {controller} = this;

      if (parseInt(controller.get('options.zoom'), 10) !== parseInt(zoom, 10)) {
        controller.set('options.zoom', zoom);
      }
    },

    onCenterChanged(center) {
      const {controller} = this;
      const applyUpdatedCenter = ({lat, lng}) => {
        if (controller.get('options.lat') !== lat) {
          controller.set('options.lat', lat);
        }

        if (controller.get('options.lng') !== lng) {
          controller.set('options.lng', lng);
        }
      };

      run.scheduleOnce('render', this, applyUpdatedCenter, center);
    },

    willTransition() {
      this.controller.set('useOptionsMap', false);
    }
  }
});

function getRandomLatitude() {
  return (Math.random() * 90) * (Math.random() > 0.5 ? -1 : 1);
}

function getRandomLongitude() {
  return (Math.random() * 180) * (Math.random() > 0.5 ? -1 : 1);
}
