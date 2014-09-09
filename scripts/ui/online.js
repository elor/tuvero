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

    if (!Online() && !Update.isCached) {
      e.returnValue = message;
      return message;
    }

    return undefined;
  });

  return Online;
});
