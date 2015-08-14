/**
 * Manage the state and visibility of the splash screen
 * 
 * @return Splash
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'jquery', 'ui/browser' ], function($, Browser) {
  var Splash;

  Splash = {
    hide : function() {
      console.error('Splash.hide() called before pageload');
    },
    loading : function() {
      console.error('Splash.loading() called before pageload');
    }
  };

  $(function($) {
    var $splash;

    function setState(state) {
      $splash.removeClass();
      $splash.addClass(state);
    }

    $splash = $('#splash');

    // TODO move to another function
    if (Browser.name == "MSIE" && Browser.version < 9) {
      setState('oldinternetexplorer');
      return;
    }

    setState('starting');

    Splash.loading = function() {
      setState('restoring');
    };

    Splash.update = function() {
      setState('update');
      $('#tabs').show();
    };

    Splash.hide = function() {
      setState('ready');

      $('body').removeClass('splash');

      setTimeout(function() {
        $splash.addClass('hidden');
      }, 1000);
    };

    Splash.error = function() {
      setState('error');
    };
  });

  return Splash;
});
