/**
 * Save button logic which initiates a file download of the current state for
 * later loading
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery';
import FileSaverModel from '../ui/filesavermodel.js';
import Toast from '../ui/toast.js';
import Strings from '../ui/strings.js';
let Save;
$(function ($) {
  $('#tabs').on('click', 'button.save', function () {
    let fileSaver;
    fileSaver = new FileSaverModel();
    if (!fileSaver.save()) {
      Toast.once(Strings.savefailed);
    }
  });
});
export default Save;