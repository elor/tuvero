/**
 * detect updates to the manifest, if available
 */
define([ './strings', './toast', './debug' ], function (Strings, Toast, Debug) {
  var Update, appCache;

  appCache = window.applicationCache;

  function setCached (cached) {
    if (cached) {
      Update.isCached = true;
    } else {
      Update.isCached = false;
      if (!Debug.isDevVersion) {
        console.error('no cache manifest found!');
        new Toast(Strings.nomanifest, Toast.INFINITE);
      }
    }
  }

  function cacheStatus () {
    switch (appCache.status) {
    case appCache.OBSOLETE:
    case appCache.UNCACHED:
      // no cache manifest available
      setCached(false);
      break;

    case appCache.UPDATEREADY:
      // We don't need swapCache. In fact, it would likely break the page in
      // horrible ways if there's an API change
      // appCache.swapCache();
      setCached(true);
      new Toast(Strings.updateavailable, Toast.INFINITE);
    case appCache.IDLE:
      setCached(true);
      break;
    case appCache.CHECKING:
    case appCache.DOWNLOADING:
      break;
    default:
      console.error('unhandled appCache status: ' + appCache.status);
      setCached(false);
      break;
    }
  }

  function cacheError () {
    console.error('unexpected applicationCache error. window.applicationCache.status = ' + window.applicationCache.status);
  }

  appCache.addEventListener('error', cacheStatus);
  appCache.addEventListener('cached', cacheStatus);
  appCache.addEventListener('noupdate', cacheStatus);
  appCache.addEventListener('updateready', cacheStatus);

  // function cacheError () {
  // new Toast(Strings.updatefailed, Toast.LONG);
  // }
  // appCache.addEventListener('error', cacheError);

  cacheStatus();

  Update = function () {
    cacheStatus();
    try {
      appCache.update();
    } catch (e) {
      console.error(e);
    }
  };

  // Note: Update() is NOT A CLASS
  // This is just a cheap hack to keep type mismatch warnings suppressed
  Update.prototype = {};

  return Update;
});
