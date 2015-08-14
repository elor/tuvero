/**
 * Shared main file. loads the shared config and modules and manages the program
 * startup and splash screen. A complete rewrite is necessary.
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

require([ 'core/config', 'core/common' ], function() {
  /**
   * error callback function
   * 
   * @param err
   *          an object containing the type and position of the error
   * 
   */
  function notifyAboutLoadError(err) {
    console.log(err);

    $(function($) {
      var $splash;

      // Splash.setState(), but without splash being loaded
      $('body').addClass('splash');
      $splash = $('#splash');
      $splash.removeClass();
      $splash.addClass('loaderror');
    });
  }

  function Main() {
    // FIXME reduce to one var statement. This function is too long anyhow
    var Update, Splash, Toast, Strings, Storage, Browser;
    var TeamToastsListener;

    Browser = require('ui/browser');
    Splash = require('ui/splash');
    Update = require('ui/update');
    Toast = require('ui/toast');
    Strings = require('ui/strings');
    Storage = require('ui/storage');
    TeamToastsListener = require('ui/teamtoastslistener');

    // actual initializations are started after any other module has
    // been set
    // up, hence the jquery function.
    $(function() {

      // try {
      // NOT actively looking for updates. The events are handled
      // automatically
      // Update();

      Storage.enable();

      Splash.loading();

      // using a timeout to let the browser update the splashtext
      setTimeout(function() {
        try {
          if (Storage.restore()) {
            new Toast(Strings.loaded);
          } else {
            new Toast(Strings.newtournament);
          }

          TeamToastsListener.init();

          Splash.update();

          setTimeout(function() {
            try {
              Toast.init();
              Splash.hide();
            } catch (er) {
              notifyAboutLoadError(er);
            }
          }, 10);
        } catch (err) {
          console.error('Storage.restore() error caught');
          console.error(err);
          Splash.error();
        }
      }, 1);
      // } catch (e) {
      // notifyAboutLoadError(e);
      // }
    });
  }

  Main();
});
