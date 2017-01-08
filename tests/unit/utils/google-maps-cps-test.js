import EmberObject from 'ember-object';
import googleMapsCps from 'dummy/utils/google-maps-cps';
import {module, test} from 'qunit';

module('Unit | Utility | google maps cps');

test('it calls `setCenter` with valid center coordinate', function(assert) {
  assert.expect(5);

  const expected = {lat: 32, lng: -90};
  const CPClass = EmberObject.extend({center: googleMapsCps.center});
  const instance = CPClass.create({
    content: {
      setCenter(center) {
        assert.deepEqual(center, expected, 'updated center with valid coordinate');
      },

      getCenter() {
        return {lat: () => expected.lat, lng: () => expected.lng};
      }
    }
  });

  assert.throws(() => instance.set('center', [-34, -90]), 'only accepts latLng literal');
  assert.throws(() => instance.set('center', {lat: 34}), 'requires a `lng` property');
  assert.throws(() => instance.set('center', {lng: -90}), 'requires a `lat` property');

  instance.set('center', expected);
  assert.deepEqual(instance.get('center'), expected, 'resolved updated center');
});

test('it only allows setting a valid clickable value', function(assert) {
  assert.expect(3);

  const expected = false;
  const CPClass = EmberObject.extend({clickable: googleMapsCps.clickable});
  const instance = CPClass.create({
    content: {
      setOptions({clickable}) {
        assert.equal(clickable, expected, 'updated clickable');
        this.clickable = expected;
      }
    }
  });

  assert.throws(() => instance.set('clickable', 'non-boolean'), 'rejects non-boolean value');

  instance.set('clickable', expected);
  instance.notifyPropertyChange('clickable');
  assert.equal(instance.get('clickable'), expected, 'resolved updated clickable');
});

test('it allows setting clickable to false with any falsey value', function(assert) {
  const CPClass = EmberObject.extend({clickable: googleMapsCps.clickable});
  const instance = CPClass.create({
    content: {
      setOptions({clickable}) {
        assert.equal(clickable, false, 'updated clickable to false');
      }
    }
  });

  instance.set('clickable', null);
});

test('it only allows setting a valid draggable value', function(assert) {
  assert.expect(3);

  const expected = true;
  const CPClass = EmberObject.extend({draggable: googleMapsCps.draggable});
  const instance = CPClass.create({
    content: {
      setOptions({draggable}) {
        assert.equal(draggable, expected, 'updated draggable');
        this.draggable = expected;
      }
    }
  });

  assert.throws(() => instance.set('draggable', 'non-boolean'), 'rejects non-boolean value');

  instance.set('draggable', expected);
  instance.notifyPropertyChange('draggable');
  assert.equal(instance.get('draggable'), expected, 'resolved updated draggable');
});

test('it allows setting draggable to false with any falsey value', function(assert) {
  const CPClass = EmberObject.extend({draggable: googleMapsCps.draggable});
  const instance = CPClass.create({
    content: {
      setOptions({draggable}) {
        assert.equal(draggable, false, 'updated draggable to false');
      }
    }
  });

  instance.set('draggable', null);
});

test('it only allows setting a valid editable value', function(assert) {
  assert.expect(3);

  const expected = true;
  const CPClass = EmberObject.extend({editable: googleMapsCps.editable});
  const instance = CPClass.create({
    content: {
      setOptions({editable}) {
        assert.equal(editable, expected, 'updated editable');
        this.editable = expected;
      }
    }
  });

  assert.throws(() => instance.set('editable', 'non-boolean'), 'rejects non-boolean value');

  instance.set('editable', expected);
  instance.notifyPropertyChange('editable');
  assert.equal(instance.get('editable'), expected, 'resolved updated editable');
});

test('it allows setting editable to false with any falsey value', function(assert) {
  const CPClass = EmberObject.extend({editable: googleMapsCps.editable});
  const instance = CPClass.create({
    content: {
      setOptions({editable}) {
        assert.equal(editable, false, 'updated editable to false');
      }
    }
  });

  instance.set('editable', null);
});

