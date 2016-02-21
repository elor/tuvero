/**
 * No Description
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['core/listener'], function(Listener) {
  var listener, Storage;

  function getStorage() {
    Storage = Storage || require('ui/storage');
    return Storage;
  }

  listener = new Listener();
  listener.onupdate = function() {
    getStorage().store();
  };

  var AutocompletionLegacyBlobber = {
    autocompletionModel: undefined,
    set: function(model) {
      if (this.autocompletionModel) {
        this.autocompletionModel.unregisterListener(listener);
      }
      this.autocompletionModel = model;
      if (this.autocompletionModel) {
        this.autocompletionModel.registerListener(listener);
      }
    },
    toBlob: function() {
      if (!this.autocompletionModel) {
        return '[]';
      }
      return JSON.stringify(this.autocompletionModel.names);
    },
    fromBlob: function(blob) {
      if (this.autocompletionModel && blob && blob !== '') {
        this.autocompletionModel.set(JSON.parse(blob));
      }
    }
  };

  return AutocompletionLegacyBlobber;
});
