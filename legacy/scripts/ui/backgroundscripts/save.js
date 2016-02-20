/**
 * Save button logic which initiates a file download of the current state for
 * later loading
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/Blob', 'jquery', 'timemachine/timemachine', '../toast',
    '../strings', 'lib/FileSaver', 'presets'], function(Blob, $, TimeMachine,
    Toast, Strings, saveAs, Presets) {
  var Save = undefined;

  $(function($) {
    $('#tabs').on('click', 'button.save', function() {
      var save, blob;

      if (!TimeMachine.commit) {
        return;
      }

      try {
        save = TimeMachine.commit.load();
        if (!save) {
          return;
        }

        try {
          blob = new Blob([save], {
            type: 'application/json'
          });
          saveAs(blob, Presets.names.savefile);
        } catch (er) {
          console.error(er);
          new Toast(Strings.savefailed);
        }
      } catch (err) {
        console.error('blob load failed');
        console.error(err.stack);
        new Toast(Strings.savefailed);
      }
    });
  });

  return Save;
});