test('it only allows setting a valid fillColor value', function(assert) {
  assert.expect(3);

  const expected = '#cccccc';
  const CPClass = EmberObject.extend({fillColor: googleMapsCps.fillColor});
  const instance = CPClass.create({
    content: {
      setOptions({fillColor}) {
        assert.equal(fillColor, expected, 'updated fillColor');
        this.fillColor = expected;
      }
    }
  });

  assert.throws(() => instance.set('fillColor', true), 'rejects non-string value');

  instance.set('fillColor', expected);
  instance.notifyPropertyChange('fillColor');
  assert.equal(instance.get('fillColor'), expected, 'resolved updated fillColor');
});

test('it allows setting fillColor to default with any falsey value', function(assert) {
  const expected = '#000000';
  const CPClass = EmberObject.extend({fillColor: googleMapsCps.fillColor});
  const instance = CPClass.create({
    defaults: {fillColor: expected},
    content: {
      setOptions({fillColor}) {
        assert.equal(fillColor, expected, 'updated fillColor to default');
      }
    }
  });

  instance.set('fillColor', null);
});

test('it only allows setting a valid fillOpacity value', function(assert) {
  assert.expect(5);

  const expected = 0.85;
  const CPClass = EmberObject.extend({fillOpacity: googleMapsCps.fillOpacity});
  const instance = CPClass.create({
    content: {
      setOptions({fillOpacity}) {
        assert.equal(fillOpacity, expected, 'updated fillOpacity');
        this.fillOpacity = expected;
      }
    }
  });

  assert.throws(() => instance.set('fillOpacity', true), 'rejects non-numeric value');
  assert.throws(() => instance.set('fillOpacity', 1.1), 'rejects opacity greater than 1');
  assert.throws(() => instance.set('fillOpacity', -0.1), 'rejects opacity less than 1');

  instance.set('fillOpacity', expected);
  instance.notifyPropertyChange('fillOpacity');
  assert.equal(instance.get('fillOpacity'), expected, 'resolved updated fillOpacity');
});

test('it allows setting fillOpacity to default with any falsey value', function(assert) {
  const expected = 1;
  const CPClass = EmberObject.extend({fillOpacity: googleMapsCps.fillOpacity});
  const instance = CPClass.create({
    defaults: {fillOpacity: expected},
    content: {
      setOptions({fillOpacity}) {
        assert.equal(fillOpacity, expected, 'updated fillOpacity to default');
      }
    }
  });

  instance.set('fillOpacity', NaN);
});

test('it only allows setting a valid geodesic value', function(assert) {
  assert.expect(3);

  const expected = true;
  const CPClass = EmberObject.extend({geodesic: googleMapsCps.geodesic});
  const instance = CPClass.create({
    content: {
      setOptions({geodesic}) {
        assert.equal(geodesic, expected, 'updated geodesic');
        this.geodesic = expected;
      }
    }
  });

  assert.throws(() => instance.set('geodesic', 'non-boolean'), 'rejects non-boolean value');

  instance.set('geodesic', expected);
  instance.notifyPropertyChange('geodesic');
  assert.equal(instance.get('geodesic'), expected, 'resolved updated geodesic');
});

test('it allows setting geodesic to false with any falsey value', function(assert) {
  const CPClass = EmberObject.extend({geodesic: googleMapsCps.geodesic});
  const instance = CPClass.create({
    content: {
      setOptions({geodesic}) {
        assert.equal(geodesic, false, 'updated geodesic to false');
      }
    }
  });

  instance.set('geodesic', null);
});

test('it only allows setting a valid opacity value', function(assert) {
  assert.expect(5);

  const expected = 0.85;
  const CPClass = EmberObject.extend({opacity: googleMapsCps.opacity});
  const instance = CPClass.create({
    content: {
      setOptions({opacity}) {
        assert.equal(opacity, expected, 'updated opacity');
        this.opacity = expected;
      }
    }
  });

  assert.throws(() => instance.set('opacity', true), 'rejects non-numeric value');
  assert.throws(() => instance.set('opacity', 1.1), 'rejects opacity greater than 1');
  assert.throws(() => instance.set('opacity', -0.1), 'rejects opacity less than 1');

  instance.set('opacity', expected);
  instance.notifyPropertyChange('opacity');
  assert.equal(instance.get('opacity'), expected, 'resolved updated opacity');
});

