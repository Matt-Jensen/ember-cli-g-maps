import Ember from 'ember';

const { $, assert } = Ember;
const GAUTOCOMPLETE_CLASS = 'g-autocomplete';
const GOOGLE_AUTOCOMPLETE_RESULTS = '.pac-container .pac-item';

export default function(app, requestedResult = 0, selector = `.${GAUTOCOMPLETE_CLASS}`) {
  return new Ember.Test.promise(function(resolve, reject) {

    // User only provided selector argument
    if (typeof requestedResult === 'string') {
      selector = requestedResult;
      requestedResult = 0;
    }

    longPollExternalElement(GOOGLE_AUTOCOMPLETE_RESULTS)
    .then((autocompletePlaces) => {
      const textResults = autocompletePlaces.map((i, el) => $(el).text());
      const [input] = app.testHelpers.find(selector);
      assert(`No g-autocomplete component found for selector: ${selector}`, input && $(input).hasClass(GAUTOCOMPLETE_CLASS))

      let targetResult = 0;

      /*
       * Set target to requested result if it exists
       */
      if (requestedResult > 0 && requestedResult <= (textResults.length - 1)) {
        targetResult = parseInt(requestedResult, 10);
      }

      /*
       * Keydown to requested result (40 = down arrow)
       */
      for (let i = 0; i <= targetResult; i++) {
        google.maps.event.trigger(input, 'keydown', { keyCode: 40 });
      }

      // Select active result (13 = Enter)
      google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
      Ember.run.later(() => resolve(textResults[targetResult]), 300);
    }, reject);
  });
}

export function longPollExternalElement(selector) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    const pollAgain = (function() {
      let counter = 0;

      return () => {
        /*
         * NOTE searching for elements potentially outside of #ember-testing container
         */
        const results = $(selector);

        if (results.length) {
          return resolve(results);
        }

        if (counter > 5) {
          return reject();
        }

        counter++;
        Ember.run.later(pollAgain, 300);
      }
    }());

    pollAgain();
  });
};
