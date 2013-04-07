require([ './tabs', './toast', './tab_teams', './tab_games', './strings',
    './team', './tab_ranking' ], function (Tabs, Toast, Tab_Teams, Tab_Games,
    Strings, Team, Tab_Ranking) {

  $(function ($) {
    // initialize tabs and select first one (hence the true)
    new Tabs('#tabs > div', 'images/%s.png', true);

    // debug toast
    new Toast(Strings.pageload);
  });
});
