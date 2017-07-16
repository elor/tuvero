/**
 * Save button logic which initiates a file download of the current state for
 * later loading
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'ui/toast', 'ui/strings', 'ui/server', 'ui/state', 'core/listener'],
  function ($, Toast, Strings, Server, State, Listener) {
    var Upload;

    $(function ($) {
      $('#tabs').on('click', 'button.upload', function () {
        var serverlink = !State.serverlink.get();

        if (!Server.logged_in.get()) {
          new Toast('Nicht angemeldet');
        } else if (serverlink) {
          new Toast('Turnier nicht auf dem Server registriert');
        } else {
          var message = Server.message('/t/' + serverlink + '/state/upload', State.save());
          Listener.bind(message, 'error', function (emitter, event, data) {
            new Toast('Hochladen fehlgeschlagen');
            console.error(data);
            console.error(JSON.stringify(data));
          });
          Listener.bind(message, 'receive', function () {
            new Toast('Turnierstand hochgeladen');
          });
          message.send();
        }
      });
    });

    return Upload;
  });
