/**
 * Shared main file. loads the shared config and modules and manages the program
 * startup and splash screen. A complete rewrite is necessary.
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

require(['core/config', 'core/common'], function() {
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
    var Shared, Update, Splash, Toast, Strings, Storage;
    var Tabshandle, Alltabs, Tab_Debug, TeamToastsListener;

    Shared = require('./ui/shared');
    Update = require('ui/update');
    Splash = require('ui/splash');
    Toast = require('ui/toast');
    Strings = require('ui/strings');
    Storage = Shared.Storage;
    Tabshandle = require('ui/tabshandle');
    Alltabs = Shared.Alltabs;
    Tab_Debug = require('ui/tab_debug');
    TeamToastsListener = require('ui/teamtoastslistener');

    // actual initializations are started after any other module has
    // been set
    // up, hence the jquery function.
    $(function() {

      // try {
      // NOT actively looking for updates. The events are handled
      // automatically
      // Update();

      // update Tab_Debug for dev version notifications
      Tab_Debug.update();

      Alltabs.reset();

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

          Alltabs.update();

          setTimeout(function() {
            try {
              Toast.init();
              Splash.hide();
//              Tabshandle.valid();
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
