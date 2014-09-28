function notifyAboutLoadError (err) {
  $(function ($) {
    // Splash.setState(), but without splash being loaded
    $('body').addClass('splash');
    $splash = $('#splash');
    $splash.removeClass();
    $splash.addClass('loaderror');
  });

  console.log(err);
}

define([ './ui/update', './ui/backgroundscripts', './ui/splash', './ui/toast', './ui/strings',
    './ui/storage', './ui/tab_settings', './ui/tabshandle', './ui/alltabs', './ui/tab_debug', ], function (Update, undefined, Splash, Toast, Strings, Storage, Tab_Settings, Tabshandle, Alltabs, Tab_Debug) {

  // actual initializations are started after any other module has been set
  // up, hence the jquery function.
  $(function ($) {

    try {
      // NOT actively looking for updates. The events are handled automatically
      // Update();

      // update Tab_Debug for dev version notifications
      Tab_Debug.update();

      Alltabs.reset();

      Storage.enable();

      Splash.loading();

      // using a timeout to let the browser update the splashtext
      setTimeout(function () {
        try {
          if (Storage.restore()) {
            new Toast(Strings.loaded);
          } else {
            new Toast(Strings.newtournament);
          }

          Splash.update();

          Alltabs.update();

          setTimeout(function () {
            try {
              Toast.init();
              Splash.hide();
              Tabshandle.valid();
            } catch (er) {
              notifyAboutLoadError(er);
            }
          }, 10);
        } catch (e) {
          console.error('Storage.restore() error caught');
          console.error(e);
          Splash.error();
        }
      }, 1);
    } catch (e) {
      notifyAboutLoadError(e);
    }
  });
});

requirejs.onError = notifyAboutLoadError;
