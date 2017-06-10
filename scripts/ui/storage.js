/**
 * Storage: Save ValueModels and save/restore-compatible models whenever they
 * emit 'update'.
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/type', 'core/model', 'core/valuemodel',
    'core/listener'], function(extend, Type, Model, ValueModel, Listener) {
  /**
   * A Storage class. Has no further use at the moment, since there's only one
   * localStorage.
   */
  function Storage() {
  }

  /**
   * Test whether stuff can be stored
   *
   * @return true if storage is possible, false otherwise
   */
  Storage.available = function() {
    if (!window.localStorage) {
      console.error('Storage is not available');
      return false;
    }

    return true;
  };

  /**
   * stored model instances, i.e. values
   */
  Storage.values = {};

  /**
   * Register or retrieve an instance of the Implementation class:
   *
   * @param key
   *          the Key under which to store it
   * @param Implementation
   *          A constructor which is a subclass of Model, i.e. ValueModel. It is
   *          required to either support save/restore or be a ValueModel
   *          subclass.
   * @return an singleton instance of the Implementation class, or undefined if
   *         anything fails (e.g. Implementation is the wrong type)
   */
  Storage.register = function(key, Implementation) {
    var stored, model;

    key = key || undefined;
    Implementation = Implementation || Model;

    if (!key || !Type.isString(key)) {
      console.error('Storage.getModel(): Key is not a String: ');
      console.error(key);
      return undefined;
    }

    if (!extend.isSubclass(Implementation, Model) && Implementation !== Model) {
      console.error('Storage.register(): Not a model: ');
      console.error(Implementation);
      return undefined;
    }

    if (!Storage.available()) {
      return undefined;
    }

    model = Storage.values[key];
    if (model) {
      if (model instanceof Implementation) {
        return model;
      }

      console.error('Storage.register(): '
          + 'stored instance does not match Implementation:');
      console.error(model);
      console.error(Implementation);
      return undefined;
    }

    model = new Implementation();
    if (Type.isFunction(model.save)) {
      Listener.bind(model, 'update', function() {
        window.localStorage.setItem(key, JSON.stringify(model.save()));
      });
    } else if (model instanceof ValueModel) {
      Listener.bind(model, 'update', function() {
        window.localStorage.setItem(key, JSON.stringify(model.get()));
      });
    } else {
      console.error('Storage.register(): instance cannot save/restore');
      console.error(model);
      return undefined;
    }

    stored = window.localStorage.getItem(key);
    if (Type.isString(stored)) {
      stored = JSON.parse(stored);
      if (Type.isFunction(model.restore)) {
        model.restore(stored);
      } else if (model instanceof ValueModel) {
        model.set(stored);
      }
    }

    Storage.values[key] = model;
    return model;
  };

  /**
   * remove this and only this key from localStorage to avoid collision with
   * other software under the same domain.
   *
   * @param key
   *          The key to remove from localStorage. if undefined, clear every key
   *          in the keys object
   */
  Storage.clear = function(key) {
    if (!Storage.available()) {
      return;
    }

    if (key === undefined) {
      Object.keys(Storage.values).forEach(Storage.clear.bind(Storage));
    } else {
      if (Storage.values[key]) {
        Storage.values[key].destroy();
      }
      window.localStorage.removeItem(key);
    }
  };

  return Storage;
});
