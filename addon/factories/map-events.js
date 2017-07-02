import get from 'ember-metal/get';
import run from 'ember-runloop';
import on from 'ember-evented/on';
import {assert} from 'ember-metal/utils';

const {isArray} = Array;

const UPDATE_PATH_EVENTS = ['insert_at', 'remove_at', 'set_at'];

/**
 * @param  {Array}  events
 * @param  {Array}  augmentedEvents
 * @param  {String} googleMapsInstanceScope
 * @return {Object}
 * Resolve a Component configuration for enabling the binding
 * of user specified actions to Google Map instance event listeners
 */
export default function mapEvents(settings = {}) {
  const events = settings.events || [];
  const augmentedEvents = settings.augmentedEvents || {};
  const {googleMapsInstanceScope} = settings;

  assert('Map Events expects `events` Array in settings', isArray(events));
  assert('Map Events expects `augmentedEvents` Object in settings', typeof augmentedEvents === 'object');
  assert('Map Events expects `googleMapsInstanceScope` String in settings', typeof googleMapsInstanceScope === 'string');

  return {
    /**
     * @public
     * @type {String}
     * Location of Google Maps instance object
     */
    googleMapsInstanceScope,

    /**
     * @type {Array}
     * List of supported Google Map instance events
     */
    _googleMapInstanceEvents: events,

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
    bindGoogleMapsInstanceEvents,

    /**
     * Remove all events bound to Google Maps instance during
     * `bindGoogleMapsInstanceEvents` hook
     */
    _mapEventsWillDestroyElement: on('willDestroyElement', function() {
      google.maps.event.clearInstanceListeners(get(this, `${this.googleMapsInstanceScope}.content`));
    })
  };
}

export function bindGoogleMapsInstanceEvents() {
  const mapObjInstance = get(this, this.googleMapsInstanceScope);

  assert(
    `Map Events requires a Google Map instance at ${this.googleMapsInstanceScope}.content`,
    typeof mapObjInstance === 'object' && mapObjInstance.content
  );

  this._googleMapInstanceEvents.forEach((event) => {
    const action = this.attrs[event];

    if (!action) { return; }

    const eventTarget = UPDATE_PATH_EVENTS.indexOf(event) !== -1 ?
      mapObjInstance.content.getPath() : // use path MVCArray for update path event
      mapObjInstance.content; // use Google Map instance

    /*
     * Use `run.next` to silence update path events until after setup
     */
    run.next(() => {
      const closureAction = (typeof action === 'function' ? action : run.bind(this, 'sendAction', event));

      eventTarget.addListener(event, (...args) => {
       /*
        * Accept both closure and declarative actions
        */
        const augmentedEventProperty = this._googleMapInstanceAugmentedEvents[event];

        if (augmentedEventProperty) {
          args.push(get(this, `${this.googleMapsInstanceScope}.${augmentedEventProperty}`)); // Event augmentation
        }

        // Invoke with all arguments
        closureAction(...args);
      });
    });
  });
}
