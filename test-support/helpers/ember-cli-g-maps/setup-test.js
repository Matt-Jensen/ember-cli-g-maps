import TestGMapsService from './test-g-maps-service';

export default function(test) {
  let isAcceptanceTest = test.application != null;
  if (isAcceptanceTest) {
    test.application.register('service:test-g-maps', TestGMapsService);
    return;
  }

  test.register('service:test-g-maps', TestGMapsService);
  test.inject.service('test-g-maps');
  let service = test.get('test-g-maps');

  test.gMapsSelectPlace = function() {
    service.selectPlace(...arguments);
  }
}
