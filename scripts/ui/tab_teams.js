define([ './team', './toast', './strings' ], function (Team, Toast, Strings) {
  var Tab_Teams, $tpl, $n1, $n2, $n3, $no, $anchor, $new, $t1, $t2, $t3;

  Tab_Teams = {};

  // avoid jslint false positive
  $tpl = $n1 = $n2 = $n3 = $no = $page = undefined;

  $(function ($) {
    var newteamfunc, $box, $teams, maxwidthtest;

    // get page
    $anchor = $('#newteam');

    // prepare submission field
    $new = $('#newteam');
    $no = $new.find('input');
    $t1 = $($no[0]);
    $t2 = $($no[1]);
    $t3 = $($no[2]);

    // prepare template
    $tpl = $('#teams .team.tpl');
    $no = $tpl.find('.name');
    $n1 = $($no[0]);
    $n2 = $($no[1]);
    $n3 = $($no[2]);
    $no = $tpl.find('.teamno');
    $tpl.detach();
    $tpl.removeClass('tpl');

    /**
     * this function adds a new team box to the page
     * 
     * @param team
     *          array of team member names. team number is determined from call
     *          order
     */
    Tab_Teams.createBox = function (team) {
      $n1.text(team.names[0]);
      $n2.text(team.names[1]);
      $n3.text(team.names[2]);
      $no.text(team.id + 1);

      $anchor.before($tpl.clone());
    };

    /**
     * removes all teams from the overview
     */
    Tab_Teams.clearBoxes = function () {
      $('#players > .team').remove(); // '>' relation excludes the entry form
    };

    /**
     * replaces the current team boxes with new ones creates from Team
     */
    Tab_Teams.updateBoxes = function () {
      var i, l;
      Tab_Teams.clearBoxes();

      l = Team.count();

      for (i = 0; i < l; i += 1) {
        Tab_Teams.createBox(Team.get(i));
      }
    };

    /**
     * Retrieves, validates and returns names of new players, resetting the
     * input fields if valid
     * 
     * @returns array of player names on successful validation, undefined
     *          otherwise
     */
    newteamfunc = function () {
      var names, i;

      names = [];

      names.push($t1.val());
      names.push($t2.val());
      names.push($t3.val());

      for (i = 0; i < 3; i += 1) {
        if (names[i] === '') {
          return undefined;
        }
      }

      $t1.val('');
      $t2.val('');
      $t3.val('');

      return names;
    };

    // register 'new player' form submission
    $new.submit(function () {
      var names, team;

      names = newteamfunc();

      if (names !== undefined) {
        team = new Team(names);
        new Toast(Strings.teamadded.replace('%s', team.id + 1));
        Tab_Teams.createBox(team);
        $t1.focus();
      }

      return false;
    });

    Tab_Teams.active = function (active) {
      if (active) {
        $new.show();
      } else {
        $new.hide();
      }
    };

    // width checkbox
    $box = $('#teams .options .maxwidth');
    $teams = $('#teams');

    maxwidthtest = function () {
      if (!!$box.prop('checked')) {
        $teams.addClass('maxwidth');
      } else {
        $teams.removeClass('maxwidth');
      }
    };

    $box.click(maxwidthtest);

    maxwidthtest();
  });

  Tab_Teams.newTeam = function (names) {
    Tab_Teams.createBox(new Team(names));
  };

  return Tab_Teams;
});
