/**
 * First file to load.
 *
 * Starts loading all other files, initializes everything and manages the splash
 * screen and load errors
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

require(['config'], function(){
  require(['core/config'], function(){
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

require(
    ['core/common'],
    function() {
      var Shared, Update, Splash, Toast, Strings, Storage, Tabshandle, Alltabs, Tab_Debug;

      Shared = require('./ui/shared');
      Update = require('ui/update');
      Splash = require('ui/splash');
      Toast = require('ui/toast');
      Strings = require('ui/strings');
      Storage = Shared.Storage;
      Tabshandle = require('ui/tabshandle');
      Alltabs = Shared.Alltabs;
      Tab_Debug = require('ui/tab_debug');

      // actual initializations are started after any other module has been set
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

            Splash.update();

            Alltabs.update();

            setTimeout(function() {
              try {
                Toast.init();
                Splash.hide();
                Tabshandle.valid();
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
    });

// requirejs.onError = notifyAboutLoadError;
});
});
