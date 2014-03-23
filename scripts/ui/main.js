require([ './tabs', './toast', './strings', './storage', './tab_storage',
    './featuredetect', './tabshandle' ], function (Tabs, Toast, Strings, Storage, Tab_Storage, Tabshandle) {

  // actual initializations are started after any other module has been set
  // up, hence the jquery function.
  $(function ($) {
    // var i;
    // show the page
    $('#tabs').show();

    Storage.enable();

    if (Storage.restore()) {
      new Toast(Strings.loaded);
    } else {
      new Toast(Strings.newtournament);
    }

    Tab_Storage.toggleStorage();
  });
});
