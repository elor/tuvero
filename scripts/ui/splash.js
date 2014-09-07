/**
 * removes the splash screen after pageload
 */

define(function () {
  var Splash;

  Splash = {
    hide : function () {
      console.error('Splash.hide() called before pageload');
    },
    loading : function () {
      console.error('Splash.loading() called before pageload');
    }
  };

  $(function ($) {
    var $splash;

    function setState (state) {
      $splash.removeClass();
      $splash.addClass(state);
    }

    $splash = $('#splash');

    setState('starting');

    Splash.loading = function () {
      setState('restoring');
    };

    Splash.update = function () {
      setState('update');
      $('#tabs').show();
    };

    Splash.hide = function () {
      setState('ready');

      $('body').removeClass('splash');

      setTimeout(function () {
        $splash.addClass('hidden');
        $splash.removeClass('hiding');
      }, 1000);
    };
  });

  return Splash;
});
