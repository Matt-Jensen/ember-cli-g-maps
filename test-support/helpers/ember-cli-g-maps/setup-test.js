import TestGMapsService from './test-g-maps-service';

export default function(test) {

  // if it is an Acceptance test
  if (test.application) {
    test.application.register('service:test-g-maps', TestGMapsService);
    return;
  }

  test.register('service:test-g-maps', TestGMapsService);
  test.inject.service('test-g-maps');
  const service = test.get('test-g-maps');

  test.gMapsSelectPlace = function() {
    service.selectPlace(...arguments);
  }
}
