import get from 'ember-metal/get';
import run from 'ember-runloop';
import {assert} from 'ember-metal/utils';

const {isArray} = Array;

/**
 * @param  {Array}  events
 * @param  {Array}  augmentedEvents
 * @param  {String} googleMapsInstanceScope
 * @return {Object}
 * Resolve a Component configuration for enabling the binding
 * of user specified actions to Google Map instance event listeners
 */
export default function mapEvents(config = {}) {
  const events = config.events || [];
  const augmentedEvents = config.augmentedEvents || {};
  const googleMapsInstanceScope = config.googleMapsInstanceScope || 'map';

  assert('Map Events expects `events` to be an Array', isArray(events));
  assert('Map Events expects `augmentedEvents` to be an Object', typeof augmentedEvents === 'object');
  assert('Map Events expects `googleMapsInstanceScope` to be a String', typeof googleMapsInstanceScope === 'string');

  return {
    /**
     * @type {Array}
     * List of supported Google Map instance events
     */
    _googleMapInstanceEvents: events,

   /**
    * @type {String}
    * Location of Google Map instance within component
    */
    _googleMapInstanceScope: googleMapsInstanceScope,

   /**
    * @type {Object}
    * Dictionary of Google Map instance events that must
    * be augmented with stateful data from that instance
    */
    _googleMapInstanceAugmentedEvents: augmentedEvents,

   /**
    * @public
    * Add event handlers to the Components' Google Map instance
    * appending optional stateful data to, whitelisted, augmented
    * events.
    */
    bindGoogleMapsInstanceEvents
  };
}

export function bindGoogleMapsInstanceEvents() {
  const googleMapsInstance = get(this, this._googleMapInstanceScope);

  assert(
    `Map Events requires a Google Map instance at ${this._googleMapInstanceScope}.content`,
    typeof googleMapsInstance === 'object' && googleMapsInstance.content
  );

  this._googleMapInstanceEvents.forEach((event) => {
    const action = this.attrs[event];

    if (action) {
      googleMapsInstance.content.addListener(event, (...args) => {
        /*
        * Accept both closure and declarative actions
        */
        const closureAction = (typeof action === 'function' ? action : run.bind(this, 'sendAction', event));
        const augmentedEventProperty = this._googleMapInstanceAugmentedEvents[event];

        if (augmentedEventProperty) {
          args.push(get(this, `${this._googleMapInstanceScope}.${augmentedEventProperty}`)); // Event augmentation
        }

        // Invoke with all arguments
        return closureAction(...args);
      });
    }
  });
}
