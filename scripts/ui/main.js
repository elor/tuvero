require([ './splash', './tabs', './toast', './strings', './storage',
    './tab_settings', './featuredetect', './tabshandle', './alltabs',
    './update' ], function (Splash, Tabs, Toast, Strings, Storage, Tab_Settings, Featuredetect, Tabshandle, Alltabs, Update) {

  // actual initializations are started after any other module has been set
  // up, hence the jquery function.
  $(function ($) {

    // look for updates
    Update();

    // TODO show loading screen
    // TODO show tabs only after everything has been set up

    Alltabs.reset();

    // show the page
    $('#tabs').show();

    Storage.enable();

    if (Storage.restore()) {
      new Toast(Strings.loaded);
    } else {
      new Toast(Strings.newtournament);
    }

    Alltabs.update();
    
    Splash.hide();
  });
});
