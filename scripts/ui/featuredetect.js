/**
 * modernizr and own feature detections
 */
define([ './strings' ], function (Strings) {
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
      $('.filereader').hide();
    }

    if (!Modernizr.json) {
      $('.nojson').show();
      $('.json').hide();
      confirmLeave();
    }

    if (!Modernizr.localstorage) {
      $('.nostorage').show();
      $('.storage').hide();
      confirmLeave();
    }
  });

  return FeatureDetect;
});
