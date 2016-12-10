import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

import registerAsyncHelpers from './ember-cli-g-maps/register-async-helpers';

export default function startApp(attrs) {
  let application;

  // use defaults, but you can override
  let attributes = Ember.assign({}, config.APP, attrs);

  Ember.run(() => {
    application = Application.create(attributes);
    registerAsyncHelpers();
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
