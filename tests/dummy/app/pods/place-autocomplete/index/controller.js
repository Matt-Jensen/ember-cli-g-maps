import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showCoordinates({lat, lng, place}) {
      this.set('lat', lat);
      this.set('lng', lng);
      this.set('address', place.formatted_address);
    }
  }
});