test('it allows setting opacity to default with any falsey value', function(assert) {
  const expected = 1;
  const CPClass = EmberObject.extend({opacity: googleMapsCps.opacity});
  const instance = CPClass.create({
    defaults: {opacity: expected},
    content: {
      setOptions({opacity}) {
        assert.equal(opacity, expected, 'updated opacity to default');
      }
    }
  });

  instance.set('opacity', NaN);
});

test('it only allows setting a valid strokeColor value', function(assert) {
  assert.expect(3);

  const expected = '#cccccc';
  const CPClass = EmberObject.extend({strokeColor: googleMapsCps.strokeColor});
  const instance = CPClass.create({
    content: {
      setOptions({strokeColor}) {
        assert.equal(strokeColor, expected, 'updated strokeColor');
        this.strokeColor = expected;
      }
    }
  });

  assert.throws(() => instance.set('strokeColor', true), 'rejects non-string value');

  instance.set('strokeColor', expected);
  instance.notifyPropertyChange('strokeColor');
  assert.equal(instance.get('strokeColor'), expected, 'resolved updated strokeColor');
});

test('it allows setting strokeColor to default with any falsey value', function(assert) {
  const expected = '#000000';
  const CPClass = EmberObject.extend({strokeColor: googleMapsCps.strokeColor});
  const instance = CPClass.create({
    defaults: {strokeColor: expected},
    content: {
      setOptions({strokeColor}) {
        assert.equal(strokeColor, expected, 'updated strokeColor to default');
      }
    }
  });

  instance.set('strokeColor', null);
});

test('it only allows setting a valid strokeOpacity value', function(assert) {
  assert.expect(5);

  const expected = 0.85;
  const CPClass = EmberObject.extend({strokeOpacity: googleMapsCps.strokeOpacity});
  const instance = CPClass.create({
    content: {
      setOptions({strokeOpacity}) {
        assert.equal(strokeOpacity, expected, 'updated strokeOpacity');
        this.strokeOpacity = expected;
      }
    }
  });

  assert.throws(() => instance.set('strokeOpacity', true), 'rejects non-numeric value');
  assert.throws(() => instance.set('strokeOpacity', 1.1), 'rejects opacity greater than 1');
  assert.throws(() => instance.set('strokeOpacity', -0.1), 'rejects opacity less than 1');

  instance.set('strokeOpacity', expected);
  instance.notifyPropertyChange('strokeOpacity');
  assert.equal(instance.get('strokeOpacity'), expected, 'resolved updated strokeOpacity');
});

test('it allows setting strokeOpacity to default with any falsey value', function(assert) {
  const expected = 1;
  const CPClass = EmberObject.extend({strokeOpacity: googleMapsCps.strokeOpacity});
  const instance = CPClass.create({
    defaults: {strokeOpacity: expected},
    content: {
      setOptions({strokeOpacity}) {
        assert.equal(strokeOpacity, expected, 'updated strokeOpacity to default');
      }
    }
  });

  instance.set('strokeOpacity', NaN);
});

test('it only allows setting a valid strokePosition value', function(assert) {
  assert.expect(4);

  const expected = 'INSIDE';
  const CPClass = EmberObject.extend({strokePosition: googleMapsCps.strokePosition});
  const instance = CPClass.create({
    content: {
      setOptions({strokePosition}) {
        assert.equal(strokePosition, google.maps.StrokePosition[expected], 'updated strokePosition');
        this.strokePosition = strokePosition;
      }
    }
  });

  assert.throws(() => instance.set('strokePosition', true), 'rejects non-string value');
  assert.throws(() => instance.set('strokePosition', 'NON-POSITION'), 'rejects an invalid stroke position');

  instance.set('strokePosition', expected);
  instance.notifyPropertyChange('strokePosition');
  assert.equal(instance.get('strokePosition'), expected, 'resolved updated strokePosition');
});

