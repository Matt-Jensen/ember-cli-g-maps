import Mixin from 'ember-metal/mixin';
import set from 'ember-metal/set';

import loadGoogleMaps from 'ember-cli-g-maps/utils/load-google-maps';

export default Mixin.create({
  init() {
    this._super(...arguments);

    return loadGoogleMaps().then((googleMaps) => {
      set(this, 'strokePositions', Object.keys(googleMaps.StrokePosition));
    });
  }
});
