/**
 * Tab_New handler
 */

define([ './options', './tabshandle', './opts', './toast', './team',
    './strings', './swiss', './tab_games', './tab_ranking', './tab_history',
    './history', './storage', '../backend/tournament' ], function (Options, Tabshandle, Opts, Toast, Team, Strings, Swiss, Tab_Games, Tab_Ranking, Tab_History, History, Storage, Tournament) {
  var Tab_New, $tab, $teamsize, options, $perms, updatepending;

  updatepending = false;

  Tab_New = {};
  options = {
    presets : {
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
    }
  };

  function getSwissMode () {
    var mode;

    mode = Swiss.getOptions().mode;

    $tab.find('.swiss .mode').val(mode);
  }

  function setSwissMode () {
    var tournamentOptions, mode;

    mode = $tab.find('.swiss .mode').val();

    tournamentOptions = Swiss.getOptions();
    tournamentOptions.mode = mode;
    Swiss.setOptions(tournamentOptions);
  }

  /**
   * translates the Swiss ranking into a traditional votes object
   * 
   * TODO rewrite this file to replace this function
   * 
   * @returns {Object} a votes object of the current round
   */
  function getRoundVotes () {
    // FIXME duplicate within tab_games.js
    var votes, ranking, i;

    ranking = Swiss.getRanking();

    votes = {
      up : [],
      down : [],
      bye : undefined,
    };

    for (i = 0; i < ranking.ids.length; i += 1) {
      if (ranking.roundupvote[i]) {
        votes.up.push(ranking.ids[i]);
      }
      if (ranking.rounddownvote[i]) {
        votes.down.push(ranking.ids[i]);
      }
      if (ranking.roundbyevote[i]) {
        votes.bye = ranking.ids[i];
      }
    }

    return votes;
  }

  function closeTeamRegistration () {
    var opts, Tab_Teams;

    Tab_Teams = require('./tab_teams');

    opts = Tab_Teams.getOptions();
    opts.allowRegistrations = false;
    Tab_Teams.setOptions(opts);
  }

  /**
   * a round has started, so we init some stuff. called after Swiss.start() and
   * Swiss.newRound(), hence the separete function
   */
  function startRound () {
    var votes, team;

    // make the ranking update
    // TODO use event system
    Tab_Ranking.update();

    // tell the history that there's a new round
    // TODO use event system / Tab_History.update()
    Tab_History.nextRound();

    // make the history update
    // TODO extract functions into a wrapper around Swiss?
    votes = getRoundVotes();
    if (votes.bye !== undefined) {
      team = Team.get(votes.bye);
      // remember the byevote
      History.addBye(team);
      // immediately show the byevote
      // TODO FIXME use event system
      Tab_History.createBye(team.id);
    }

    // save changes
    // TODO event system
    Storage.changed();

    // show all games
    Tab_Games.update();
    // focus tab_games

    Tabshandle.focus('games');
  }

  function newRound () {
    var i, swissreturn;

    // abort if there's not enough players
    if (Team.count() < 2) {
      new Toast(Strings.notenoughteams);
      return undefined;
    }

    // register all teams at the tournament before the first round
    if (Swiss.getRanking().round === 0) {
      Team.prepareTournament(Swiss);
      new Toast(Strings.registrationclosed);
    }

    // TODO use a private variable
    setSwissMode();
    setSwissPermissions();

    swissreturn = undefined;
    for (i = 0; i < Options.roundtries; i += 1) {
      swissreturn = Swiss.start();
      if (swissreturn !== undefined) {
        break;
      }
    }

    if (swissreturn === undefined) {
      new Toast(Strings.roundfailed, Toast.LONG);
      return undefined;
    }

    new Toast(Strings.roundstarted.replace("%s", Swiss.getRanking().round));

    startRound();

    Tab_New.update();
  }

  function initPreparations () {
    initPermissions();

    $tab.find('.swiss').submit(function (e) {
      newRound();

      e.preventDefault();
      return false;
    });
  }

  /**
   * update all appearances of the current round in the games tab
   */
  function showRound () {
    // getRanking() is actually buffered, so no caveat here
    $tab.find('.round').text(Swiss.getRanking().round);
    $tab.find('.nextround').text(Swiss.getRanking().round + 1);

    // TODO rename function or move
    getSwissMode();
  }

  function setPermissions (perms) {
    var k1, k2, keys;

    $perms.all.removeClass('forbidden');

    for (k1 in perms) {
      for (k2 in perms) {
        if (perms[k1][k2] === false) {
          $perms[k2][k1].addClass('forbidden');
        }
      }
    }
  }

  function updatePermissions () {
    var perms;

    perms = Swiss.getOptions().permissions;

    setPermissions(perms);
  }

  function readPermissions () {
    var perms;

    perms = {
      up : {},
      down : {},
      bye : {},
    };

    // flip the order (swisstournament logic is different)
    // flip the value (permitted vs. forbidden)
    for (k1 in perms) {
      for (k2 in perms) {
        perms[k1][k2] = !$perms[k2][k1].hasClass('forbidden');
      }
    }

    return perms;
  }

  function setSwissPermissions () {
    var opts = Swiss.getOptions();
    opts.permissions = readPermissions();
    Swiss.setOptions(opts);
  }

  function readPermissionPreset () {
    var preset;

    preset = $perms.preset.val();

    if (options.presets[preset]) {
      setPermissions(options.presets[preset]);
    } else if (preset === 'custom') {
      // all fine
    } else {
      console.error('unknown permission preset: ' + preset);
    }
  }

  function initPermissions () {
    var $container;

    if ($perms) {
      console.error('initPermissions: $perms has already been defined');
      return undefined;
    }

    $container = $tab.find('.votepermissions');

    $perms = {
      up : {
        up : $container.find('.up .up'),
        down : $container.find('.up .down'),
        bye : $container.find('.up .bye'),
      },
      down : {
        up : $container.find('.down .up'),
        down : $container.find('.down .down'),
        bye : $container.find('.down .bye'),
      },
      bye : {
        up : $container.find('.bye .up'),
        down : $container.find('.bye .down'),
        bye : $container.find('.bye .bye'),
      },
      preset : $container.parents('form').find('.preset'),
      all : $container.find('.perm'),
    };

    $perms.all.click(function (event) {
      var $this;

      $this = $(this);

      // TODO don't save the state of the system in the DOM!
      if ($this.hasClass('forbidden')) {
        $this.removeClass('forbidden');
      } else {
        $this.addClass('forbidden');
      }

      $perms.preset.val('custom');

      event.preventDefault();
      return false;
    });

    $perms.preset.change(function (event) {
      readPermissionPreset();

      event.preventDefault();
      return false;
    });

    readPermissionPreset();
  }

  function initFinished () {
  }

  function init () {
    if ($tab) {
      console.error('tab_new: $tab already exists:');
      console.error($tab);
      return;
    }

    $tab = $('#new');

    initPreparations();
    initFinished();
  }

  Tab_New.reset = function () {
    if (!$tab) {
      init();
    }
  };

  Tab_New.update = function () {
    if (updatepending) {
      console.log('updatepending');
    } else {
      updatepending = true;
      window.setTimeout(function () {
        Tab_New.reset();

        if (Team.count() < 2) {
          Tabshandle.hide('new');
        } else {
          if (Swiss.getRanking().round !== 0) {
            closeTeamRegistration();
          }
          if (Swiss.getState() === Tournament.STATE.RUNNING) {
            Tabshandle.hide('new');
          } else {
            Tabshandle.show('new');
          }
        }

        showRound();
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

  return Tab_New;
});
