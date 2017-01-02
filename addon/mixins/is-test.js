import Mixin from 'ember-metal/mixin';
import computed from 'ember-computed';
import getOwner from 'ember-owner/get';

export default Mixin.create({
  /**
   * @private
   * @type {Boolean}
   */
  _isTest: computed(function() {
    return (getOwner(this).resolveRegistration('config:environment').environment === 'test');
  })
});
