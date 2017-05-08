/**
 * Manage the application cache and notify about available and finished updates
 *
 * The exported Update() function allows manually triggering an update check.
 * Updates are automatically checked for on every pageload.
 *
 * @export Update
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
// FIXME start this script as early as possible!
define(['ui/strings', 'ui/toast', 'ui/debug'], function(Strings, Toast, Debug) {
  var Update, appCache, downloadToast, uncachedToast;

  downloadToast = undefined;

  Update = function() {
    cacheStatus();
    if (Update.isCached) {
      try {
        appCache.update();
      } catch (er) {
        console.error(er);
      }
    }
  };
  // Note: Update() is NOT A CLASS
  // This is just a cheap hack to keep type mismatch warnings suppressed
  Update.prototype = {};
  Update.isCached = false;

  appCache = window.applicationCache;

  function closeDownloadToast() {
    if (downloadToast) {
      downloadToast.close();
      downloadToast = undefined;
    }
  }

  function isLocal() {
    return document.location.protocol === 'file:';
  }

  function setCached(cached) {
    if (cached) {
      Update.isCached = true;
      if (uncachedToast) {
        uncachedToast.close();
      }
    } else {
      Update.isCached = false;
      if (!Debug.isDevVersion) {
        if (!isLocal()) {
          console.error('no cache manifest found');
          if (uncachedToast === undefined) {
            uncachedToast = new Toast(Strings.nomanifest, Toast.INFINITE);
          }
        }
      }
    }
    closeDownloadToast();
  }

  function cacheStatus() {
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
      console.warn('boulesprog application cache updated');
      window.applicationCache.swapCache();
      break;
    case appCache.IDLE:
      setCached(true);
      break;
    case appCache.CHECKING:
      break;
    case appCache.DOWNLOADING:
      if (!downloadToast) {
        downloadToast = new Toast(Strings.updatedownloading, Toast.INFINITE);
      }
      break;
    default:
      console.error('unhandled appCache status: ' + appCache.status);
      setCached(false);
      break;
    }
  }

  // function cacheError() {
  // new Toast(Strings.updatefailed, Toast.LONG);
  // console
  // .error('unexpected applicationCache error. window.applicationCache.status =
  // '
  // + window.applicationCache.status);
  // }

  appCache.addEventListener('error', cacheStatus);
  appCache.addEventListener('downloading', cacheStatus);
  appCache.addEventListener('progress', cacheStatus);
  appCache.addEventListener('cached', cacheStatus);
  appCache.addEventListener('noupdate', cacheStatus);
  appCache.addEventListener('updateready', cacheStatus);

  cacheStatus();

  if (Debug.isDevVersion) {
    window.setInterval(Update, 5000);
    appCache.addEventListener('updateready', function() {
      window.setTimeout(function() {
        window.location.reload();
      }, 1000);
    });
  }

  return Update;
});
