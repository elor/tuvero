/**
 * detect updates to the manifest, if available
 */
define([ './strings', './toast', './debug' ], function (Strings, Toast, Debug) {
  var Update, appCache;

  appCache = window.applicationCache;

  function cacheStatus () {
    switch (appCache.status) {
    case appCache.UNCACHED:
      // no cache manifest available
      break;
    case appCache.IDLE:
      // everything up-to-date
      break;
    case appCache.CHECKING:
      // downloading and checking manifest
      break;
    case appCache.DOWNLOADING:
      // downloading new files
      // new Toast(Strings.updatedownloading);
      break;
    case appCache.UPDATEREADY:
      // finished downloading. ready to swap the cache
      appCache.swapCache();
      new Toast(Strings.updateavailable, Toast.INFINITE);
      break;
    case appCache.OBSOLETE:
      // new version of the manifest was uploaded during download of the files.
      break;
    default:
      console.error('unhandled appCache status: ' + appCache.status);
      break;
    }
  }
  appCache.addEventListener('updateready', cacheStatus);

  // function cacheError () {
  // new Toast(Strings.updatefailed, Toast.LONG);
  // }
  // appCache.addEventListener('error', cacheError);

  Update = function () {
    if (appCache.status != appCache.UNCACHED) {
      appCache.update();
      Update.isCached = true;
    } else {
      Update.isCached = false;

      if (!Debug.isDevVersion) {
        console.error('no cache manifest found!');

        new Toast(Strings.nomanifest, Toast.INFINITE);
      }
    }
  };

  // Note: Update() is NOT A CLASS
  // This is just a cheap hack to keep type mismatch warnings suppressed
  Update.prototype = {};

  return Update;
});
