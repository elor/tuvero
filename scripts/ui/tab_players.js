define([ 'team' ], function (Team) {
  var Tab_Players, $tpl, $n1, $n2, $n3, $no, $anchor;

  Tab_Players = {};

  // avoid jslint false positive
  $tpl = $n1 = $n2 = $n3 = $no = $page = undefined;

  $(function ($) {
    // get page
    $anchor = $('#teams .clear');

    // prepare template
    $tpl = $('.team.tpl');
    $no = $tpl.find('.name');
    $n1 = $($no[0]);
    $n2 = $($no[1]);
    $n3 = $($no[2]);
    $no = $tpl.find('.teamno');
    $tpl.detach();
    $tpl.removeClass('tpl');

    Tab_Players.createBox = function (team) {
      $n1.text(team.names[0]);
      $n2.text(team.names[1]);
      $n3.text(team.names[2]);
      $no.text(team.id + 1);

      $anchor.before($tpl.clone());
    };

  });

  Tab_Players.newTeam = function (names) {
    Tab_Players.createBox(new Team(names));
  };

  return Tab_Players;
});
