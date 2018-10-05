/**
 * Save button logic which initiates a file download of the current state for
 * later loading
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["jquery", "ui/toast", "ui/strings", "ui/server", "ui/state", "core/listener"],
  function ($, Toast, Strings, Server, State, Listener) {
    function upload() {
      var serverlink = State.serverlink.get();
      var uploadToast;

      if (!Server.logged_in.get()) {
        new Toast(Strings.not_logged_in);
      } else if (!serverlink) {
        new Toast(Strings.state_not_linked);
      } else {
        var message = Server.message("/t/" + serverlink + "/state/upload", State.save());
        uploadToast = new Toast(Strings.state_uploading, Toast.INFINITE);
        Listener.bind(message, "error", function (emitter, event, data) {
          new Toast(Strings.state_upload_failed);
          console.error(data);
        });
        Listener.bind(message, "receive", function () {
          new Toast(Strings.state_upload_complete);
        });
        Listener.bind(message, "complete", function (emitter, event, data) {
          uploadToast.close();
        });
        message.send();
      }
    }

    $(function ($) {
      $("#tabs").on("click", "button.upload", function () {
        upload();
      });
    });

    return upload;
  });
