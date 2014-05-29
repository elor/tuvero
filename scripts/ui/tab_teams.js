define([ './team', './toast', './strings', './tab_ranking', './storage',
    './autocomplete', './options', './tab_new', './opts', './tabshandle' ], function (Team, Toast, Strings, Tab_Ranking, Storage, Autocomplete, Options, Tab_New, Opts, Tabshandle) {

  var Tab_Teams, $tab, template, newteam, $anchor, options, $fileload;

  $tab = undefined;

  function trimName (name) {
    return name.replace(/^\s*|\s*$/g, '').replace(/\s\s*/g, ' ');
  }

  function updateTeamCounts () {
    $tab.find('.numteams').text(Team.count());
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

  /**
   * reads names from a string and adds the players accordingly. Ignores
   * #-escaped lines
   * 
   * @returns true on success, undefined or false on failure
   */
  function createTeamsFromString (str) {
    var lines, line, names, teamsize, team, i;

    if (Team.count() !== 0) {
      new Toast(Strings.teamsnotempty);
      return undefined;
    }

    stripregex = /(^\s+|\s+$)/g;

    lines = str.split('\n');

    // strip unnecessary lines and characters
    for (i = lines.length - 1; i >= 0; i -= 1) {
      // strip white spaces
      lines[i] = trimName(lines[i]);

      // convert CSV format to plain text
      // first, replace all commas inside quotes
      lines[i] = lines[i].replace(/(, ?"([^,"]|"")*),/g, '$1%COMMA%');
      // second, remove spaces around commas
      lines[i] = lines[i].replace(/ *, */g, ',');
      // second, convert the actual content
      lines[i] = lines[i].replace(/^([0-9]+,)?"(([^"]|"")*)","(([^"]|"")*)","(([^"]|"")*)"$/, '$2,$4,$6');
      lines[i] = lines[i].replace(/^([0-9]+,)?"(([^"]|"")*)","(([^"]|"")*)"$/, '$2,$4');
      lines[i] = lines[i].replace(/^([0-9]+,)?"(([^"]|"")*)"$/, '$2');

      // remove all comments
      lines[i] = lines[i].replace(/^#.*/, '');
      // remove empty lines (and the aforementioned comments)
      if (lines[i].length === 0) {
        lines.splice(i, 1);
      }
    }

    teamsize = -1;

    // split and strip the individual player names and store them in the lines
    // variable
    for (names in lines) {
      lines[names] = lines[names].split(',');
      names = lines[names];

      for (name in names) {
        names[name] = trimName(names[name]).replace('%COMMA%', ',');
        if (names[name].length === 0) {
          names[name] = Strings.emptyname;
        }
      }

      // verify that all teams have the same number of playuers
      if (teamsize !== names.length) {
        if (teamsize === -1) {
          teamsize = names.length;
        } else {
          new Toast(Strings.differentteamsizes);
          return undefined;
        }
      }
    }

    // validate team size
    switch (teamsize) {
    case 1:
    case 2:
    case 3:
      // set the team size
      Options.teamsize = teamsize;
      // update tabs to the new teamsize
      Tabshandle.updateOpts();
      require('./alltabs').reset();
      require('./alltabs').update();
      break;
    default:
      new Toast(Strings.invalidteamsize);
      return undefined;
    }

    // enter new teams
    for (names in lines) {
      names = lines[names];

      team = Team.create(names);
      createBox(team);
    }

    // save changes
    Storage.changed();

    return true;
  }

  function invalidateFileLoad () {
    $fileload.find('input').val('');
  }

  function loadFileError (evt) {
    // file api callback function
    switch (evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
      new Toast(Strings.filenotfound);
      break;
    case evt.target.error.NOT_READABLE_ERR:
      new Toast(Strings.filenotreadable);
      break;
    case evt.target.error.ABORT_ERR:
      break;
    default:
      new Toast(Strings.fileerror);
    }

    invalidateFileLoad();
  }

  function loadFileLoad (evt) {
    var contents;

    contents = evt.target.result;

    if (createTeamsFromString(contents)) {
      new Toast(Strings.loaded);
    } else {
      // toast already sent by createTeamsFromString
    }

    invalidateFileLoad();
  }

  function loadFileAbort () {
    new Toast(Strings.fileabort);

    invalidateFileLoad();
  }

  function initFileLoad () {
    $fileload = $tab.find('.load');

    $fileload.find('input').change(function (evt) {
      var reader = new FileReader();
      reader.onerror = loadFileError;
      reader.onabort = loadFileAbort;
      reader.onload = loadFileLoad;

      reader.readAsBinaryString(evt.target.files[0]);
    });
  }

  function updateFileLoad () {
    $fileload.show();
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
        // TODO abort name change on escape key
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
    initFileLoad();
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

    // hide file load
    $fileload.hide();

    Tab_New.update();
    updateTeamCounts();
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
      updateFileLoad();
      updateTeamCounts();
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
