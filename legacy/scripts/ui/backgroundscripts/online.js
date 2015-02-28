/**
 * Supports Online(), which returns true if the browser is online.
 *
 * Also notifies if the user wants to leave the page while offline, but cannot
 * re-open it because it's not in the cache
 *
 * @return Online
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
// FIXME modernizr
define(['jquery', '../strings', '../update'], function($, Strings, Update) {
  var Online;

  /**
   *
   */
  Online = function() {
    return navigator.onLine;
  };

  // if offline, send a nag message on exit!

  $(function($) {
    $(window).on('beforeunload', function(e) {
      var message = Strings.offlineconfirmexit;

      // TODO add Storage.enabled() warning
      if (!Online() && !Update.isCached) {
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

    $('#onlinecheck').click(function(e) {
      if (Online()) {
        $(e.target).addClass('online').text('online');
      } else {
        $(e.target).removeClass('online').text('OFFLINE');
      }

      if (Update.isCached) {
        $(e.target).text($(e.target).text() + ' cached');
      } else {
        $(e.target).text($(e.target).text() + ' NOT CACHED');
      }
    }).click();
  });

  return Online;
});
