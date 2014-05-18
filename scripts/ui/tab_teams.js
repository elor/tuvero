define([ './team', './toast', './strings', './tab_ranking', './storage',
    './autocomplete', './options', './tab_new', './opts' ], function (Team, Toast, Strings, Tab_Ranking, Storage, Autocomplete, Options, Tab_New, Opts) {

  var Tab_Teams, $tab, template, newteam, $anchor, options;

  $tab = undefined;

  function trimName (name) {
    return name.replace(/^\s*|\s*$/g, '').replace(/\s\s*/g, ' ');
  }

  function initTemplate () {
    var tmp, $tpl, $teamno, $names, $chname, i;

    if (template) {
      console.error('tab_teams: template already exists: ');
      console.error(template);
      return;
    }

    $tpl = $tab.find('.team.tpl');

    $tpl.detach();
    $tpl.removeClass('tpl');

    $names = [];
    tmp = $tpl.find('.name');
    for (i = 0; i < Options.maxteamsize; i += 1) {
      $names[i] = tmp.eq(i);
    }

    $teamno = $tpl.find('.teamno');

    $chname = $tpl.find('.chname');
    $chname.detach();

    template = {
      $tpl : $tpl,
      $teamno : $teamno,
      $names : $names,
      $chname : $chname,
    };

    updateTemplate();
  }

  function updateTemplate () {
    var i, $names;

    Autocomplete.reset();

    $names = template.$names;

    for (i = 0; i < Options.maxteamsize; i += 1) {
      if (i < Options.teamsize) {
        $names[i].prev('br').css('display', '');
        $names[i].css('display', '');
      } else {
        $names[i].prev('br').css('display', 'none');
        $names[i].css('display', 'none');
      }
    }
  }

  function initNewTeam () {
    var i, tmp, $names, $form;

    if (newteam) {
      console.error('tab_teams: newteam is already defined:');
      console.error(newteam);
      return;
    }

    // ================== FUNCTIONS BEGIN ==================
    /**
     * Retrieves, validates and returns names of new players, resetting the
     * input fields if valid
     * 
     * @returns array of player names on successful validation, undefined
     *          otherwise
     */
    function readNewTeamNames () {
      var names, i;

      names = [];

      // get and trim names
      for (i = 0; i < Options.teamsize; i += 1) {
        names.push(trimName(newteam.$names[i].val()));
      }

      // abort on empty names
      for (i = 0; i < Options.teamsize; i += 1) {
        if (names[i] === '') {
          return undefined;
        }
      }

      // reset input fields
      for (i = 0; i < Options.teamsize; i += 1) {
        newteam.$names[i].val('');
      }

      // clear autocomplete entries
      Autocomplete.clear();

      return names;
    }

    function createTeamFromForm () {
      var names, team;

      names = readNewTeamNames();

      if (names !== undefined) {
        team = Team.create(names);
        new Toast(Strings.teamadded.replace('%s', team.id + 1));
        createBox(team);

        newteam.$names[0].focus();

        // save changes
        Storage.changed();
      }

      return false;
    }
    // ================== FUNCTIONS END ==================

    $form = $tab.find('#newteam');

    tmp = $form.find('input.playername');
    $names = [];
    for (i = 0; i < Options.maxteamsize; i += 1) {
      $names[i] = tmp.eq(i);
    }

    newteam = {
      $form : $form,
      $names : $names,
    };

    // register 'new player' form submission
    $form.submit(createTeamFromForm);

    updateNewTeam();
  }

  function updateNewTeam () {
    var i, $names;

    $names = newteam.$names;

    for (i = 0; i < Options.maxteamsize; i += 1) {
      if (i < Options.teamsize) {
        $names[i].prev('br').css('display', '');
        $names[i].css('display', '');
      } else {
        $names[i].prev('br').css('display', 'none');
        $names[i].css('display', 'none');
      }
    }
  }

  function initMaxWidth () {
    var $box;

    // width checkbox
    $box = $tab.find('.options .maxwidth');

    // toggle#teams.maxwidth
    function maxwidthtest () {
      if (!!$box.prop('checked')) {
        $tab.addClass('maxwidth');
      } else {
        $tab.removeClass('maxwidth');
      }
    }

    $box.click(maxwidthtest);

    maxwidthtest();
  }

  function initRename () {

    // ================== FUNCTIONS BEGIN ==================
    function chshow ($name) {
      template.$chname.val($name.text());
      $name.text('');
      $name.append(template.$chname);
      template.$chname.focus();
    }

    function updateTeam ($team) {
      var teamid, team, $names, Tab_Games, i, name;

      // retrieve team
      teamid = $team.prevAll('.team').length;

      team = Team.get(teamid);

      $names = $team.find('.name');

      for (i = 0; i < Options.teamsize; i += 1) {
        name = trimName($names.eq(i).text());
        if (name) {
          // accept non-empty names
          team.names[i] = name;
        } else {
          // reset to stored name
          $names.eq(i).text(team.names[i]);
        }
      }

      // TODO use event system
      // avoid circular dependency
      Tab_Games = require('./tab_games');
      // refresh all tabs
      Tab_Games.update();
      Tab_Ranking.update();

      // save change
      // TODO use event system
      Storage.changed();
    }

    function chhide () {
      var name, $name, $team, $parents;

      $parents = template.$chname.parents();
      $name = $parents.eq(0);

      template.$chname.detach();
      // trim the string
      name = trimName(template.$chname.val());
      $name.text(name);

      $team = $parents.eq(2);

      updateTeam($team);

      new Toast(Strings.namechanged.replace('%s', name));
    }
    // ================== FUNCTIONS END ==================

    $tab.delegate('.team .name', 'click', function () {
      var $name;

      $name = $(this);

      chshow($name);
    });

    template.$chname.blur(chhide);
    template.$chname.keyup(function (e) {
      if (e.which === 13) {
        // automatically calls chhide
        template.$chname.blur();
        e.preventDefault();
        return false;
      } else if (e.which === 27) {
        // TODO abort name change
        e.preventDefault();
        return false;
      }
    });

    // avoid bubbling of the click event towards .name, which would remove
    // chname and cause DOM exceptions
    template.$chname.click(function (e) {
      e.preventDefault();
      return false;
    });
  }

  function init () {
    // remember that we have initialized this page
    if ($tab) {
      console.error('tab_teams: $tab is already defined:');
      console.error($tab);
      return;
    }

    $tab = $('#teams');
    initTemplate();
    initNewTeam();
    initMaxWidth();
    initRename();
    $anchor = newteam.$form;
  }

  /**
   * this function adds a new team box to the page
   * 
   * @param team
   *          array of team member names. team number is determined from call
   *          order
   */
  function createBox (team) {
    var i;

    for (i = 0; i < Options.teamsize; i += 1) {
      template.$names[i].text(team.names[i]);
    }
    template.$teamno.text(team.id + 1);

    $anchor.before(template.$tpl.clone());

    Tab_New.update();
  }

  options = {
    allowRegistrations : true,
    allowDeletions : true,
  };

  Tab_Teams = {
    // several options
    getOptions : function () {
      return Opts.getOptions({
        options : options
      });
    },

    setOptions : function (opts) {
      Opts.setOptions({
        options : options
      }, opts);

      // reset active state
      setActive(options.allowRegistrations);
    },

    /**
     * init, clear and reset all in one
     */
    reset : function () {
      if (!$tab) {
        init();
      }

      // delete everything
      $tab.find('.team').remove();
      Autocomplete.reset();

      // reset everything
      updateTemplate();
      updateNewTeam();

      Autocomplete.update();

    },
    update : function () {
      var i, l;
      Tab_Teams.reset();

      l = Team.count();

      for (i = 0; i < l; i += 1) {
        createBox(Team.get(i));
      }
    },
  };

  function setActive (active) {
    if (active) {
      newteam.$form.show();
    } else {
      newteam.$form.hide();
    }
  }

  return Tab_Teams;
});
