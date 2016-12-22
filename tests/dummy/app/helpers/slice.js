import { helper } from 'ember-helper';

export function slice([string, start = 0, end = Infinity]) {
  if (string && `${string}`.length > end) {
    return `${string}`.slice(start, end);
  } else {
    return string;
  }
}

export default helper(slice);
