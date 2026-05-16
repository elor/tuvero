/**
 * Save button logic which initiates a file download of the current state for
 * later loading
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery';
import Toast from '../ui/toast.js';
import Strings from '../ui/strings.js';
import Server from '../ui/server.js';
import State from '../ui/state.js';
import Listener from '../core/listener.js';
function upload() {
  var serverlink = State.serverlink.get();
  var uploadToast;
  if (!Server.logged_in.get()) {
    Toast.once(Strings.not_logged_in);
  } else if (!serverlink) {
    Toast.once(Strings.state_not_linked);
  } else {
    var message = Server.message('/t/' + serverlink + '/state/upload', State.save());
    uploadToast = Toast.once(Strings.state_uploading, Toast.INFINITE);
    Listener.bind(message, 'error', function (emitter, event, data) {
      Toast.once(Strings.state_upload_failed);
      console.error(data);
    });
    Listener.bind(message, 'receive', function () {
      Toast.once(Strings.state_upload_complete);
    });
    Listener.bind(message, 'complete', function (emitter, event, data) {
      uploadToast.close();
    });
    message.send();
  }
}
$(function ($) {
  $('#tabs').on('click', 'button.upload', function () {
    upload();
  });
});
export default upload;