import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

import registerAsyncHelpers from './ember-cli-g-maps/register-async-helpers';

export default function startApp(attrs) {
  let application;

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes);
    registerAsyncHelpers();
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
