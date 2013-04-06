$(function ($) {
  require([ 'tabs', 'toast', 'team', 'tab_players' ], function (Tabs, Toast,
      Team, Tab_Players) {
    // debug toast
    new Toast("load");

    // initialize tabs and select first tab (hence the true)
    new Tabs('#tabs > div', 'images/%s.png', true);

    Tab_Players.newTeam([ 'Erik Lorenz', 'Fabian Böttcher',
        'Doktor Saideh Mohammadzadeh' ]);
  });
});
