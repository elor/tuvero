define([ './toast', './strings', './history', './tournaments', './tab_ranking',
    '../backend/game', './storage', './tabshandle', './opts', './team',
    './options' ], function (Toast, Strings, History, Tournaments, Tab_Ranking, Game, Storage, Tabshandle, Opts, Team, Options) {
  var Tab_History, $tab, template, currentround, $button, options, updatepending, progresstable;

  updatepending = false;
  progresstable = true;

  Tab_History = {};
  options = {};

  function formatNamesHTML (teamid) {
    var team, names;

    team = Team.get(teamid);

    if (!team)
      return undefined;

    return team.names.join('<br>');
  }

  /**
   * creates a box for the current result in the current round. Note that the
   * correct round isn't verified (both in the result and currentround)
   * 
   * @param result
   *          a result as returned by history.getGame()
   */
  function createGame (result, $table) {
    // fill the fields
    template.game.$teamnos[0].text(result[0] + 1);
    template.game.$teamnos[1].text(result[1] + 1);
    template.game.$names[0].html(formatNamesHTML(result[0]));
    template.game.$names[1].html(formatNamesHTML(result[1]));
    template.game.$correct.text(result[2] + ':' + result[3]);

    // release the box to the DOM
    $table.append(template.game.$game.clone());
  }

  /**
   * creates a box for a bye within the current round. No round verification.
   * 
   * @param teamid
   *          id of the team receiving a bye
   */
  function createBye (teamid, $table) {
    template.bye.$teamno.text(teamid + 1);
    template.bye.$names.html(formatNamesHTML(teamid));

    $table.append(template.bye.$bye.clone());
  }

  function isInt (n) {
    return n % 1 === 0;
  }

  function verify (p1, p2) {
    return isInt(p1) && isInt(p2) && !isNaN(p1) && !isNaN(p2) && p1 !== p2 && p1 >= 0 && p2 >= 0;
  }

  function showCorrection () {
    var points;

    // TODO somehow store the actual game id!
    points = $button.text().split(':').map(function (str) {
      return Number(str);
    });

    template.chpoints.$inputs[0].val(points[0]);
    template.chpoints.$inputs[1].val(points[1]);

    $button.after(template.chpoints.$chpoints);
    // TODO hide() instead of detach()
    $button.detach();

    template.chpoints.$inputs[0].focus();
  }

  function abortCorrection () {
    if ($button === undefined) {
      return undefined;
    }

    template.chpoints.$chpoints.after($button);
    template.chpoints.$chpoints.detach();
    $button = undefined;

    new Toast(Strings.pointchangeaborted);
  }

  function saveCorrection () {
    // TODO validate everything:
    // * point ranges * a-z * space
    var op1, op2, np1, np2, points, t1, t2, res, game, tmp, correction, $box, tournamentid;

    if ($button === undefined) {
      return undefined;
    }

    $box = template.chpoints.$chpoints.parents('.box');
    if (!$box.length) {
      console.error('$box not found');
      return undefined;
    }
    tournamentid = $box.data('tournamentid');
    if (tournamentid === undefined) {
      console.error('cannot find tournamentid of $box');
      return undefined;
    }
    // retrieve values
    // TODO find better solution!
    points = $button.text().split(':').map(function (str) {
      return Number(str);
    });

    op1 = points[0];
    op2 = points[1];

    np1 = Number(template.chpoints.$inputs[0].val());
    np2 = Number(template.chpoints.$inputs[1].val());

    // verify values
    if (!verify(op1, op2) || !verify(np1, np2)) {
      new Toast(Strings.invalidresult);
      // TODO don't abort?
      abortCorrection();
      // TODO event passing
      Tab_History.update();
      return undefined;
    }

    // check for equality
    if (op1 === np1 && op2 === np2) {
      // TODO don't abort?
      abortCorrection();
      return undefined;
    }

    // retrieve team ids from displayed team number
    // TODO find better solution!
    if (progresstable) {
      $teams = template.chpoints.$chpoints.parents('.team').find('.number');
      t1 = Number($teams.text());
      t2 = Number(template.chpoints.$chpoints.prev().text());
    } else {
      $teams = template.chpoints.$chpoints.parents('.game').find('.number');
      t1 = Number($($teams[0]).text());
      t2 = Number($($teams[1]).text());
    }

    if (!isInt(t1) || !isInt(t2) || isNaN(t1) || isNaN(t2)) {
      new Toast(Strings.invalidresult);
      // TODO don't abort?
      abortCorrection();
      // TODO event passing
      Tab_History.update();
      return undefined;
    }

    t1 -= 1;
    t2 -= 1;

    // find the game by team ids only
    res = History.findGames(tournamentid, t1, t2);

    if (res === undefined || res.length === 0) {
      new Toast(Strings.invalidresult);
      // TODO don't abort?
      abortCorrection();
      // TODO event passing
      Tab_History.update();
      return undefined;
    }

    if (res.length !== 1) {
      console.error('History.findGames() result contains more than 1 match');
      // TODO don't abort?
      abortCorrection();
      // TODO event passing
      Tab_History.update();
      return undefined;
    }

    res = res[0];

    // flip team order if necessary (shouldn't be, but let's be careful)
    if (t1 === res[1]) {
      tmp = np1;
      np1 = np2;
      np2 = tmp;

      tmp = op1;
      op1 = op2;
      op2 = tmp;
    }

    // compare original points with saved ones
    if (res[2] !== op1 || res[3] !== op2) {
      new Toast(Strings.invalidresult);
      // TODO don't abort?
      abortCorrection();
      // TODO event passing
      Tab_History.update();
      return undefined;
    }

    // create Game instance (old one is already destroyed, but the backend is
    // designed to not mind
    game = new Game(res[0], res[1]);

    // apply correction
    // TODO Does Swiss().correct return a game object? wouldn't need the next
    // step
    // FIXME Why store two separate representations of the same correction?
    // Can I just use the tournament correction all the time?
    // This problem is related to the post-tournament ranking storage
    // TODO use correct tournament and round id
    if (Tournaments.isRunning(tournamentid)) {
      Tournaments.getTournament(tournamentid).correct(game, [ op1, op2 ], [
          np1, np2 ]);
    } else {
      new Toast(Strings.toolatetournamentfinished);
    }

    correction = res.slice(0);

    // store correction in history
    correction[2] = np1;
    correction[3] = np2;
    History.addCorrection(tournamentid, res, correction);

    // show correction and recalc ranking
    // TODO event passing
    Tab_Ranking.update();

    // apply values to interface
    $button.text(np1 + ':' + np2);

    template.chpoints.$chpoints.after($button);
    template.chpoints.$chpoints.detach();
    $button = undefined;

    // save changes
    // TODO event handler
    Storage.changed();

    // TODO reload?

    new Toast(Strings.pointchangeapplied);
  }

  function initOptions () {
    var $maxwidthbox, $shownamesbox, $progressbox;

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

    // use progress layout
    $progressbox = $tab.find('.options .progress');
    function progresstest () {
      progresstable = $progressbox.prop('checked');
    }

    $progressbox.click(function () {
      progresstest();
      Tab_History.update();
    });
    progresstest();
  }

  function initCorrection () {
    $button = undefined;

    $tab.on('click', '.team .correct', function () {
      var $game;

      // abort previous correction attempts
      abortCorrection();

      $button = $(this);

      // move to the actual button, if the user clicked the span
      showCorrection();

      return false;
    });

    template.chpoints.$chpoints.submit(function (e) {
      saveCorrection();
      e.preventDefault();
      return false;
    });

    template.chpoints.$chpoints.find('.points').keydown(function (e) {
      if (e.which === 13) {
        // Enter --> submit
        template.chpoints.$chpoints.find('button.save').click();
        e.preventDefault();
        return false;
      } else if (e.which === 27) {
        // Escape --> abort
        template.chpoints.$chpoints.find('button.abort').click();
        e.preventDefault();
        return false;
      }
    });

    template.chpoints.$chpoints.find('button.abort').click(function (e) {
      abortCorrection();

      e.preventDefault();
      return false;
    });
  }

  function initTemplates () {
    var i, tmp;

    if (template) {
      console.error('tab_history: template already exists:');
      console.error(template);
      return;
    }

    template = {};

    // round container template
    template.$container = $tab.find('.box.tpl');
    template.$container.detach();
    template.$container.removeClass('tpl');

    template.kotree = {};

    template.kotree.$container = template.$container.find('.kotree');
    template.kotree.$container.detach();

    template.kotree.$game = template.kotree.$container.find('.game');
    template.kotree.$game.detach();
    template.kotree.$names = template.kotree.$game.find('.names');
    template.kotree.$teamno = template.kotree.$game.find('.number');
    template.kotree.$points = template.kotree.$game.find('.points');

    template.progresstable = {};

    template.progresstable.$container = template.$container.find('table.progresstable');
    template.progresstable.$container.detach();
    template.progresstable.$nameheader = template.progresstable.$container.find('th.names');

    template.progresstable.$gameheader = template.progresstable.$container.find('th.game');
    template.progresstable.$gameheader.detach();
    template.progresstable.$resultheader = template.progresstable.$container.find('th.result');
    template.progresstable.$resultheader.detach();

    template.progresstable.$team = template.progresstable.$container.find('.team');
    template.progresstable.$team.detach();
    template.progresstable.$teamno = template.progresstable.$team.find('.number');
    template.progresstable.$names = template.progresstable.$team.find('.names');

    template.progresstable.$game = template.progresstable.$team.find('td.game');
    template.progresstable.$game.detach();

    template.progresstable.$result = template.progresstable.$team.find('td.result');
    template.progresstable.$result.detach();

    // game template
    template.game = {};

    template.$gamescontainer = template.$container.find('table.gamestable');
    template.$gamescontainer.detach();

    template.game.$game = template.$gamescontainer.find('.game.tpl');
    template.game.$game.detach();
    template.game.$game.removeClass('tpl');

    template.game.$teamnos = [];
    tmp = template.game.$game.find('.number');
    for (i = 0; i < tmp.length; i += 1) {
      template.game.$teamnos[i] = tmp.eq(i);
    }
    template.game.$names = [];
    tmp = template.game.$game.find('.names');
    for (i = 0; i < tmp.length; i += 1) {
      template.game.$names[i] = tmp.eq(i);
    }
    template.game.$correct = template.game.$game.find('.correct');

    // points change template (actually not a template, but who cares?)
    template.chpoints = {};
    template.chpoints.$chpoints = template.game.$game.find('.chpoints');
    template.chpoints.$chpoints.detach();
    template.chpoints.$inputs = [];
    tmp = template.chpoints.$chpoints.find('input');
    for (i = 0; i < tmp.length; i += 1) {
      template.chpoints.$inputs[i] = tmp.eq(i);
    }
    template.chpoints.$savebutton = template.chpoints.$chpoints.find('button');

    // bye template
    template.bye = {};
    template.bye.$bye = template.$gamescontainer.find('.bye.tpl');
    template.bye.$bye.detach();
    template.bye.$bye.removeClass('tpl');
    template.bye.$teamno = template.bye.$bye.find('.number');
    template.bye.$names = template.bye.$bye.find('.names');
  }

  function initRounds () {
    currentround = 0;
  }

  function init () {
    if ($tab) {
      console.error('tab_history: $tab already exists:');
      console.error($tab);
      return;
    }

    $tab = $('#history');

    initRounds();
    initTemplates();
    initCorrection();
    initOptions();

    // FIXME reload from history page moves to another tab because it's closed
    // Tabshandle.hide('history');
  }

  function createGamesTable (tournamentid) {
    var round, maxround, bye, hidden, empty, votes, tournamentid, $box, $table;

    votes = History.getVotes(tournamentid);
    maxround = History.numRounds(tournamentid);

    for (round = 0; round < maxround; round += 1) {
      $box = template.$container.clone();
      $box.find('>h3:first-child').text(Tournaments.getName(tournamentid) + ' - Runde ' + (round + 1));
      $table = template.$gamescontainer.clone();
      $box.append($table);

      bye = undefined;
      // search the bye for this round
      // TODO preprocessing?
      votes.map(function (vote) {
        var bye;
        if (vote[0] == History.BYE && vote[2] == round) {
          bye = vote[1];
          if (bye !== undefined) {
            createBye(bye, $table);
            empty = false;
          }
        }
      });

      History.getRound(tournamentid, round).map(function (game) {
        createGame(game, $table);
        empty = false;
      });

      if (!empty) {
        $tab.append($box);
        $box.data('tournamentid', tournamentid);
        hidden = false;
      }
    }

    return !hidden;
  }

  /**
   * borrowed from jQuery
   */
  function isNumeric (obj) {
    return !jQuery.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
  }

  /**
   * creates a progress mapping, which, for every player, lists every game in
   * every round, with its result and
   * 
   * @param tournamentid
   * @returns the progress mapping
   */
  function getProgressMapping (tournamentid) {
    var teamgames, numteams, roundno, tournament;
    teamgames = [];

    function addGame (round, team, opponent, p1, p2) {
      if (!teamgames[team]) {
        teamgames[team] = [];
      }
      // increase opponent id by 1, since it's zero-indicated, but users like to
      // start at 1
      if (isNumeric(opponent)) {
        opponent += 1;
      }
      teamgames[team][round] = {
        opponent : opponent,
        points : p1 + ':' + p2,
        won : (p1 == p2 ? undefined : p1 > p2),
      };
    }

    if (History.getVotes(tournamentid)) {
      History.getVotes(tournamentid).map(function (vote) {
        if (vote[0] === History.BYE) {
          // TODO read '13:7' from the options!
          addGame(vote[2], vote[1], Strings.byevote, 13, 7);
        }
      });
    }

    if (History.getGames(tournamentid)) {
      History.getGames(tournamentid).map(function (game) {
        addGame(game[4], game[0], game[1], game[2], game[3]);
        addGame(game[4], game[1], game[0], game[3], game[2]);
      });
    }

    tournament = Tournaments.getTournament(tournamentid);
    if (tournament) {
      roundno = Tournaments.getRanking(tournamentid).round - 1;
      tournament.getGames().map(function (game) {
        addGame(roundno, game.teams[0][0], game.teams[1][0], '', '');
        addGame(roundno, game.teams[1][0], game.teams[0][0], '', '');
      });
    } else {
      console.warn('no tournament');
    }

    return teamgames;
  }

  function getTeamVotes (tournamentid) {
    var teamvotes;
    teamvotes = [];

    History.getVotes(tournamentid).map(function (vote) {
      var team;

      team = vote[1];
      if (!teamvotes[team]) {
        teamvotes[team] = '';
      }

      switch (vote) {
      case History.BYE:
        teamvotes[team] += Strings.byevote;
        break;
      case History.UP:
        teamvotes[team] += Strings.upvote;
        break;
      case History.DOWN:
        teamvotes[team] += Strings.downvote;
        break;
      }
    });

    return teamvotes;
  }

  function getRankingMapping (tournamentid) {
    var tournament, ranking, mapping;
    mapping = [];

    ranking = Tournaments.getRanking(tournamentid);

    if (!ranking) {
      console.error('no ranking returned');
      return undefined;
    }

    ranking.ids.map(function (teamid, index) {
      mapping[teamid] = [ ranking.wins[index], ranking.buchholz[index],
          ranking.finebuchholz[index], ranking.netto[index],
          ranking.place[index] + 1 ];
    });

    return mapping;
  }

  function createProgressTable (tournamentid) {
    var teamgames, teamid, team, round, maxround, $box, $table, $row, i, $game;

    maxround = Math.max(History.numRounds(tournamentid) || 0, Tournaments.getRanking(tournamentid).round || 0);

    // prepare table headers
    template.progresstable.$nameheader.removeClass('hidden');
    for (i = Options.teamsize; i < 3; i += 1) {
      template.progresstable.$nameheader.eq(i).addClass('hidden');
    }

    $box = template.$container.clone();
    $box.find('>h3:first-child').text(Tournaments.getName(tournamentid) + ' - Fortschrittstabelle');

    $table = template.progresstable.$container.clone();

    for (i = 0; i < maxround; i += 1) {
      template.progresstable.$gameheader.find('.roundno').text(i + 1);
      $table.find('th:last-child').after(template.progresstable.$gameheader.clone());
    }
    $table.find('th:last-child').after(template.progresstable.$resultheader.clone());

    teamgames = getProgressMapping(tournamentid);
    teamranks = getRankingMapping(tournamentid);

    if (teamgames.length != teamranks.length) {
      console.error('teamgames.length != teamranks.length: ' + teamgames.length + '!=' + teamranks.length);
    }

    template.progresstable.$names.removeClass('hidden');

    for (teamid = 0; teamid < teamgames.length; teamid += 1) {
      if (teamid === undefined) {
        continue;
      }
      team = Team.get(teamid);

      // add team-specific content
      template.progresstable.$teamno.text(teamid + 1);
      for (i = 0; i < 3; i += 1) {
        if (team.names[i]) {
          template.progresstable.$names.eq(i).text(team.names[i]);
        } else {
          template.progresstable.$names.eq(i).addClass('hidden');
        }
      }

      $row = template.progresstable.$team.clone();

      if (teamgames[teamid]) {
        teamgames[teamid].map(function (game) {
          var $game;
          $game = template.progresstable.$game.clone();
          $game.eq(0).text(game.opponent);
          $game.eq(1).text(game.points);
          if (game.opponent === Strings.byevote) {
            $game.eq(1).removeClass('correct editable');
          }
          $game.eq(2).text(Strings['winstatus' + game.won]);
          $row.append($game);
        });
      }

      // append ranking
      teamranks[teamid].map(function (text, id) {
        template.progresstable.$result.eq(id).text(text);
      });
      $row.append(template.progresstable.$result.clone());

      $table.append($row);
    }

    $box.data('tournamentid', tournamentid);
    $box.append($table);
    $tab.append($box);

    return maxround > 0;
  }

  /*****************************************************************************
   * Copied from kotournament.js
   ****************************************************************************/
  function level (id) {
    return Math.floor(Math.log(id + 1) / Math.LN2);
  }

  function parent (id) {
    return Math.floor((id - 1) / 2);
  }

  function lowestid (level) {
    return nodesbylevel(level) - 1;
  }

  function nodesbylevel (level) {
    return 1 << level;
  }

  /*****************************************************************************
   * end (Copied from kotournament.js)
   ****************************************************************************/

  function getGameTreeX (gameid, maxid) {
    var maxlevel, gamelevel, x0, width;

    x0 = 1;
    width = 15;

    maxlevel = level(maxid);
    gamelevel = level(gameid);

    return x0 + (maxlevel - gamelevel) * width;
  }

  function getGameTreeY (gameid, maxid) {
    var maxlevel, gamelevel, y0, height;

    y0 = 1;
    height = 5;

    maxlevel = level(maxid);
    gamelevel = level(gameid);
    firstid = lowestid(gamelevel);

    return y0 + height * Math.pow(2, maxlevel - gamelevel - 1) + height * Math.floor(Math.pow(2, maxlevel - gamelevel + 1) * 0.5) * (gameid - firstid);
  }

  function createGameTreeBox (game, maxid) {
    var x, y;

    template.kotree.$teamno.eq(0).text(game.t1 === undefined ? '' : game.t1 + 1);
    template.kotree.$teamno.eq(1).text(game.t2 === undefined ? '' : game.t2 + 1);

    template.kotree.$names.text('');
    if (game.t1 !== undefined) {
      template.kotree.$names.eq(0).text(Team.get(game.t1).names.join(', '));
    }
    if (game.t2 !== undefined) {
      template.kotree.$names.eq(1).text(Team.get(game.t2).names.join(', '));
    }

    template.kotree.$points.text(game.p1 + ':' + game.p2);

    x = getGameTreeX(game.id, maxid);
    y = getGameTreeY(game.id, maxid);

    return template.kotree.$game.clone().css('left', x + 'em').css('top', y + 'em');
  }

  function createKOTree (tournamentid) {
    var games, i, $box, g, $game, parentid;

    games = [];

    // add finished games
    if (History.numRounds(tournamentid)) {
      History.getGames(tournamentid).map(function (game) {
        games.push({
          id : game[5],
          t1 : game[0],
          t2 : game[1],
          p1 : game[2],
          p2 : game[3],
        });
      });
    }

    // add running games
    if (Tournaments.isRunning(tournamentid)) {
      Tournaments.getTournament(tournamentid).getGames().map(function (game) {
        games.push({
          id : game.id,
          t1 : game.teams[0][0],
          t2 : game.teams[1][0],
          p1 : '',
          p2 : '',
        });
      });
    }

    // sort all the games
    games.sort(function (a, b) {
      return a.id - b.id;
    });

    // insert empty games where they're missing
    for (i = 0; i < games.length; i += 1) {
      if (games[i].id > i) {
        games.splice(i, 0, {
          id : i,
          t1 : undefined,
          t2 : undefined,
          p1 : '',
          p2 : '',
        });

      }
    }

    // add byevotes through another cheap hack
    if (Tournaments.isRunning(tournamentid)) {
      Tournaments.getTournament(tournamentid).gameid.map(function (id, teamno) {
        if (id > 0 && games[id].t1 === undefined) {
          games[id].t1 = teamno;
        }
      });
    }

    if (!games.length) {
      return false;
    }

    // print the games

    $box = template.$container.clone();
    $box.find('>h3:first-child').text(Tournaments.getName(tournamentid) + ' - KO-Baum');

    $tree = template.kotree.$container.clone();

    for (i = 0; i < games.length; i += 1) {
      g = games[i];
      $game = createGameTreeBox(g, games.length - 1);
      g.$box = $game;
      $tree.append($game);
    }

    $box.append($tree);
    $tab.append($box);

    rightmost = 0;
    bottommost = 0;

    jsPlumbInstance = jsPlumb.getInstance();

    // create endpoints and update the leftmost and bottommost points
    for (i = 0; i < games.length; i += 1) {
      $game = games[i].$box;

      addKOGamesEndpoints($game, jsPlumbInstance);

      console.log();
      rightmost = Math.max(Number($game.css('left').replace(/px$/, '')) + Number($game.css('width').replace(/px$/, '')), rightmost);
      bottommost = Math.max(Number($game.css('top').replace(/px$/, '')) + Number($game.css('height').replace(/px$/, '')), bottommost);
    }

    rightmost += 10;
    bottommost += 10;

    $tree.width(rightmost);
    $tree.height(bottommost);

    // connect the games
    for (i = games.length - 1; i >= 0; i -= 1) {
      parentid = parent(games[i].id);
      if (parentid >= 0) {
        connectKOGames(games[i].$box, games[parentid].$box, jsPlumbInstance);
      }
    }

    return games.length > 0;
  }

  function addKOGamesEndpoints ($game, jsPlumbInstance) {
    $game.data('rightendpoint', jsPlumbInstance.addEndpoint($game.get(0), {
      endpoint : "Blank",
      anchor : "Right",
      maxConnections : 5,
    }, undefined));

    $game.data('leftendpoint', jsPlumbInstance.addEndpoint($game.get(0), {
      endpoint : "Blank",
      anchor : "Left",
      maxConnections : 5,
    }, undefined));
  }

  function connectKOGames ($left, $right, jsPlumbInstance) {
    jsPlumbInstance.connect({
      source : $left.data('rightendpoint'),
      target : $right.data('leftendpoint'),
      paintStyle : {
        lineWidth : 2,
        strokeStyle : 'black'
      },
      connector : [ "Flowchart", {
        curviness : 20,
        width : 1
      }, undefined ]
    }, undefined);
  }

  function showTournaments () {
    var hidden, tournamentid, displayfunc, PROGRESSTABLE, GAMESTABLE, numtournaments;

    hidden = true;

    displaytype = progresstable ? PROGRESSTABLE : GAMESTABLE;

    numtournaments = Math.max(History.numTournaments() || 0, Tournaments.numTournaments() || 0);

    for (tournamentid = 0; tournamentid < numtournaments; tournamentid += 1) {

      switch (Tournaments.getType(tournamentid)) {
      case 'swiss':
        displayfunc = createProgressTable;
        break;
      case 'ko':
        displayfunc = createKOTree;
        break;
      default:
        displayfunc = createGamesTable;
        break;
      }

      if (!progresstable) {
        displayfunc = createGamesTable;
      }

      if (displayfunc(tournamentid)) {
        hidden = false;
      }
    }

    return !hidden;
  }

  /**
   * remove all evidence of any games ever (from the overview only)
   */
  Tab_History.reset = function () {
    if (!$tab) {
      init();
    }

    abortCorrection();

    // remove containers
    $tab.find('.box').remove();

    // reset the round to 0
    currentround = 0;
  };

  /**
   * removes and redraws all boxes from History
   */
  Tab_History.update = function (force) {

    if (force) {
      updatepending = false;
    }

    if (updatepending) {
      console.log('updatepending');
    } else {
      updatepending = true;
      window.setTimeout(function () {

        Tab_History.reset();

        if (showTournaments()) {
          Tabshandle.show('history');
        } else {
          Tabshandle.hide('history');
        }
        updatepending = false;
        console.log('update');
      }, 1);
    }
  };

  Tab_History.getOptions = function () {
    return Opts.getOptions({
      options : options
    });
  };

  Tab_History.setOptions = function (opts) {
    return Opts.setOptions({
      options : options
    }, opts);
  };

  return Tab_History;
});
