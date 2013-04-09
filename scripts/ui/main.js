require([ './tabs', './toast', './tab_teams', './tab_games', './strings',
    './tab_teams' ], function (Tabs, Toast, Tab_Teams, Tab_Games, Strings,
    Tab_Teams) {

  new Tabs('#tabs > div', 'images/%s.png', true);

  // actual initializations are started after any other module has been set up,
  // hence the jquery function.
  $(function ($) {
    // initialize tabs and select first one (hence the true)

    // debug toast
    new Toast(Strings.pageload);

    // DEBUG
    Tab_Teams.newTeam([ 'a', 's', 'd' ]);
  });
});
