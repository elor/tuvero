/**
 * Am I online or offline?
 */
// FIXME modernizr
define([ './strings', './update' ], function (Strings, Update) {
  var Online;

  /**
   * 
   */
  Online = function () {
    return navigator.onLine;
  };

  // if offline, send a nag message on exit!

  $(window).on('beforeunload', function (e) {
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
    // message='(dev output) beforeunload ' + (Online() ? 'online' : 'offline')
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

  return Online;
});
