import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';

import './helpers/stub-autocomplete';
import './helpers/notify-autocomplete';

setResolver(resolver);
