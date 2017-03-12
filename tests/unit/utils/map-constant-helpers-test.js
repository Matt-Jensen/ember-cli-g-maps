import {
  getAnimation,
  getAnimationId,
  getSymbolPath,
  getSymbolPathId
} from 'dummy/utils/map-constant-helpers';
import { module, test } from 'qunit';

const ANIMATIONS = google.maps.Animation;
const ANIMATION_NAMES = Object.keys(ANIMATIONS);
const ANIMATION_IDS = ANIMATION_NAMES.map((k) => ANIMATIONS[k]);

module('Unit | Utility | map constant helpers | Animations');

test('it converts all google map Animation ids to matching name', function(assert) {
  assert.expect(ANIMATION_NAMES.length);

  ANIMATION_IDS.forEach((id, i) => {
    assert.equal(getAnimation(id), ANIMATION_NAMES[i]);
  });
});

test('it converts all google map Animation names to matching id', function(assert) {
  assert.expect(ANIMATION_NAMES.length);

  ANIMATION_NAMES.forEach((name, i) => {
    assert.equal(getAnimationId(name), ANIMATION_IDS[i]);
  });
});

const SYMBOL_PATHS = google.maps.SymbolPath;
const SYMBOL_PATH_NAMES = Object.keys(SYMBOL_PATHS);
const SYMBOL_PATH_IDS = SYMBOL_PATH_NAMES.map((k) => SYMBOL_PATHS[k]);

module('Unit | Utility | map constant helpers | SymbolPaths');

test('it converts all google map SymbolPath ids to matching name', function(assert) {
  assert.expect(SYMBOL_PATH_NAMES.length);

  SYMBOL_PATH_IDS.forEach((id, i) => {
    assert.equal(getSymbolPath(id), SYMBOL_PATH_NAMES[i]);
  });
});

test('it converts all google map SymbolPath names to matching id', function(assert) {
  assert.expect(SYMBOL_PATH_NAMES.length);

  SYMBOL_PATH_NAMES.forEach((name, i) => {
    assert.equal(getSymbolPathId(name), SYMBOL_PATH_IDS[i]);
  });
});
