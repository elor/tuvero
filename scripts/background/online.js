/**
 * Supports Online(), which returns true if the browser is online.
 *
 * Also notifies if the user wants to leave the page while offline, but cannot
 * re-open it because it's not in the cache
 *
 * @return Online
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["jquery", "ui/strings", "ui/update"], function ($, Strings, Update) {
  var Online;

  /**
   * Check for an internet connection. Does not check for an active connection
   * to tuvero.de
   *
   * @return true if there's an active internet connection, false otherwise.
   */
  Online = function () {
    return navigator.onLine;
  };

  // if offline, send a nag message on exit!

  $(function ($) {
    $(window).on("beforeunload", function (e) {
      var message = Strings.offlineconfirmexit;

      if (!Online() && !Update.isCached &&
          document.location.protocol !== "file:") {
        if (e) {
          e.returnValue = message;
        }
        return message;
      }

      // uncomment to show dev reload notifications again
      //
      // if (Shared.Debug.isDevVersion) {
      // message='(dev output) beforeunload ' + (Online() ? 'online' :
      // 'offline')
      // + ' ' + (Update.isCached ? 'cached' : 'uncached');
      // if (e) {
      // e.returnValue = message;
      // }
      // return message;
      // }
      //

      // let it reload
      return undefined;
    });
  });

  return Online;
});
