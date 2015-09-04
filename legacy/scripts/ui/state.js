/**
 * A singular object which represents the whole tournament state for the purpose
 * of being read from and written to storage.
 *
 * @return State
 * @implements ../backend/blobber
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['options', './state_new', './legacyloadermodel'], function(Options,
    State_New, LegacyLoaderModel) {
  var State;

  State = {
    /**
     * store the current program state in a blob
     *
     * @return the blob
     */
    toBlob: function() {
      return JSON.stringify(State_New.save());
    },

    /**
     * restore the program state from the blob
     *
     * @param blob
     *          the blob
     */
    fromBlob: function(blob) {
      var object, loader;

      State_New.clear();

      if (!blob) {
        return false;
      }

      object = JSON.parse(blob);

      if (!object.version) {
        console.warn('Saved data is older than 1.5.0. '
            + 'Tuvero tries to auto-convert it, but success is not guaranteed.'
            + 'Please check the results');

        loader = new LegacyLoaderModel();
        if (loader.load(blob)) {
          return true;
        }

        new Toast(Strings.oldsaveformat, Toast.LONG);
        return false;
      }

      if (!State_New.restore(object)) {
        return false;
      }

      return true;
    },

    /**
     * resets everything managed by Blob
     */
    reset: function() {
      State_New.clear();
    }
  };

  return State;
});
