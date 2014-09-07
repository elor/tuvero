define([ './team', './toast', './strings', './tab_teams', './swiss',
    './tab_ranking', './history', './tab_history', './storage', './options',
    './opts', './tabshandle' ], function (Team, Toast, Strings, Tab_Teams, Swiss, Tab_Ranking, History, Tab_History, Storage, Options, Opts, Tabshandle) {
  var Tab_Games, $tab, template, games, $games, options, updatependng;

  updatepending = false;

  // references to html elements of the games
  $games = [];
  // local copy of the running games
  games = [];

  Tab_Games = {};
  options = {};

  function isInt (n) {
    return n % 1 === 0;
  }

  function initGameTemplate () {
    var $form, $names, $teamnos, i, tmp, $anchor;

    if (template.game) {
      console.error('tab_games: template.game is already defined:');
      console.error(template.game);
      return;
    }

    $form = $tab.find('.game.tpl');

    $form.detach();
    $form.removeClass('tpl');

    $names = [];
    tmp = $form.find('.names');
    $names[0] = tmp.eq(0);
    $names[1] = tmp.eq(1);

    tmp = $form.find('.teamno');
    $teamnos = [ tmp.eq(0), tmp.eq(1) ];

    $anchor = $tab.find('.votes').eq(0);

    /**
     * disable/enable the submit button if input is valid
     */
    $tab.on('change', '.game input', function () {
      var $button = $(this).parent().find('button');

      if (readResults($(this).parents('.game')) === undefined) {
        $button.attr('disabled', 'disabled');
        $button.attr('tabindex', '-1');
      } else {
        $button.removeAttr('disabled');
        $button.removeAttr('tabindex');
      }

    });

    $tab.on('submit', '.game', function (event) {
      finishGame.call(this);
      event.preventDefault();
      return false;
    });
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
    var $vote, $containers, $names, $teamno, i, tmp;

    if (template.vote) {
      console.error('tab_games: template.vote is already defined:');
      console.error(template.vote);
      return;
    }

    $vote = $tab.find('.votes .tpl');

    $vote.detach();
    $vote.removeClass('tpl');

    $names = $vote.find('.names');

    $teamno = $vote.find('.teamno');

    $containers = {
      up : $tab.find('.up'),
      down : $tab.find('.down'),
      bye : $tab.find('.bye'),
    };

    template.vote = {
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
  }

  /**
   * create and show a box displaying a certain game
   */
  function appendGame (game) {
    var t1, t2, $game, i;

    t1 = Team.get(game.teams[0][0]);
    t2 = Team.get(game.teams[1][0]);

    template.game.$names[0].html(t1.names.join('<br>'));
    template.game.$names[1].html(t2.names.join('<br>'));

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
    $tab.find('.game').remove();
    $games = [];
    games = [];
  }

  /**
   * clears the overview and appends all open games of the tournament
   */
  function showRunning () {
    clearGames();

    Swiss().getGames().forEach(function (game) {
      appendGame(game);
    });
  }

  /**
   * update all appearances of the current round in the games tab
   */
  function showRound () {
    // getRanking() is actually buffered, so no caveat here
    $tab.find('.round').text(Swiss().getRanking().round);
    $tab.find('.nextround').text(Swiss().getRanking().round + 1);
  }

  function showTab () {
    if (games.length === 0 || $games.length === 0) {
      Tabshandle.hide('games');
    } else {
      Tabshandle.show('games');
    }
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
    var $input, i, ret, round;

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
      if (isNaN(ret.points[i]) || !isInt(ret.points[i]) || ret.points[i] < 0 || ret.points[i] > Options.maxpoints) {
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
      new Toast(Strings.invalidresult, Toast.LONG);
      return false;
    }

    // TODO extract everything to a new function!

    index = result.index;
    points = result.points;

    if (Swiss().finishGame(games[index], points) === undefined) {
      // game was somehow invalid. Someone tampered with the system.

      // redraw all games
      showRunning();

      // TODO event handler
      Tab_Ranking.update();

      // notify the user of this failure
      new Toast(Strings.invalidresult, Toast.LONG);

      return false;
    }

    // the game was accepted, store it in history
    round = Swiss().getRanking().round;
    res = History.addResult(0, games[index].teams[0][0], games[index].teams[1][0], points[0], points[1], round - 1);
    Tab_History.update();

    // game was accepted. remove it.
    removeGame(games[index]);

    if (points[0] > points[1]) {
      new Toast(Strings.gamefinished);
    }

    // verify for safety. Doesn't cost much
    if (games.length !== $games.length) {
      // game was somehow invalid. Someone tempered with the system.

      console.error('games != $games');

      // redraw all games
      showRunning();

      Tab_Ranking.update();

      // notify the user of this failure
      new Toast(Strings.invalidresult, Toast.LONG);

      return false;
    }

    // no games left? clean up and go to stage 2.
    if (games.length === 0) {
      clearGames();
      clearVotes();

      showRound();

      // hide this tab
      showTab();
      // open tab_new

      new Toast(Strings.roundfinished.replace('%s', Swiss().getRanking().round));
    }

    // save changes
    Storage.changed();

    Tab_Ranking.update();
    // due to circular dependency, we must load Tab_New separately
    require('./tab_new').update();
    if (games.length === 0) {
      Tabshandle.focus('new');
    }

    return false;
  }

  /**
   * remove all elements in the vote area
   */
  function clearVotes () {
    $tab.find('.votes .vote').remove();
  }

  function createVoteBox (tid) {
    var team, i;
    team = Team.get(tid);

    template.vote.$teamno.text(team.id + 1);
    template.vote.$names.html(team.names.join('<br>'));

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
    // FIXME duplicate within tab_new.js
    var votes, ranking, i;

    ranking = Swiss().getRanking();

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
    var votes, i, $containers;

    // remove old votes
    clearVotes();

    // get votes
    votes = getRoundVotes();

    $containers = template.vote.$containers;

    // apply upvotes
    if (votes.up && votes.up.length !== 0) {
      $containers.up.show();
      votes.up.forEach(function (tid) {
        if (tid !== undefined) {
          $containers.up.append(createVoteBox(tid));
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
          $containers.down.append(createVoteBox(tid));
        }
      });
    } else {
      $containers.down.hide();
    }

    // apply bye
    if (votes.bye !== undefined) {
      $containers.bye.show();
      $containers.bye.append(createVoteBox(votes.bye));
    } else {
      $containers.bye.hide();
    }
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
      console.error('tab_games: $tab is already defined:');
      console.error($tab);
      return;
    }

    $tab = $('#games');

    initTemplates();
    initOptions();
  }

  /**
   * reset an original state.
   * 
   * TODO test Tab_Games.reset
   */
  Tab_Games.reset = function () {
    if (!$tab) {
      init();
    }

    // delete everything
    clearGames();
    clearVotes();
  };

  /**
   * reset an original game state, respecting the current state of Swiss
   */
  Tab_Games.update = function () {
    if (updatepending) {
      console.log('updatepending');
    } else {
      updatepending = true;
      window.setTimeout(function () {
        Tab_Games.reset();

        showRound();
        showRunning();
        showVotes();
        showTab();
        updatepending = false;
        console.log('update');
      }, 1);
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
