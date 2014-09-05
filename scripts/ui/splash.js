/**
 * removes the splash screen after pageload
 */

define(function () {
  var Splash;

  Splash = {
    hide : function () {
      console.error('Splash.hide() called before pageload');
    }
  };

  $(function ($) {
    var $splash;

    $splash = $('#splash');
    $splash.find('.loadingpage').addClass('hidden');
    $splash.find('.pageloaded').removeClass('hidden');

    Splash.hide = function () {
      $splash.addClass('hiding');

      setTimeout(function () {
        $splash.addClass('hidden');
        $splash.removeClass('hiding');
      }, 1000);
    };
  });

  return Splash;
});
