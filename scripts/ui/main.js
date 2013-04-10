require([ './tabs', './toast', './tab_games', './strings', './tab_storage' ],
    function (Tabs, Toast, Tab_Games, Strings, Tab_Storage) {

      // initialize tabs and select first one (hence the true)
      new Tabs('#tabs > div', 'images/%s.png', true);

      // actual initializations are started after any other module has been set
      // up,
      // hence the jquery function.
      $(function ($) {
        var i;
        // show the page
        $('#tabs').show();

        // TODO read page from local storage
        // TODO event handlers for missing features

        // debug toast
        new Toast(Strings.pageload);

        for (i = 0; i < 11; i += 1) {
          $('#newteam input').val('Erik Lorenz');
          $('#newteam button').click();
        }

        $('#games .preparing button').click();
      });
    });
