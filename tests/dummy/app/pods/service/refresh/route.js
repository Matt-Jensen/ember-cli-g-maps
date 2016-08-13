import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 5,
      gMap: Ember.inject.service(),
      disableButton: false,
      mapState: '',
      actions: {
        refresh() {
          Ember.$('#resize-parent-container').css('width', '100%');

          this.set('mapState', 'Resizing Container');
          this.set('disableButton', true);

          Ember.run.later(() => {
            this.set('mapState', 'Refreshing Map');
            this.get('gMap').maps.refresh('gmaps-refresh-map');

            Ember.run.later(this._resetMap.bind(this), 2000);
          }, 1000);
        }
      },

      _resetMap() {
        this.set('mapState', '');
        this.set('disableButton', false);
        Ember.$('#resize-parent-container').css('width', '50%');
        this.get('gMap').maps.refresh('gmaps-refresh-map');
      }
    });
  }
});
