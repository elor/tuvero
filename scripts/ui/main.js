require([ './tabs', './toast', './strings', './storage', './tab_storage',
    './featuredetect', './tabshandle', './alltabs' ], function (Tabs, Toast, Strings, Storage, Tab_Storage, Featuredetect, Tabshandle, Alltabs) {

  // actual initializations are started after any other module has been set
  // up, hence the jquery function.
  $(function ($) {

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
  });
});
