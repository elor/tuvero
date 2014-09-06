require([ './splash', './reset', './tabs', './toast', './strings', './storage',
    './tab_settings', './featuredetect', './tabshandle', './alltabs',
    './update' ], function (Splash, Reset, Tabs, Toast, Strings, Storage, Tab_Settings, Featuredetect, Tabshandle, Alltabs, Update) {

  // actual initializations are started after any other module has been set
  // up, hence the jquery function.
  $(function ($) {

    // look for updates
    Update();

    // TODO show loading screen
    // TODO show tabs only after everything has been set up

    Alltabs.reset();

    Storage.enable();

    Splash.loading();

    // using a timeout to let the browser update the splashtext
    setTimeout(function () {
      if (Storage.restore()) {
        new Toast(Strings.loaded);
      } else {
        new Toast(Strings.newtournament);
      }

      Alltabs.update();

      setTimeout(function () {
        Toast.init();
        Splash.hide();
        Tabshandle.valid();
      }, 10);
    }, 1);
  });
});
