/**
 * modernizr and own feature detections
 */
define([ './strings', './toast' ], function (Strings, Toast) {
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
      new Toast(Strings.nofilereader, 5);
    }

    if (!Modernizr.json) {
      $('.nojson').show();
      $('.json').detach();
      new Toast(Strings.nojson, 5);
      confirmLeave();
    }

    if (!Modernizr.localstorage) {
      $('.nostorage').show();
      $('.storage').detach();
      new Toast(Strings.nostorage, 5);
      confirmLeave();
    }
  });

  return FeatureDetect;
});
