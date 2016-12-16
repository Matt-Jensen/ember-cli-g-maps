import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | g-map');

test('g-map events', function(assert) {
  const events = [
    'bounds_changed',
    'center_changed',
    'click',
    'dblclick',
    'drag',
    'dragend',
    'dragstart',
    'heading_changed',
    'idle',
    // 'loaded', <- Should fire automatically
    'maptypeid_changed',
    'mousemove',
    'mouseout',
    'mouseover',
    'projection_changed',
    'resize',
    'rightclick',
    'tilesloaded',
    'tilt_changed',
    'zoom_changed'
  ];

  visit('/basic-usage/map-events');

  waitForGoogleMap();
  events.forEach((evt) => triggerGoogleMapEvent(evt));

  andThen(() => {
    events.forEach((evt) => {
      assert.equal($(`#g-map-event-states [data-test-updated=${evt}]`).length, 1, `fires ${evt} event`);
    });
  });
});
