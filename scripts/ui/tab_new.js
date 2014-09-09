/**
 * Tab_New handler
 */

define([ './options', './tabshandle', './opts', './toast', './team',
    './strings', './tab_games', './tab_ranking', './tab_history', './history',
    './storage', '../backend/tournament', './tournaments' ], function (Options, Tabshandle, Opts, Toast, Team, Strings, Tab_Games, Tab_Ranking, Tab_History, History, Storage, BackendTournament, Tournaments) {
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

    ranking = Tournament.getRanking();

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
    template.team.$teamno = template.team.$container.find('.teamno');
    template.team.$names = template.team.$container.find('.names');

    template.$system = template.team.$container.find('.system');
    template.$system.detach();
    template.$system.text('');
    template.$anchor = $tab.find('table.playertable');

    template.system = {};
    template.system.$swiss = $tab.find('.swiss.tpl').detach().find('> *');
    template.system.$newsystem = $tab.find('.newsystem.tpl').detach().find('> *');
  }

  function resetTeams () {
    $tab.find('.team').remove();
  }

  function resetSystems () {
    $tab.find('.system').remove();
  }

  function getRanking () {
    var ranking, ranks, ids, i;

    // TODO use global ranking and stuff.
    // This still is a cheap hack
    ranks = [];
    ids = [];

    if (Tournaments.numTournaments()) {
      ranking = Tournaments.getTournament(0).getRanking();

      ids = ranking.ids;
      ranks = ranking.place;
    }

    if (ranks.length == 0) {
      ids = [];
      ranks = ids;
      for (i = 0; i < Team.count(); i += 1) {
        ids[i] = i;
      }
    }

    return {
      ids : ids,
      ranks : ranks,
    };
  }

  function updateTeams () {
    var ranking, ranks, ids, i;

    ranking = getRanking();
    ranks = ranking.ranks;
    ids = ranking.ids;

    for (i = 0; i < ranks.length; i += 1) {
      template.team.$rank.text(ranks[i] + 1);
      template.team.$teamno.text(ids[i] + 1);
      template.team.$names.text(Team.get(ids[i]).names.join(', '));
      template.$anchor.append(template.team.$container.clone());
    }
  }

  function setSystemState ($system, Tournament) {
    var stateclass;

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

  function updateSystems () {
    var $anchor, height, $clone, $swiss, Tournament;

    $anchor = $tab.find('.team').eq(0);

    if ($anchor.length == 0) {
      if (Team.count() > 0) {
        console.error("could't find anchor for system");
      }
      return;
    }

    // TODO read number of teams from Tournaments
    height = Team.count();

    $clone = template.$system.clone();

    if (Tournaments.numTournaments() > 0) {
      // FIXME find the last running one
      Tournament = Tournaments.getTournament(0);

      // FIXME read all tournaments and span accordingly
      $clone.append(template.system.$swiss.clone());
      $clone.addClass('swiss');
      initSwiss($clone, Tournament);
    } else {
      $clone.append(template.system.$newsystem.clone());
      $clone.addClass('newsystem');
      initNewsystem($clone);
    }

    $clone.attr('rowspan', height);
    setSystemState($clone, Tournament);

    $anchor.find('td').css('border-top', 'solid 1px black');
    $anchor.append($clone);
  }

  function addNewSystem (type) {
    var Tournament, tournamentid;

    // TODO use position information
    // TODO verify type

    Tournament = Tournaments.addTournament(type);
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
  function initSwiss ($swiss, Swiss) {
    var $swissmode, round, $perms;

    // set texts for current round
    round = Swiss.getRanking().round;
    $swiss.find('.round').text(round);
    $swiss.find('.nextround').text(round + 1);

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
      if (Swiss.getState() === 0) {
        // register players
        for (i = 0; i < Team.count(); i += 1) {
          Swiss.addPlayer(i);
        }
      }
      if (Swiss.start()) {
        round = Swiss.getRanking().round;

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
