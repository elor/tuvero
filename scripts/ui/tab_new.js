/**
 * Tab_New handler
 */

define([ './options', './tabshandle', './opts', './toast', './team',
    './strings', './tab_games', './tab_ranking', './tab_history', './history',
    './storage', '../backend/tournament', './tournaments', './globalranking' ], function (Options, Tabshandle, Opts, Toast, Team, Strings, Tab_Games, Tab_Ranking, Tab_History, History, Storage, BackendTournament, Tournaments, GlobalRanking) {
  var Tab_New, $tab, updatepending, template, swissperms;

  updatepending = false;
  $tab = undefined;
  Tab_New = {};

  /**
   * translates the Tournament ranking into a traditional votes object
   * 
   * TODO rewrite this file to replace this function
   * 
   * @param Tournament
   *          the swiss object
   * @returns {Object} a votes object of the current round
   */
  function getRoundVotes (Tournament) {
    // FIXME duplicate within tab_new.js
    var votes, ranking, i;

    ranking = Tournaments.getRanking(Tournaments.getTournamentID(Tournament));

    votes = {
      up : [],
      down : [],
      bye : [],
    };

    for (i = 0; i < ranking.ids.length; i += 1) {
      if (ranking.roundupvote[i]) {
        votes.up.push(ranking.ids[i]);
      }
      if (ranking.rounddownvote[i]) {
        votes.down.push(ranking.ids[i]);
      }
      if (ranking.roundbyevote[i]) {
        votes.bye.push(ranking.ids[i]);
      }
    }

    return votes;
  }

  function initTemplate () {
    template = {
      team : {}
    };
    template.team.$container = $tab.find('.team.tpl');

    template.team.$container.detach();
    template.team.$container.removeClass('tpl');

    template.team.$rank = template.team.$container.find('.rank');
    template.team.$tournamentrank = template.team.$container.find('.tournamentrank');
    template.team.$teamno = template.team.$container.find('.teamno');
    template.team.$names = template.team.$container.find('.names');

    template.$system = template.team.$container.find('.system');
    template.$system.detach();
    template.$removesystem = template.$system.find('.removesystem');
    template.$removesystem.detach();
    template.$anchor = $tab.find('table.playertable');

    template.system = {};
    template.system.$swiss = $tab.find('.swiss.tpl').detach().find('> *');
    template.system.$newsystem = $tab.find('.newsystem.tpl').detach().find('> *');

    template.$chname = template.system.$newsystem.find('.chname');
    template.$chname.detach();
  }

  function initRename () {
    // copied over from tab_teams.js

    // ================== FUNCTIONS BEGIN ==================
    function chshow ($name) {
      template.$chname.val($name.text());
      $name.text('');
      $name.append(template.$chname);
      template.$chname.focus();
    }

    function updateName () {
      var $title, $system, tournamentid, newname;

      $title = template.$chname.parent('h3');
      $system = $title.parent('.system');

      if ($title.length === 0 || $system.length === 0) {
        console.error('cannot find required DOM elements');
        return undefined;
      }

      // retrieve tournament id
      tournamentid = $system.data('tournamentid');
      newname = template.$chname.val();
      template.$chname.detach();

      if (!newname || /^\s*$/.test(newname) || Tournaments.getName(tournamentid) === newname) {
        $title.text(Tournaments.getName(tournamentid));
        new Toast(Strings.namechangeaborted);
        return undefined;
      }

      $title.parents('.system').find('.name').text(newname);

      Tournaments.setName(tournamentid, newname);

      // save change
      Storage.changed();

      // refresh all tabs
      // Tab_New.update(); // not necessary
      require('./tab_games').update();
      require('./tab_ranking').update();
      require('./tab_history').update();

      new Toast(Strings.namechanged.replace('%s', newname));
    }

    function chabort () {
      template.$chname.val('');
      template.$chname.blur();
    }

    $tab.on('click', '.system > h3:first-child.name.editable', function () {
      chshow($(this));
    });

    template.$chname.blur(updateName);

    template.$chname.keyup(function (e) {
      if (e.which === 13) {
        // automatically calls chhide
        template.$chname.blur();
        e.preventDefault();
        return false;
      } else if (e.which === 27) {
        chabort();
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

    // you clicked the bottom h3? no problem, just click the other one
    $tab.on('click', '.system >h3:last-child.name.editable', function () {
      $(this).parents('.system').find('>h3:first-child.name.editable').click().focus();
    });
  }

  function initRemove () {
    $tab.on('click', '.system .removesystem', function () {
      var $system, tournamentid, tournament, games;

      $system = $(this).parent('.system');

      tournamentid = $system.data('tournamentid');

      if (!Tournaments.isRunning(tournamentid)) {
        new Toast(Strings.tournamentalreadyfinished);
        return undefined;
      }

      tournament = Tournaments.getTournament(tournamentid);
      if (!tournament) {
        console.error("tournament running, but there's no tournament object!");
        return undefined;
      }

      games = tournament.getGames();

      if (games && games.length) {
        new Toast(Strings.gamesstillrunning);
        return undefined;
      }

      if (!Tournaments.removeTournament(tournamentid)) {
        // failure
        console.error("something's wrong");
        return undefined;
      }

      // the other tabs don't need to update, since nothing should have changed
      // for them (yet)
      Tab_New.update();
      Storage.changed();
      new Toast(Strings.tournamentfinished);

      return true;
    });
  }

  function resetTeams () {
    $tab.find('.team').remove();
  }

  function resetSystems () {
    $tab.find('.system').remove();
  }

  function updateTeams () {
    var ranking, i;

    ranking = GlobalRanking.get();

    for (i = 0; i < ranking.length; i += 1) {
      template.team.$rank.text(ranking[i].globalrank + 1);
      template.team.$tournamentrank.text(ranking[i].tournamentrank + 1 || '');
      template.team.$teamno.text(ranking[i].teamid + 1);
      template.team.$names.text(Team.get(ranking[i].teamid).names.join(', '));
      template.$anchor.append(template.team.$container.clone());
    }
  }

  function setSystemState ($system, tournamentid) {
    var stateclass, Tournament;

    Tournament = tournamentid !== undefined && Tournaments.getTournament(tournamentid);

    switch (Tournament ? Tournament.getState() : BackendTournament.STATE.FAILURE) {
    case BackendTournament.STATE.PREPARING:
      stateclass = 'preparing';
      break;
    case BackendTournament.STATE.RUNNING:
      stateclass = 'running';
      break;
    case BackendTournament.STATE.FINISHED:
      stateclass = 'finished';
      break;
    case BackendTournament.STATE.FAILURE:
    default:
      stateclass = 'failure';
      break;
    }

    $system.removeClass('preparing running finished failure').addClass(stateclass);
  }

  function getAnchor (tournamentid) {
    var startteam;

    if (tournamentid === undefined) {
      startteam = 0;
    } else {
      startteam = Tournaments.getStartRank(tournamentid);
    }

    return template.$anchor.find('.team').eq(startteam);
  }

  function getHeight (tournamentid) {
    return Tournaments.numTeamsLeft(tournamentid);
  }

  function createSystemAnchor (tournamentid) {
    var $firstrow, height, $anchor;

    $firstrow = getAnchor(tournamentid);
    height = getHeight(tournamentid);

    if ($firstrow.length !== 1) {
      console.error('cannot find anchor for tournament id' + tournamentid);
      return undefined;
    }

    if (!height) {
      return undefined;
    }

    $anchor = template.$system.clone();
    $anchor.attr('rowspan', height);

    // TODO is this too early?
    $firstrow.append($anchor);
    $firstrow.find('td').css('border-top', 'solid 1px black');

    return $anchor;
  }

  function createTournamentBox ($anchor, tournamentid) {
    var type;

    type = Tournaments.getTournament(tournamentid).getType();

    $anchor.append(template.system['$' + type].clone());
    $anchor.addClass(type);

    switch (type) {
    case 'swiss':
      initSwiss($anchor, tournamentid);
      break;
    default:
      console.error('unsupported tournament type: ' + type);
      return undefined;
    }

    return $anchor;
  }

  function createSelectionBox ($anchor) {

    $anchor.append(template.system.$newsystem.clone());
    $anchor.addClass('newsystem');
    initNewsystem($anchor);

    return $anchor;
  }

  function setSystemTitle ($anchor) {
    var title, tournamentid;

    tournamentid = $anchor.data('tournamentid');

    $title = $anchor.find('>h3');

    if (tournamentid !== undefined) {
      $title.addClass('editable');
      $title.after(template.$removesystem.clone());
    } else {
      $anchor.find('.name').text(Tournaments.getName(tournamentid));
    }
    $anchor.append($title.clone());
  }

  function updateSystems () {
    var $system, tournamentid;

    // TODO we have to print this in globalranking order!

    for (tournamentid = 0; tournamentid < Tournaments.numTournaments(); tournamentid += 1) {

      $system = createSystemAnchor(tournamentid);
      if (!$system) {
        continue;
      }

      $system.data('tournamentid', tournamentid);

      if (Tournaments.isRunning(tournamentid)) {
        createTournamentBox($system, tournamentid);

        setSystemState($system, tournamentid);

      } else {
        // there's still at least one player who needs a tournament
        createSelectionBox($system);
      }

      setSystemTitle($system);
    }

    // process all teams without tournament
    $system = createSystemAnchor(undefined);
    if ($system) {
      createSelectionBox($system);
      setSystemTitle($system);
    }
  }

  function addNewSystem (type) {
    var Tournament, tournamentid, parentid;

    // TODO use position information
    // TODO verify type

    // TODO get parentid
    parentid = undefined;

    Tournament = Tournaments.addTournament(type, Team.count(), parentid);
    if (!Tournament) {
      console.error('cannot create tournament of type ' + type);
      Tab_New.update();
      return undefined;
    }
    tournamentid = Tournaments.getTournamentID(Tournament);
    Tournaments.setName(tournamentid, Strings['defaultname' + type]);

    Storage.store();
    Tab_New.update();
  }

  /**
   * prepare Newsystem management box, which starts a new tournament round
   */
  function initNewsystem ($clone) {
    var $swissbutton;

    $swissbutton = $clone.find('button.swiss');

    $swissbutton.click(function () {
      addNewSystem('swiss');
    });
  }

  /**
   * prepare a swiss tournament management box
   */
  function initSwiss ($swiss, tournamentid) {
    var $swissmode, round, $perms, Swiss;

    // set texts for current round
    round = Tournaments.getRanking(tournamentid).round;
    $swiss.find('.round').text(round);
    $swiss.find('.nextround').text(round + 1);

    if (!Tournaments.isRunning(tournamentid)) {
      // this is finished.
      return undefined;
    }

    Swiss = Tournaments.getTournament(tournamentid);

    // swissmode select field
    $swissmode = $swiss.find('.mode');
    getSwissMode($swissmode, Swiss);

    $swissmode.change(function () {
      setSwissMode($swissmode, Swiss);
    });

    $perms = queryPerms($swiss);
    // TODO init vote perms presets
    $perms.preset.change(function () {
      setPermissionPreset($perms.preset.val(), $perms);
      setPermissions($perms, Swiss);
    });

    getPermissions($perms, Swiss);

    // TODO init perms matrix
    $perms.all.click(function () {
      var $perm;
      $perm = $(this);

      $perm.toggleClass('forbidden');
      $perms.preset.val('custom');
      setPermissions($perms, Swiss);
    });

    // submit button
    $swiss.find('button').click(function () {
      var i, bye, team, round;
      if (Swiss.start()) {
        round = Tournaments.getRanking(Tournaments.getTournamentID(Swiss)).round;

        // add the bye to history
        bye = getRoundVotes(Swiss).bye;
        while (bye.length > 0) {
          History.addVote(0, History.BYE, bye.shift(), round - 1);
        }

        new Toast(Strings.roundstarted.replace('%s', round));
        Storage.store();

        Tab_Games.update();
        Tab_New.update();
        Tab_History.update();
        Tab_Ranking.update();
      } else {
        new Toast(Strings.roundfailed);
      }
    });
  }

  function setPermissionPreset (preset, $perms) {
    var perms;

    perms = swissperms[preset];

    if (perms === undefined) {
      // not available. most likely 'custom'
      return;
    }

    $perms.all.removeClass('forbidden');

    // just copy the values over to the grid
    !perms.up.up && $perms.up.up.addClass('forbidden');
    !perms.up.down && $perms.up.down.addClass('forbidden');
    !perms.up.bye && $perms.up.bye.addClass('forbidden');
    !perms.down.up && $perms.down.up.addClass('forbidden');
    !perms.down.down && $perms.down.down.addClass('forbidden');
    !perms.down.bye && $perms.down.bye.addClass('forbidden');
    !perms.bye.up && $perms.bye.up.addClass('forbidden');
    !perms.bye.down && $perms.bye.down.addClass('forbidden');
    !perms.bye.bye && $perms.bye.bye.addClass('forbidden');
  }

  function getPermissions ($perms, Swiss) {
    var perms;

    perms = Swiss.getOptions().permissions;

    $perms.all.removeClass('forbidden');

    !perms.up.up && $perms.up.up.addClass('forbidden');
    !perms.up.down && $perms.down.up.addClass('forbidden');
    !perms.up.bye && $perms.bye.up.addClass('forbidden');
    !perms.down.up && $perms.up.down.addClass('forbidden');
    !perms.down.down && $perms.down.down.addClass('forbidden');
    !perms.down.bye && $perms.bye.down.addClass('forbidden');
    !perms.bye.up && $perms.up.bye.addClass('forbidden');
    !perms.bye.down && $perms.down.bye.addClass('forbidden');
    !perms.bye.bye && $perms.bye.bye.addClass('forbidden');
  }

  function setPermissions ($perms, Swiss) {
    var opts, perms;

    opts = Swiss.getOptions();
    perms = opts.permissions;

    perms.up.up = !$perms.up.up.hasClass('forbidden');
    perms.up.down = !$perms.down.up.hasClass('forbidden');
    perms.up.bye = !$perms.bye.up.hasClass('forbidden');
    perms.down.up = !$perms.up.down.hasClass('forbidden');
    perms.down.down = !$perms.down.down.hasClass('forbidden');
    perms.down.bye = !$perms.bye.down.hasClass('forbidden');
    perms.bye.up = !$perms.up.bye.hasClass('forbidden');
    perms.bye.down = !$perms.down.bye.hasClass('forbidden');
    perms.bye.bye = !$perms.bye.bye.hasClass('forbidden');

    opts.permissions = perms;
    Swiss.setOptions(opts);
  }

  function queryPerms ($swiss) {
    var $grid, $perms;

    $grid = $swiss.find('.votepermissions');

    $perms = {
      all : $grid.find('.perm'),
      up : {
        up : $grid.find('.up .up'),
        down : $grid.find('.up .down'),
        bye : $grid.find('.up .bye'),
      },
      down : {
        up : $grid.find('.down .up'),
        down : $grid.find('.down .down'),
        bye : $grid.find('.down .bye'),

      },
      bye : {
        up : $grid.find('.bye .up'),
        down : $grid.find('.bye .down'),
        bye : $grid.find('.bye .bye'),

      },
      preset : $swiss.find('select.preset'),
    };

    return $perms;
  }

  function setSwissMode ($modeselect, Swiss) {
    var opts, mode;

    mode = $modeselect.val();

    opts = Swiss.getOptions();
    opts.mode = mode;

    Swiss.setOptions(opts);
  }

  function getSwissMode ($modeselect, Swiss) {
    var mode;

    mode = Swiss.getOptions().mode;
    $modeselect.val(mode);
  }

  function initOptions () {
    var $maxwidthbox, $shownamesbox;

    // show or hide playernames
    $maxwidthbox = $tab.find('.options .maxwidth');
    function maxwidthtest () {
      if ($maxwidthbox.prop('checked')) {
        $tab.addClass('maxwidth');
      } else {
        $tab.removeClass('maxwidth');
      }
    }

    $maxwidthbox.click(maxwidthtest);
    maxwidthtest();

    // show or hide playernames
    $shownamesbox = $tab.find('.options .shownames');
    function shownamestest () {
      if ($shownamesbox.prop('checked')) {
        $tab.removeClass('hidenames');
        $maxwidthbox.removeAttr("disabled");
      } else {
        $tab.addClass('hidenames');
        $maxwidthbox.attr("disabled", "disabled");
      }
    }

    $shownamesbox.click(shownamestest);
    shownamestest();
  }

  function init () {
    if ($tab) {
      console.error('tab_new: $tab already exists:');
      console.error($tab);
      return;
    }

    $tab = $('#new');

    initTemplate();
    initRename();
    initRemove();
    initOptions();
  }

  Tab_New.reset = function () {
    if (!$tab) {
      init();
    }

    resetSystems();
    resetTeams();
  };

  function closeTeamRegistration () {
    var opts, Tab_Teams;

    Tab_Teams = require('./tab_teams');

    opts = Tab_Teams.getOptions();
    opts.allowRegistrations = false;
    Tab_Teams.setOptions(opts);
  }

  Tab_New.update = function () {
    var Tournament;
    if (updatepending) {
      console.log('updatepending');
    } else {
      updatepending = true;
      window.setTimeout(function () {
        Tab_New.reset();

        if (Team.count() < 2) {
          Tabshandle.hide('new');
        } else {
          Tabshandle.show('new');

          if (Tournaments.numTournaments() !== 0) {
            closeTeamRegistration();
          }
        }

        updateTeams();
        updateSystems();

        updatepending = false;
        console.log('update');
      }, 1);
    }
  };

  Tab_New.getOptions = function () {
    return Opts.getOptions({
      options : options
    });
  };

  Tab_New.setOptions = function (opts) {
    return Opts.setOptions({
      options : options
    }, opts);
  };

  // default permissions for swiss tournaments
  // TODO move to another file, and/or use setOptions() for passing them around
  swissperms = {
    strict : {
      up : {
        up : false,
        down : false,
        bye : false
      },
      down : {
        up : false,
        down : false,
        bye : false
      },
      bye : {
        up : false,
        down : false,
        bye : false
      },
    },
    none : {
      up : {
        up : true,
        down : true,
        bye : true
      },
      down : {
        up : true,
        down : true,
        bye : true
      },
      bye : {
        up : true,
        down : true,
        bye : true
      },
    },
    updown : {
      up : {
        up : false,
        down : false,
        bye : true
      },
      down : {
        up : false,
        down : false,
        bye : true
      },
      bye : {
        up : true,
        down : true,
        bye : false
      },
    },
    pvo : {
      up : {
        up : false,
        down : true,
        bye : true
      },
      down : {
        up : true,
        down : false,
        bye : true
      },
      bye : {
        up : true,
        down : true,
        bye : false
      },
    },
    relaxed : {
      up : {
        up : false,
        down : true,
        bye : true
      },
      down : {
        up : true,
        down : false,
        bye : true
      },
      bye : {
        up : true,
        down : true,
        bye : true
      },
    },
    nice : {
      up : {
        up : false,
        down : true,
        bye : true
      },
      down : {
        up : true,
        down : false,
        bye : false
      },
      bye : {
        up : true,
        down : false,
        bye : false
      },
    },
    // indicate that we don't want to change anything
    custom : undefined
  };

  return Tab_New;
});
