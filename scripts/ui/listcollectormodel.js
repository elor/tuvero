import Model from '../core/model.js';
import Listener from '../core/listener.js';

/**
 * Constructor
 *
 * @param list
 *          a list of elements to listen to
 * @param ContentModel
 *          the constructor of all contained elements
 */
class ListCollectorModel extends Model {
  constructor(list, ContentModel) {
    super();
    this.list = list;
    this.createListListener();
    this.createEventCallbacks(ContentModel);
    this.registerExistingElements();
  }

  /**
   * create a listener object and bind it to this.
   *
   * whenever list elements are added or removed, the collector is registered or
   * unregistered from their emitters
   */
  createListListener() {
    this.listener = new Listener(this.list);
    this.listener.collector = this;
    this.listener.list = this.list;

    /**
     * register to inserted emitters
     */
    this.listener.oninsert = function (emitter, event, data) {
      data.object.registerListener(this.collector);
    };

    /**
     * unregister from removed emitters
     */
    this.listener.onremove = function (emitter, event, data) {
      // avoid the unregistration of multiply inserted emitters
      if (this.list.indexOf(data.object) === -1) {
        data.object.unregisterListener(this.collector);
      }
    };
  }

  /**
   * for every possible event of the ContentModel, add a proxy callback.
   *
   * See ListCollectorModel.PROXYCALLBACK for a note on how events are passed
   * through
   *
   * @param ContentModel
   *          the class of which the list elements are instances
   */
  createEventCallbacks(ContentModel) {
    let event;
    this.EVENTS = {};
    for (event in ContentModel.prototype.EVENTS) {
      if (ContentModel.prototype.EVENTS[event]) {
        this.EVENTS[event] = true;
        this['on' + event] = ListCollectorModel.PROXYCALLBACK;
      }
    }
  }

  /**
   * For every element, register a listener. Should only be used during the
   * constructor call
   */
  registerExistingElements() {
    this.list.map(function (emitter) {
      emitter.registerListener(this);
    }, this);
  }

  /**
   * pass a recieved event through to the own emitter.
   *
   * The original emitter is written to data.source, unless data.source already
   * exists, in which case it is assumed that there's a chain of collectors.
   * Hence, the direct of this event emitter will be discarded in favor of the
   * original emitter.
   *
   * @param emitter
   *          the original emitter, i.e. the ListModel instance
   * @param event
   *          the event type, e.g. "update" or "reset"
   * @param data
   *          an optional data object
   */
  static PROXYCALLBACK(emitter, event, data) {
    if (!data || typeof data !== 'object') {
      data = {};
    }
    // TODO get rid of "source" field
    if (!data.source) {
      data.source = emitter;
    }
    this.emit(event, data);
  }
}

export default ListCollectorModel;