/**
 * Save button logic which initiates a file download of the current state for later loading
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/Blob', '../state', '../toast', '../strings', 'lib/FileSaver'], function(Blob, State, Toast, Strings, saveAs) {

  $(function($) {
    $('#tabs').on('click', 'button.save', function() {
      var save, blob;

      try {
        save = State.toBlob();

        try {
          blob = new Blob([save], {
            type: 'application/json'
          });
          saveAs(blob, 'boules.json');
        } catch (er) {
          console.error(er);
          new Toast(Strings.savefailed);
        }
      } catch (err) {
        console.error('State.toBlob failed');
        console.error(err.stack);
        new Toast(Strings.savefailed);
      }
    });
  });

  return undefined;
});
