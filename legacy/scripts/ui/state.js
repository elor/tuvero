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
define(['options', './state_new', './shared'], function(Options, State_New,
    Shared) {
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
      var object;

      State_New.clear();

      if (!blob) {
        return false;
      }

      object = JSON.parse(blob);

      if (!object.version) {
        console.error('Saved data is older than 1.5.0. '
            + 'It cannot be loaded by newer versions yet. '
            + 'An automatic converter is being worked on.');
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

  Shared.State = State;
  return State;
});
