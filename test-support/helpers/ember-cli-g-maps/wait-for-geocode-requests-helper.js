import RSVP from 'rsvp';
import Ember from 'ember';
import getOwner from 'ember-owner/get';
import { assert } from 'ember-metal/utils';

const { Logger } = Ember;

export default function(app) {
  const container = (getOwner(app) || app.__container__);
  assert('failed to recover application container', container);

  const gMap = (container.lookup && container.lookup('service:gMap'));
  assert('gMap service lookup failed', gMap);

  return new Ember.Test.promise(function(resolve, reject) {
    Ember.Test.adapter.asyncStart();

    const queue = (gMap._geocodeQueue || []);

    if (!queue.length) {
      Logger.warn('Geocode request queue was not found, or is currently empty');
    }

    return RSVP.Promise.all(queue)
    .then(() => {
      Ember.run.scheduleOnce('afterRender', null, resolve);
      Ember.Test.adapter.asyncEnd();
    })
    .catch(() => {
      reject();
      Ember.Test.adapter.asyncEnd();
    });
  });
}
