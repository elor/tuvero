define([ './team', './toast', './strings', './tab_ranking', './storage',
    './autocomplete', './options' ], function (Team, Toast, Strings, Tab_Ranking, Storage, Autocomplete, Options) {
  var Tab_Teams, $tpl, $names, $no, $anchor, $new, $t1, $tms;

  Tab_Teams = {};

  $tms = [];

  // avoid jslint false positive
  $tpl = $no = $page = undefined;

  $(function ($) {
    var $box, $teams, $chname, i;

    // get page
    $anchor = $('#newteam');

    // prepare submission field
    $new = $('#newteam');
    $no = $new.find('input.playername');
    $t = [];
    $t[0] = $($no[0]);
    $t[1] = $($no[1]);
    $t[2] = $($no[2]);

    // prepare template
    $tpl = $('#teams .team.tpl');
    $no = $tpl.find('.name');
    $names = [];
    $names[0] = $($no[0]);
    $names[1] = $($no[1]);
    $names[2] = $($no[2]);
    $no = $tpl.find('.teamno');
    $tpl.detach();
    $tpl.removeClass('tpl');
    $chname = $tpl.find('.chname');
    $chname.detach();

    for (i = 0; i < 3; i += 1) {
      if (i < Options.teamsize) {
        $t[i].prev('br').show();
        $t[i].show();
        $names[i].prev('br').show();
        $names[i].show();
      } else {
        $t[i].prev('br').hide();
        $t[i].hide();
        $names[i].prev('br').hide();
        $names[i].hide();
      }
    }

    /**
     * this function adds a new team box to the page
     * 
     * @param team
     *          array of team member names. team number is determined from call
     *          order
     */
    function createBox (team) {
      var $team, tmsid, i;

      for (i = 0; i < Options.teamsize; i += 1) {
        $names[i].text(team.names[i]);
      }
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
    function newteamfunc () {
      var names, i;

      names = [];

      for (i = 0; i < Options.teamsize; i += 1) {
        names.push($t[i].val().trim());
      }

      for (i = 0; i < Options.teamsize; i += 1) {
        if (names[i] === '') {
          return undefined;
        }
      }

      for (i = 0; i < Options.teamsize; i += 1) {
        $t[i].val('');
      }

      Autocomplete.clear();

      return names;
    }

    // register 'new player' form submission
    $new.submit(function () {
      var names, team;

      names = newteamfunc();

      if (names !== undefined) {
        team = Team.create(names);
        new Toast(Strings.teamadded.replace('%s', team.id + 1));
        createBox(team);
        $t[0].focus();

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

    function maxwidthtest () {
      if (!!$box.prop('checked')) {
        $teams.addClass('maxwidth');
      } else {
        $teams.removeClass('maxwidth');
      }
    }

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
        name = $($names[i]).text().trim();
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

    Autocomplete.update();

  });

  return Tab_Teams;
});
