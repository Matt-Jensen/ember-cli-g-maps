import Ember from 'ember';
import selectPlaceHelper from './select-place';

export default function() {
  Ember.Test.registerAsyncHelper('selectPlace', selectPlaceHelper);
}
