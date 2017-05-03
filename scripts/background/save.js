/**
 * Save button logic which initiates a file download of the current state for
 * later loading
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'ui/filesavermodel', 'ui/toast', 'ui/strings'], function($,
    FileSaverModel, Toast, Strings) {
  var Save = undefined;

  $(function($) {
    $('#tabs').on('click', 'button.save', function() {
      var fileSaver;

      fileSaver = new FileSaverModel();
      if (!fileSaver.save()) {
        new Toast(Strings.savefailed);
      }
    });
  });

  return Save;
});
