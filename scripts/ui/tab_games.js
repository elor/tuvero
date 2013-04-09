define([ './team', './toast', './strings', './tab_teams', './swiss',
    './tab_ranking', './history', './tab_history' ], function (Team, Toast,
    Strings, Tab_Teams, Swiss, Tab_Ranking, History, Tab_History) {
  var Tab_Games, games, $games, $vtpl, $vanchors, $vnames, $vno, $vcontainers;

  // references to html elements of the games
  $games = undefined;
  // local copy of the running games
  games = undefined;

  Tab_Games = {};

  $(function ($) {
    var $regbut, $stages, $tpl, $tplnames, $tplnos, $anchor, isInt, roundStart;

    isInt = function (n) {
      return n % 1 === 0;
    };

    $stages = [];

    $stages.push($('#games .preparing'));
    $stages.push($('#games .running'));
    $stages.push($('#games .finished'));

    Tab_Games.stage = function (stage) {
      if (stage >= $stages.length) {
        return undefined;
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
    roundStart = function () {
      var votes, team;

      new Toast(Strings.roundstarted.replace("%s", Swiss.getRound()));
      Tab_Games.showRound();
      Tab_Games.showRunning();
      Tab_Games.showVotes();
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
    };

    $regbut = $('#games .preparing button');

    // close registration and start swiss tournament
    $regbut.click(function () {
      if (Team.count() < 2) {
        new Toast(Strings.toofewteams);
        return;
      }

      // deactivate 'new player' form
      Tab_Teams.active(false);

      // register all teams at the tournament
      Team.prepareTournament();
      new Toast(Strings.registrationclosed);

      // show game overview and hide this button
      Tab_Games.stage(1);

      // start game and notify of possible failure (i.e. too few teams)
      if (Swiss.start() === undefined) {
        new Toast(Strings.startfailed, 5);
        return undefined;
      }

      // initiate the games
      $games = [];
      games = [];

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
    Tab_Games.appendGame = function (game) {
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
    };

    /**
     * removes all games from the overview
     */
    Tab_Games.clearGames = function () {
      $('#games .running .game').remove();
      if ($games !== undefined) {
        $games = [];
      }
      if (games !== undefined) {
        games = [];
      }
    };

    /**
     * clears the overview and appends all open games of the tournament
     */
    Tab_Games.showRunning = function () {
      Tab_Games.clearGames();

      Swiss.openGames().forEach(function (game) {
        Tab_Games.appendGame(game);
      });

      if (games !== undefined && games.length === 0) {
        Tab_Games.stage(2);
      }
    };

    /**
     * update all appearences of the current round in the games tab
     */
    Tab_Games.showRound = function () {
      $('#games .running .round').text(Swiss.getRound());
      $('#games .finished .round').text(Swiss.getRound());
    };

    /**
     * this function removes the game from the local reference arrays
     * 
     * @param game
     *          the game in question
     * @returns Tab_Games on success, undefined otherwise
     */
    Tab_Games.removeGame = function (game) {
      var index = games.indexOf(game);

      if (index === -1) {
        // something's wrong
        return undefined;
      }

      games.splice(index, 1);
      $($games[index]).remove();
      $games.splice(index, 1);
      return Tab_Games;
    };

    // if someone wants to finish a game, do the following:
    // * verify that the game was running
    // * get and verify the points
    // * submit the result
    // * remove the game
    // * drink a toast to the game
    $('#games .running').delegate('.game', 'submit', function () {
      var index, points, $input, i, res;

      index = $games.indexOf(this);

      if (index === -1) {
        // game is invalid. Someone tempered with the system.

        // redraw all games
        Tab_Games.showRunning();

        Tab_Ranking.update();

        // notify the user of this failure
        new Toast(Strings.invalidresult, 5);

        return false;
      }

      $input = $(this).find('.points');

      points = [];

      // read and validate
      for (i = 0; i < 2; i += 1) {
        // read and convert to number
        points[i] = Number($($input[i]).val());

        // validate whether number and >= 0
        if (isNaN(points[i]) || points[i] < 0 || !isInt(points[i])) {
          new Toast(Strings.invalidresult);
          $($input[i]).focus();

          return false;
        }
      }

      // there has to be a winner
      if (points[0] === points[1]) {
        new Toast(Strings.invalidresult);
        return false;
      }

      if (Swiss.finishGame(games[index], points) === undefined) {
        // game was somehow invalid. Someone tempered with the system.

        // redraw all games
        Tab_Games.showRunning();

        Tab_Ranking.update();

        // notify the user of this failure
        new Toast(Strings.invalidresult, 5);

        return false;
      }

      // the game was accepted, store it in history
      res = History.add(games[index], points);
      Tab_History.createBox(res);

      // game was accepted. remove it.
      Tab_Games.removeGame(games[index]);
      // TODO keep game history

      if (points[0] > points[1]) {
        new Toast(Strings.gamefinished);
      }

      // verify for safety. Doesn't cost much
      if (games.length !== $games.length) {
        // game was somehow invalid. Someone tempered with the system.

        // redraw all games
        Tab_Games.showRunning();

        Tab_Ranking.update();

        // notify the user of this failure
        new Toast(Strings.invalidresult, 5);

        return false;
      }

      // no games left? clean up and go to stage 2.
      if (games.length === 0) {
        Tab_Games.clearGames();
        Tab_Games.clearVotes();

        Tab_Games.showRound();
        Tab_Games.stage(2);

        new Toast(Strings.roundfinished.replace('%s', Swiss.getRound()));
      }

      Tab_Ranking.update();

      return false;
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
    Tab_Games.clearVotes = function () {
      $('#games .running .votes .vote').remove();
    };

    /**
     * display the votes for the current round
     */
    Tab_Games.showVotes = function () {
      var votes, makeBox;

      // remove old votes
      Tab_Games.clearVotes();

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
          $vanchors[0].before(makeBox(tid));
        });
      } else {
        $vcontainers[0].hide();
      }

      // apply down
      if (votes.down && votes.down.length !== 0) {
        $vcontainers[1].show();
        votes.down.forEach(function (tid) {
          $vanchors[1].before(makeBox(tid));
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
    };

    Tab_Games.newRound = function () {
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
      Tab_Games.stage(1);

      roundStart();
    };

    $('#games .finished button.newround').click(Tab_Games.newRound);

    $('#games .finished button.korounds').click(function () {
      new Toast(Strings.notimplemented);
    });

    // reset the interface just in case
    Tab_Games.stage(0);
  });

  return Tab_Games;
});
