define([ './team', './toast', './strings', './tab_teams', './swiss',
    './tab_ranking', './history', './tab_history', './storage' ], function (Team, Toast, Strings, Tab_Teams, Swiss, Tab_Ranking, History, Tab_History, Storage) {
  var Tab_Games, games, $games, $vtpl, $vanchors, $vnames, $vno, $vcontainers;

  // references to html elements of the games
  $games = [];
  // local copy of the running games
  games = [];

  Tab_Games = {};

  $(function ($) {
    var $regbut, $stages, $tpl, $tplnames, $tplnos, $anchor;

    function isInt (n) {
      return n % 1 === 0;
    }

    $stages = [];

    $stages.push($('#games .preparing'));
    $stages.push($('#games .running'));
    $stages.push($('#games .finished'));

    stage = function (stage) {
      if (stage >= $stages.length) {
        return undefined;
      }

      if (stage === 0) {
        Tab_Teams.active(true);
      } else {
        Tab_Teams.active(false);
      }

      $stages.forEach(function ($stage) {
        $stage.hide();
      });

      $stages[stage].show();

      return Tab_Games;
    };

    /**
     * a round has started, so we init some stuff. called after Swiss.start()
     * and Swiss.newRound(), hence the separete function
     */
    function roundStart () {
      var votes, team;

      new Toast(Strings.roundstarted.replace("%s", Swiss.getRound()));
      showRound();
      showRunning();
      showVotes();
      Tab_Ranking.update();

      // tell the history that there's a new round
      Tab_History.nextRound();

      // see if there's a byevote
      votes = Swiss.getRoundVotes();
      if (votes.bye !== undefined) {
        team = Team.get(votes.bye);
        // remember the byevote
        History.addBye(team);
        // immediately show the byevote
        Tab_History.createBye(team.id);
      }

      // save changes
      Storage.changed();
    }

    $regbut = $('#games .preparing button');

    // close registration and start swiss tournament
    $regbut.click(function () {
      if (Team.count() < 2) {
        new Toast(Strings.toofewteams);
        return;
      }

      // register all teams at the tournament
      Team.prepareTournament();
      new Toast(Strings.registrationclosed);

      // show game overview and hide this button
      stage(1);

      // start game and notify of possible failure (i.e. too few teams)
      if (Swiss.start() === undefined) {
        new Toast(Strings.startfailed, 5);
        return undefined;
      }

      roundStart();
    });

    // prepare template and anchor
    $tpl = $('#games .running .game.tpl');
    $tplnames = $tpl.find('.name');
    $tplnos = $tpl.find('.teamno');
    $tpl.detach();
    $tpl.removeClass('tpl');
    $anchor = $($('#games .running .clear')[0]);

    /**
     * create and show a box displaying a certain game
     */
    function appendGame (game) {
      var t1, t2, names, $game;

      t1 = Team.get(game.teams[0][0]);
      t2 = Team.get(game.teams[1][0]);

      names = t1.names.concat(t2.names);

      names.forEach(function (name, index) {
        $($tplnames[index]).text(name);
      });

      $($tplnos[0]).text(t1.id + 1);
      $($tplnos[1]).text(t2.id + 1);

      $game = $tpl.clone();
      $anchor.before($game);

      $games.push($game[0]);
      games.push(game);
    }

    /**
     * removes all games from the overview
     */
    function clearGames () {
      $('#games .running .game').remove();
      $games = [];
      games = [];
    }

    /**
     * clears the overview and appends all open games of the tournament
     */
    function showRunning () {
      clearGames();

      Swiss.openGames().forEach(function (game) {
        appendGame(game);
      });

      if (Swiss.getRound() !== 0 && games.length === 0) {
        stage(2);
      }
    }

    /**
     * update all appearences of the current round in the games tab
     */
    function showRound () {
      $('#games .running .round').text(Swiss.getRound());
      $('#games .finished .round').text(Swiss.getRound());
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
      $($games[index]).remove();
      $games.splice(index, 1);
      return Tab_Games;
    }

    function readResults (container) {
      var $input, i, ret;

      ret = {
        index : $games.indexOf(container),
        points : []
      };

      $input = $(container).find('.points');

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
          // $($input[i]).focus();

          return undefined;
        }
      }

      // there has to be a winner
      if (ret.points[0] === ret.points[1]) {
        return undefined;
      }

      return ret;
    }

    // if someone wants to finish a game, do the following:
    // * verify that the game was running
    // * get and verify the points
    // * submit the result
    // * remove the game
    // * drink a toast to the game
    $('#games .running').delegate('.game', 'submit', function () {
      var result, $input, i, res, index, points;

      result = readResults(this);

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
      // TODO keep game history
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
        stage(2);

        new Toast(Strings.roundfinished.replace('%s', Swiss.getRound()));
      }

      // save changes
      Storage.changed();

      Tab_Ranking.update();

      return false;
    }).delegate('.game input', 'change', function () {
      var $button = $(this).parent().find('button');
      if (readResults($(this).parents('.game')[0]) === undefined) {
        $button.removeClass('active');
        $button.attr('tabindex', '-1');
      } else {
        $button.addClass('active');
        $button.removeAttr('tabindex');
      }
    });

    // prepare vote elements
    $vtpl = $('#games .running .votes .tpl');
    $vnames = $vtpl.find('.name');
    $vno = $vtpl.find('.teamno');
    $vtpl.detach();
    $vtpl.removeClass('tpl');
    $vanchors = [];
    $vanchors.push($('#games .running .votes > .up .clear'));
    $vanchors.push($('#games .running .votes > .down .clear'));
    $vanchors.push($('#games .running .votes > .bye .clear'));
    $vcontainers = [];
    $vcontainers.push($('#games .running .votes > .up'));
    $vcontainers.push($('#games .running .votes > .down'));
    $vcontainers.push($('#games .running .votes > .bye'));

    /**
     * remove all elements in the vote area
     */
    function clearVotes () {
      $('#games .running .votes .vote').remove();
    }

    /**
     * display the votes for the current round
     */
    function showVotes () {
      var votes, makeBox;

      // remove old votes
      clearVotes();

      // get votes
      votes = Swiss.getRoundVotes();

      makeBox = function (tid) {
        var team = Team.get(tid);

        $vno.text(team.id + 1);
        team.names.forEach(function (name, id) {
          $($vnames[id]).text(name);
        });

        return $vtpl.clone();
      };

      // apply upvotes
      if (votes.up && votes.up.length !== 0) {
        $vcontainers[0].show();
        votes.up.forEach(function (tid) {
          if (tid !== undefined) {
            $vanchors[0].before(makeBox(tid));
          }
        });
      } else {
        $vcontainers[0].hide();
      }

      // apply down
      if (votes.down && votes.down.length !== 0) {
        $vcontainers[1].show();
        votes.down.forEach(function (tid) {
          if (tid !== undefined) {
            $vanchors[1].before(makeBox(tid));
          }
        });
      } else {
        $vcontainers[1].hide();
      }
      // apply bye
      if (votes.bye !== undefined) {
        $vcontainers[2].show();
        $vanchors[2].before(makeBox(votes.bye));
      } else {
        $vcontainers[2].hide();
      }
    }

    function newRound () {
      var i;
      for (i = 0; i < 10; i += 1) {
        if (Swiss.newRound() !== undefined) {
          break;
        }
      }

      if (i === 10) {
        new Toast(Strings.roundfailed, 5);
        return undefined;
      }

      // show game overview and hide this button
      stage(1);

      roundStart();
    }

    /**
     * reset an original state.
     * 
     * TODO: test
     */
    Tab_Games.reset = function () {
      clearGames();
      clearVotes();
      stage(0);
    };

    /**
     * reset an original game state, respecting the current state of Swiss
     */
    Tab_Games.update = function () {

      if (Swiss.getRound() === 0) {
        // preparing
        stage(0);
      } else {
        showRunning();
        showRound();
        showVotes();

        if (games.length === 0 || $games.length === 0) {
          stage(2);
        } else {
          stage(1);
        }
      }
    };

    $('#games .finished button.newround').click(newRound);

    $('#games .finished button.korounds').click(function () {
      new Toast(Strings.notimplemented);
    });
  });

  $(function ($) {
    var $box, $games;

    $box = $('#games .options .maxwidth');
    $games = $('#games');

    function maxwidthtest () {
      if ($box.prop('checked')) {
        $games.addClass('maxwidth');
      } else {
        $games.removeClass('maxwidth');
      }
    }

    $box.click(maxwidthtest);

    maxwidthtest();
  });

  return Tab_Games;
});
