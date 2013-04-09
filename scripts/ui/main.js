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
    Tab_Teams.newTeam([ 'q', 'w', 'e' ]);
    Tab_Teams.newTeam([ 'a', 's', 'd' ]);
    Tab_Teams.newTeam([ 'q', 'w', 'e' ]);
    Tab_Teams.newTeam([ 'q', 'w', 'e' ]);

    $('#games .preparing button').click();

    $($('#games .running .game .points')[0]).val(13);
    $($('#games .running .game .points')[1]).val(10);
    $($('#games .running .game button')[0]).click();

    $('#history .game button').click();
    $($('#history .game .chpoints input')[1]).val(6);
    $($('#history .game button')[0]).click();
  });
});
