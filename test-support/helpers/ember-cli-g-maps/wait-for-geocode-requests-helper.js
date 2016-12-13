import Ember from 'ember';
import { assert } from 'ember-metal/utils';

const { getOwner, RSVP, Logger } = Ember;

export default function(app) {
  const container = (getOwner(app) || app.__container__);
  assert('failed to recover application container', container);

  const gMap = (container.lookup && container.lookup('service:gMap'));
  assert('gMap service lookup failed', gMap);

  const queue = (gMap._geocodeQueue || []);

  if (!queue.length) {
    Logger.warn('Geocode request queue was not found, or is currently empty');
  }

  return new Ember.Test.promise(function(resolve, reject) {
    Ember.Test.adapter.asyncStart();

    return RSVP.Promise.all(queue)
    .then(() =>
      Ember.run.later(() => resolve()))
    .catch(reject)
    .finally(() => Ember.Test.adapter.asyncEnd());
  });
}
