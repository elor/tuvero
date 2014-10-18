/**
 * modernizr and own feature detections
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ 'lib/modernizr', '../strings', '../toast' ], function (Modernizr, Strings, Toast) {
  var FeatureDetect;

  FeatureDetect = {};

  $(function ($) {
    function confirmLeave () {
      window.onbeforeunload = function () {
        return Strings.confirmleave;
      };
    }

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
  });

  return FeatureDetect;
});
