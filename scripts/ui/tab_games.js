define([ './team', './toast', './strings', './tab_teams', './swiss',
    './tab_ranking', './history', './tab_history', './storage', './options',
    './opts' ], function (Team, Toast, Strings, Tab_Teams, Swiss, Tab_Ranking, History, Tab_History, Storage, Options, Opts) {
  var Tab_Games, $tab, $stages, template, games, $games, options, $perms, permPresets;

  // TODO move to its own file / database
  permPresets = {
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
    // indicate that we don't want to change anything
    custom : undefined
  };

  // references to html elements of the games
  $games = [];
  // local copy of the running games
  games = [];

  Tab_Games = {};
  options = {
    stage : 0,
  };

  function isInt (n) {
    return n % 1 === 0;
  }

  function initStages () {
    $stages = [];

    $stages[stage.PREPARING] = $tab.find('.preparing');
    $stages[stage.RUNNING] = $tab.find('.running');
    $stages[stage.FINISHED] = $tab.find('.finished');
  }

  function setTeamsActive (active) {
    var opts;

    opts = Tab_Teams.getOptions();
    opts.allowRegistrations = active;
    Tab_Teams.setOptions(opts);
  }

  function stage (stage) {
    if (stage >= $stages.length) {
      return undefined;
    }

    if (stage === 0) {
      setTeamsActive(true);
    } else {
      setTeamsActive(false);
    }

    $stages.forEach(function ($stage) {
      $stage.hide();
    });

    $stages[stage].show();

    options.stage = stage;
  }

  stage.PREPARING = 0;
  stage.RUNNING = 1;
  stage.FINISHED = 2;

  /**
   * a round has started, so we init some stuff. called after Swiss.start() and
   * Swiss.newRound(), hence the separete function
   */
  function startRound () {
    var votes, team;

    new Toast(Strings.roundstarted.replace("%s", Swiss.getRanking().round));
    showRound();
    showRunning();
    showVotes();
    // TODO use event system
    Tab_Ranking.update();

    // tell the history that there's a new round
    // TODO use event system
    Tab_History.nextRound();

    // see if there's a byevote
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
  }

  function setSwissMode (mode) {
    var tournamentOptions;

    tournamentOptions = Swiss.getOptions();
    tournamentOptions.mode = mode;
    Swiss.setOptions(tournamentOptions);
  }

  function initPreparations () {
    // close registration and start swiss tournament
    // TODO other tournament types and options
    $tab.find('.preparing .swiss').submit(function (e) {
      // TODO dynamic threshold for different tournament types (grey others out)
      if (Team.count() < 2) {
        new Toast(Strings.notenoughteams);
      } else {
        setSwissMode($tab.find('.preparing .swiss .mode').val());

        // register all teams at the tournament
        Team.prepareTournament(Swiss);
        new Toast(Strings.registrationclosed);

        // show game overview and hide this button
        stage(stage.RUNNING);

        // start game and notify of possible failure (i.e. too few teams)
        if (Swiss.start() === undefined) {
          new Toast(Strings.startfailed, 5);
        } else {
          startRound();
        }
      }

      e.preventDefault();
      return false;
    });
  }

  function initGameTemplate () {
    var $form, $names, $teamnos, i, tmp, $anchor;

    if (template.game) {
      console.error('tab_games: template.game is already defined:');
      console.error(template.game);
      return;
    }

    $form = $stages[stage.RUNNING].find('.game.tpl');

    $form.detach();
    $form.removeClass('tpl');

    $names = [];
    tmp = $form.find('.name');
    for (i = 0; i < Options.maxteamsize; i += 1) {
      $names[i] = tmp.eq(i);
      $names[i + Options.maxteamsize] = tmp.eq(i + Options.maxteamsize);
    }

    tmp = $form.find('.teamno');
    $teamnos = [ tmp.eq(0), tmp.eq(1) ];

    $anchor = $stages[stage.RUNNING].find('.clear').eq(0);

    /**
     * disable/enable the submit button if input is valid
     */
    $stages[stage.RUNNING].delegate('.game input', 'change', function () {
      var $button = $(this).parent().find('button');

      if (readResults($(this).parents('.game')) === undefined) {
        $button.attr('disabled', 'disabled');
        $button.attr('tabindex', '-1');
      } else {
        $button.removeAttr('disabled');
        $button.removeAttr('tabindex');
      }

    });

    $stages[stage.RUNNING].delegate('.game', 'submit', finishGame);
    // TODO Enter key -> press submit button (as a failsafe)
    // TODO Escape key -> reset form

    template.game = {
      $anchor : $anchor,
      $form : $form,
      $names : $names,
      $teamnos : $teamnos,
    };
  }

  function initVoteTemplate () {
    var $vote, $containers, $names, $teamno, i, tmp, $anchors, $votesarea;

    if (template.vote) {
      console.error('tab_games: template.vote is already defined:');
      console.error(template.vote);
      return;
    }

    $votesarea = $stages[stage.RUNNING];
    $vote = $votesarea.find('.votes .tpl');

    $vote.detach();
    $vote.removeClass('tpl');

    $names = [];
    tmp = $vote.find('.name');
    for (i = 0; i < Options.maxteamsize; i += 1) {
      $names[i] = tmp.eq(i);
    }

    $teamno = $vote.find('.teamno');

    $containers = {
      up : $votesarea.find('.up'),
      down : $votesarea.find('.down'),
      bye : $votesarea.find('.bye'),
    };

    $anchors = {
      up : $containers.up.find('.clear'),
      down : $containers.down.find('.clear'),
      bye : $containers.bye.find('.clear'),
    };

    template.vote = {
      $anchors : $anchors,
      $containers : $containers,
      $vote : $vote,
      $names : $names,
      $teamno : $teamno
    };
  }

  function initTemplates () {
    var $gameform, $gnames, $gteamnos, $vote, i, tmp;

    if (template) {
      console.error('tab_games: template is already defined:');
      console.error(template);
      return;
    }

    template = {};

    initGameTemplate();
    initVoteTemplate();

    updateTemplates();
  }

  function updateTemplates () {
    var i, $g1, $g2, $v;

    for (i = 0; i < Options.maxteamsize; i += 1) {
      $g1 = template.game.$names[i];
      $g2 = template.game.$names[i + Options.maxteamsize];
      $v = template.vote.$names[i];

      if (i < Options.teamsize) {
        $g1.css('display', '');
        $g1.prev('br').css('display', '');
        $g2.css('display', '');
        $g2.prev('br').css('display', '');
        $v.css('display', '');
        $v.prev('br').css('display', '');
      } else {
        $g1.css('display', 'none');
        $g1.prev('br').css('display', 'none');
        $g2.css('display', 'none');
        $g2.prev('br').css('display', 'none');
        $v.css('display', 'none');
        $v.prev('br').css('display', 'none');
      }
    }
  }

  /**
   * create and show a box displaying a certain game
   */
  function appendGame (game) {
    var t1, t2, $game, i;

    t1 = Team.get(game.teams[0][0]);
    t2 = Team.get(game.teams[1][0]);

    for (i = 0; i < Options.teamsize; i += 1) {
      template.game.$names[i].text(t1.names[i]);
      template.game.$names[i + Options.maxteamsize].text(t2.names[i]);
    }

    template.game.$teamnos[0].text(t1.id + 1);
    template.game.$teamnos[1].text(t2.id + 1);

    $game = template.game.$form.clone();
    template.game.$anchor.before($game);

    $games.push($game);
    games.push(game);
  }

  /**
   * removes all games from the overview
   */
  function clearGames () {
    $stages[stage.RUNNING].find('.game').remove();
    $games = [];
    games = [];
  }

  /**
   * clears the overview and appends all open games of the tournament
   */
  function showRunning () {
    clearGames();

    Swiss.getGames().forEach(function (game) {
      appendGame(game);
    });

    if (Swiss.getRanking().round !== 0 && games.length === 0) {
      stage(stage.FINISHED);
    }
  }

  /**
   * update all appearances of the current round in the games tab
   */
  function showRound () {
    $tab.find('.round').text(Swiss.getRanking().round);
  }

  /**
   * this function removes the game from the local reference arrays
   * 
   * @param game
   *          the game in question
   * @returns Tab_Games on success, undefined otherwise
   */
  function removeGame (game) {
    var index;

    index = games.indexOf(game);

    if (index === -1) {
      // something's wrong
      return undefined;
    }

    games.splice(index, 1);
    $games[index].remove();
    $games.splice(index, 1);
  }

  function readResults ($container) {
    var $input, i, ret;

    ret = {
      index : -1,
      points : []
    };

    // 
    for (i = 0; i < $games.length; i += 1) {
      if ($games[i].data() === $container.data()) {
        ret.index = i;
        break;
      }
    }

    $input = $container.find('.points');

    // game is invalid. Someone tampered with the system.
    if (ret.index === -1) {
      // redraw all games
      showRunning();
      Tab_Ranking.update();
      return undefined;
    }

    // read and validate
    for (i = 0; i < 2; i += 1) {
      // read and convert to number
      ret.points[i] = Number($($input[i]).val());

      // validate whether number and >= 0
      // TODO Options.maxpoints
      if (isNaN(ret.points[i]) || !isInt(ret.points[i]) || ret.points[i] < 0 || ret.points[i] > 13) {
        // FIXME find a better solution
        // flash?
        // $input.eq(i).focus();

        return undefined;
      }
    }

    // there has to be a winner
    if (ret.points[0] === ret.points[1]) {
      return undefined;
    }

    return ret;
  }

  /**
   * jQuery callback function. works with "this"
   */
  function finishGame () {
    var result, $input, i, res, index, points;

    // if someone wants to finish a game, do the following:
    // * verify that the game was running
    // * get and verify the points
    // * submit the result
    // * remove the game
    // * drink a toast to the game

    result = readResults($(this));

    if (result === undefined) {
      new Toast(Strings.invalidresult, 5);
      return false;
    }

    // TODO extract everything to a new function!

    index = result.index;
    points = result.points;

    if (Swiss.finishGame(games[index], points) === undefined) {
      // game was somehow invalid. Someone tampered with the system.

      // redraw all games
      showRunning();

      // TODO event handler
      Tab_Ranking.update();

      // notify the user of this failure
      new Toast(Strings.invalidresult, 5);

      return false;
    }

    // the game was accepted, store it in history
    res = History.add(games[index], points);
    // TODO avoid direct calls to another tab. use Tab_History.update somehow
    Tab_History.createBox(res);

    // game was accepted. remove it.
    removeGame(games[index]);
    // XXX keep game history
    // XXX why?

    if (points[0] > points[1]) {
      new Toast(Strings.gamefinished);
    }

    // verify for safety. Doesn't cost much
    if (games.length !== $games.length) {
      // game was somehow invalid. Someone tempered with the system.

      // redraw all games
      showRunning();

      Tab_Ranking.update();

      // notify the user of this failure
      new Toast(Strings.invalidresult, 5);

      return false;
    }

    // no games left? clean up and go to stage 2.
    if (games.length === 0) {
      clearGames();
      clearVotes();

      showRound();
      stage(stage.FINISHED);

      new Toast(Strings.roundfinished.replace('%s', Swiss.getRanking().round));
    }

    // save changes
    Storage.changed();

    Tab_Ranking.update();

    return false;
  }

  /**
   * remove all elements in the vote area
   */
  function clearVotes () {
    $stages[stage.RUNNING].find('.votes .vote').remove();
  }

  function createVoteBox (tid) {
    var team, i;
    team = Team.get(tid);

    template.vote.$teamno.text(team.id + 1);
    for (i = 0; i < Options.teamsize; i += 1) {
      template.vote.$names[i].text(team.names[i]);
    }

    return template.vote.$vote.clone();
  }

  /**
   * translates the Swiss ranking into a traditional votes object
   * 
   * TODO rewrite this file to replace this function
   * 
   * @returns {Object} a votes object of the current round
   */
  function getRoundVotes () {
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

  /**
   * display the votes for the current round
   */
  function showVotes () {
    var votes, i, $containers, $anchors;

    // remove old votes
    clearVotes();

    // get votes
    votes = getRoundVotes();

    $containers = template.vote.$containers;
    $anchors = template.vote.$anchors;

    // apply upvotes
    if (votes.up && votes.up.length !== 0) {
      $containers.up.show();
      votes.up.forEach(function (tid) {
        if (tid !== undefined) {
          $anchors.up.before(createVoteBox(tid));
        }
      });
    } else {
      $containers.up.hide();
    }

    // apply down
    if (votes.down && votes.down.length !== 0) {
      $containers.down.show();
      votes.down.forEach(function (tid) {
        if (tid !== undefined) {
          $anchors.down.before(createVoteBox(tid));
        }
      });
    } else {
      $containers.down.hide();
    }

    // apply bye
    if (votes.bye !== undefined) {
      $containers.bye.show();
      $anchors.bye.before(createVoteBox(votes.bye));
    } else {
      $containers.bye.hide();
    }
  }

  function newRound () {
    var i;

    setSwissPermissions();

    for (i = 0; i < 10; i += 1) {
      if (Swiss.start() !== undefined) {
        break;
      }
    }

    if (i === 10) {
      new Toast(Strings.roundfailed, 5);
      return undefined;
    }

    // show game overview and hide this button
    stage(stage.RUNNING);

    startRound();
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

    if (permPresets[preset]) {
      setPermissions(permPresets[preset]);
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

    $container = $tab.find('.finished .votepermissions');

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
      preset : $container.find('.preset'),
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
    $stages[stage.FINISHED].find('button.newround').click(newRound);
    $stages[stage.FINISHED].find('button.korounds').click(function () {
      new Toast(Strings.notimplemented);
    });

    initPermissions();
  }

  function initMaxWidth () {
    var $box;

    $box = $tab.find('.options .maxwidth');

    function maxwidthtest () {
      if ($box.prop('checked')) {
        $tab.addClass('maxwidth');
      } else {
        $tab.removeClass('maxwidth');
      }
    }

    $box.click(maxwidthtest);

    maxwidthtest();
  }

  function init () {
    if ($tab) {
      console.error('tab_games: $tab is already defined:');
      console.error($tab);
      return;
    }

    $tab = $('#games');

    initStages();
    initPreparations();
    initTemplates();
    initFinished();
    initMaxWidth();
  }

  /**
   * reset an original state.
   * 
   * TODO: test
   */
  Tab_Games.reset = function () {
    if (!$tab) {
      init();
    }

    // delete everything
    clearGames();
    clearVotes();

    // reset everything
    updateTemplates();
    stage(stage.PREPARING);
  };

  /**
   * reset an original game state, respecting the current state of Swiss
   */
  Tab_Games.update = function () {
    Tab_Games.reset();

    if (Swiss.getRanking().round === 0) {
      // preparing
      stage(stage.PREPARING);
    } else {
      showRunning();
      showRound();
      showVotes();

      if (games.length === 0 || $games.length === 0) {
        stage(stage.FINISHED);
      } else {
        stage(stage.RUNNING);
      }
    }
  };

  Tab_Games.getOptions = function () {
    return Opts.getOptions({
      options : options
    });
  };

  Tab_Games.setOptions = function (opts) {
    return Opts.setOptions({
      options : options
    }, opts);
  };

  return Tab_Games;
});
