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

    assert.ok($('#g-map-event-arguments [data-test-argument=center_changed]').text().trim(), 'center_changed called with map center');
    assert.ok($('#g-map-event-arguments [data-test-argument=heading_changed]').text().trim(), 'heading_changed called with map heading');
    assert.ok($('#g-map-event-arguments [data-test-argument=maptypeid_changed]').text().trim(), 'maptypeid_changed called with map type');
    assert.ok($('#g-map-event-arguments [data-test-argument=tilt_changed]').text().trim(), 'tilt_changed called with map tilt');
    assert.ok($('#g-map-event-arguments [data-test-argument=zoom_changed]').text().trim(), 'zoom_changed called with map zoom');
  });
});
