import RSVP from 'rsvp';
import Component from 'ember-component';
import get from 'ember-metal/get';
import run from 'ember-runloop';
import Evented from 'ember-evented';
import {assert} from 'ember-metal/utils';

import ENV from '../configuration';

const googleMapScope = ENV.googleMap.scope;

const GMapChildComponent = Component.extend(Evented, {
  init() {
    this._super(...arguments);
    assert('g-map-child requires a `insertedGoogleMapCanvas` method', this.insertedGoogleMapCanvas);
  },

  /**
   * @param {Object} options   Current Map Instance options
   * @return {RSVP.Promise}    Wait for Marker's map to instantiate
   * Method invoked when Google Maps libraries have loaded
   * and the `didInsertElement` lifecycle hook has fired
   */
  insertGoogleMapInstance(options) {
    this._super(...arguments);

    return new RSVP.Promise((resolve) => {
      /*
       * Ensure Google Map Canvas instantiated
       */
      run.later(() => {
        this.insertedGoogleMapCanvas(get(this, googleMapScope), options);

        /*
         * Allow event event binding to occur before `didUpdateAttrs`
         */
        run.later(() => this.trigger('didUpdateAttrs'));
        resolve();
      });
    });
  }
});

GMapChildComponent.reopenClass({
  positionalParams: [googleMapScope]
});

export default GMapChildComponent;
