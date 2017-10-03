/**
 * detect features and warn users when they're leaving the page if data will be
 * lost
 *
 * @return FeatureDetect
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/modernizr', 'ui/strings', 'ui/toast'], function($,
    Modernizr, Strings, Toast) {
  var FeatureDetect;

  FeatureDetect = {};

  $(function($) {
    function confirmLeave() {
      window.onbeforeunload = function() {
        return Strings.confirmleave;
      };
    }

    if (!Modernizr) {
      console.error('cannot load Modernizr!');
    } else {
      if (!Modernizr.adownload) {
        $('.noadownload').show();
      }

      if (!Modernizr.filereader) {
        $('.nofilereader').show();
        $('.filereader').detach();
        new Toast(Strings.nofilereader, Toast.LONG);
      }

      if (!Modernizr.json) {
        $('.nojson').show();
        $('.json').detach();
        new Toast(Strings.nojson, Toast.LONG);
        confirmLeave();
      }

      if (!Modernizr.localstorage) {
        $('.nostorage').show();
        $('.storage').detach();
        new Toast(Strings.nostorage, Toast.LONG);
        confirmLeave();
      }
    }
  });

  return FeatureDetect;
});
