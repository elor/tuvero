define([ './backgroundscripts', './splash', './toast', './strings',
    './storage', './tab_settings', './tabshandle', './alltabs', './tab_debug',
    './update' ], function (undefined, Splash, Toast, Strings, Storage, Tab_Settings, Tabshandle, Alltabs, Tab_Debug, Update) {

  // actual initializations are started after any other module has been set
  // up, hence the jquery function.
  $(function ($) {

    // look for updates
    Update();
    // update Tab_Debug for dev version notifications
    Tab_Debug.update();

    // TODO show loading screen
    // TODO show tabs only after everything has been set up

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
          Toast.init();
          Splash.hide();
          Tabshandle.valid();
        }, 10);
      } catch (e) {
        console.error('Storage.restore() error caught');
        console.error(e);
        Splash.error();
      }
    }, 1);
  });
});

requirejs.onError = function (err) {
  $(function ($) {
    // Splash.setState(), but without splash being loaded
    $('body').addClass('splash');
    $splash = $('#splash');
    $splash.removeClass();
    $splash.addClass('loaderror');
  });

  throw err;
};