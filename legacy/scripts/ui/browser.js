/**
 * prepares a Browser object, which contains the name and version of the
 * browser, for most major browsers
 *
 * @export Browser
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['./backgroundscripts/online', './update'], function(Online, Update) {
  var Browser;

  Browser = {
    name: undefined,
    version: undefined,
    online: undefined,
    cached: undefined,
    local: undefined,
    secure: undefined,
    legit: undefined,
    inithash: window.location.hash.replace(/^#/, '')
  };

  Browser.update = function() {
    /**
     * original code copied from:
     * http://stackoverflow.com/questions/2400935/browser-detection-in-javascript
     *
     * @return browser information: "Browsername 13.0.0.1" or similar
     */
    sayswho = (function() {
      var ua, tem, M, regex;

      ua = navigator.userAgent;
      regex = /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i;
      M = ua.match(regex) || [];
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
      }
      if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null)
          return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion,//
      '-?'];
      if ((tem = ua.match(/version\/(\d+)/i)) != null)
        M.splice(1, 1, tem[1]);
      return M.join(' ');
    })();

    Browser.name = sayswho.match(/^\S+/)[0];
    if (Browser.name === 'undefined') {
      Browser.name = undefined;
    }

    Browser.version = sayswho.match(/\S+$/)[0];
    if (Browser.version === 'undefined') {
      Browser.version = undefined;
    } else {
      Browser.version = Number(Browser.version);
    }

    Browser.online = Online();

    Browser.cached = Update.isCached;

    Browser.local = document.location.protocol === 'file:';

    Browser.secure = document.location.protocol === 'https:';

    Browser.legit = document.location.host === 'tuvero.de';

    return Browser;
  };

  Browser.update();

  return Browser;
});