test('it allows reseting strokePosition to default with any falsey value', function(assert) {
  const expected = 'CENTER';
  const CPClass = EmberObject.extend({strokePosition: googleMapsCps.strokePosition});
  const instance = CPClass.create({
    defaults: {strokePosition: expected},
    content: {
      setOptions({strokePosition}) {
        assert.equal(strokePosition, google.maps.StrokePosition[expected], 'updated strokePosition to default');
      }
    }
  });

  instance.set('strokePosition', null);
});

test('it only allows setting a valid strokeWeight value', function(assert) {
  assert.expect(3);

  const expected = 20;
  const CPClass = EmberObject.extend({strokeWeight: googleMapsCps.strokeWeight});
  const instance = CPClass.create({
    content: {
      setOptions({strokeWeight}) {
        assert.equal(strokeWeight, expected, 'updated strokeWeight');
        this.strokeWeight = expected;
      }
    }
  });

  assert.throws(() => instance.set('strokeWeight', true), 'rejects non-numeric value');

  instance.set('strokeWeight', expected);
  instance.notifyPropertyChange('strokeWeight');
  assert.equal(instance.get('strokeWeight'), expected, 'resolved updated strokeWeight');
});

test('it allows reset strokeWeight to default with any falsey value', function(assert) {
  const expected = 3;
  const CPClass = EmberObject.extend({strokeWeight: googleMapsCps.strokeWeight});
  const instance = CPClass.create({
    defaults: {strokeWeight: expected},
    content: {
      setOptions({strokeWeight}) {
        assert.equal(strokeWeight, expected, 'updated strokeWeight to default');
      }
    }
  });

  instance.set('strokeWeight', NaN);
});

test('it only allows setting a valid visible value', function(assert) {
  assert.expect(3);

  const expected = false;
  const CPClass = EmberObject.extend({visible: googleMapsCps.visible});
  const instance = CPClass.create({
    content: {
      setOptions({visible}) {
        assert.equal(visible, expected, 'updated visible');
        this.visible = expected;
      }
    }
  });

  assert.throws(() => instance.set('visible', 'non-boolean'), 'rejects non-boolean value');

  instance.set('visible', expected);
  instance.notifyPropertyChange('visible');
  assert.equal(instance.get('visible'), expected, 'resolved updated visible');
});

test('it allows setting visible to false with any falsey value', function(assert) {
  const CPClass = EmberObject.extend({visible: googleMapsCps.visible});
  const instance = CPClass.create({
    content: {
      setOptions({visible}) {
        assert.equal(visible, false, 'updated visible to false');
      }
    }
  });

  instance.set('visible', null);
});

test('it only allows setting a valid zIndex value', function(assert) {
  assert.expect(4);

  const expected = 100;
  const CPClass = EmberObject.extend({zIndex: googleMapsCps.zIndex});
  const instance = CPClass.create({
    content: {
      setOptions({zIndex}) {
        assert.equal(zIndex, expected, 'updated zIndex');
        this.zIndex = expected;
      }
    }
  });

  assert.throws(() => instance.set('zIndex', true), 'rejects non-numeric value');
  assert.throws(() => instance.set('zIndex', 100.1), 'rejects floating point numbers');

  instance.set('zIndex', expected);
  instance.notifyPropertyChange('zIndex');
  assert.equal(instance.get('zIndex'), expected, 'resolved updated zIndex');
});

test('it allows setting zIndex to null with any falsey value', function(assert) {
  const CPClass = EmberObject.extend({zIndex: googleMapsCps.zIndex});
  const instance = CPClass.create({
    content: {
      setOptions({zIndex}) {
        assert.equal(zIndex, null, 'updated zIndex to null');
      }
    }
  });

  instance.set('zIndex', NaN);
});
