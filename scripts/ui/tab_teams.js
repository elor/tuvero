define([ './team', './toast', './strings', './tab_ranking', './storage',
    './players' ], function (Team, Toast, Strings, Tab_Ranking, Storage, Players) {
  var Tab_Teams, $tpl, $n1, $n2, $n3, $no, $anchor, $new, $t1, $t2, $t3, $tms;

  Tab_Teams = {};

  $tms = [];

  // avoid jslint false positive
  $tpl = $n1 = $n2 = $n3 = $no = $page = undefined;

  $(function ($) {
    var newteamfunc, $box, $teams, maxwidthtest, $chname;

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
    $chname = $tpl.find('.chname');
    $chname.detach();

    /**
     * this function adds a new team box to the page
     * 
     * @param team
     *          array of team member names. team number is determined from call
     *          order
     */
    function createBox (team) {
      var $team, tmsid;

      $n1.text(team.names[0]);
      $n2.text(team.names[1]);
      $n3.text(team.names[2]);
      $no.text(team.id + 1);

      $team = $tpl.clone();
      $anchor.before($team);

      tmsid = $team.prevAll().length;

      $tms[tmsid] = team;
    }

    /**
     * removes all teams from the overview
     */
    Tab_Teams.reset = function () {
      $('#teams > .team').remove(); // '>' relation excludes the entry
      // form
      $tms = [];
    };

    /**
     * replaces the current team boxes with new ones creates from Team
     */
    Tab_Teams.update = function () {
      var i, l;
      Tab_Teams.reset();

      l = Team.count();

      for (i = 0; i < l; i += 1) {
        createBox(Team.get(i));
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
        createBox(team);
        $t1.focus();

        // save changes
        Storage.changed();
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

    function chshow ($name) {
      $chname.val($name.text());
      $name.text('');
      $name.append($chname);
      $chname.focus();
    }

    function updateTeam ($team) {
      var tmsid, team, $names, Tab_Games, i, name;

      // retrieve team
      tmsid = $team.prevAll().length;
      team = $tms[tmsid];

      $names = $team.find('.name');

      for (i = 0; i < 3; i += 1) {
        name = $($names[i]).text();
        // prevent empty names
        if (name) {
          team.names[i] = name;
        } else {
          $($names[i]).text(team.names[i]);
        }
      }

      // avoid circular dependency
      Tab_Games = require('./tab_games');
      // refresh all tabs
      Tab_Games.update();
      Tab_Ranking.update();

      // save change
      Storage.changed();
    }

    function chhide () {
      var $name, $team, $parents;

      $parents = $chname.parents();
      $name = $parents.eq(0);

      $chname.detach();
      $name.text($chname.val());

      $team = $parents.eq(2);

      updateTeam($team);
    }

    $('#tabs').delegate('#teams > .team .name', 'click', function (elem) {
      var $name;

      $name = $(elem.target);

      chshow($name);
    });

    $chname.blur(function () {
      chhide();
    });

    // avoid bubbling of the click event towards .name, which would remove
    // chname and cause DOM exceptions
    $chname.click(function (e) {
      e.preventDefault();
      return false;
    });

    // autocomplete
    names = Players.get();

    var states = new Bloodhound({
      datumTokenizer : Bloodhound.tokenizers.obj.whitespace('val'),
      queryTokenizer : Bloodhound.tokenizers.whitespace,
      local : names.map(function (value) {
        return {
          val : value
        };
      })
    });

    states.initialize();

    $('#teams input.playername').typeahead('destroy').typeahead({
      hint : true,
      highlight : true,
      limit : 3
    }, {
      name : 'names',
      displayKey : 'val',
      source : states.ttAdapter()
    }).parents('form').submit(function () {
      var $in, i;

      $in = $('#teams input.playername');

      for (i = 0; i < $in.size(); i += 1) {
        if (!$($in[i]).val().trim()) {
          return;
        }
      }

      $in.typeahead('val', '');
    });

  });

  return Tab_Teams;
});
