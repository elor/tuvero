define([ './toast', './strings', './history', './swiss', './tab_ranking',
    '../backend/game', './storage', './tabshandle', './opts', './team' ], function (Toast, Strings, History, Swiss, Tab_Ranking, Game, Storage, Tabshandle, Opts, Team) {
  var Tab_History, $tab, template, currentround, $button, options, updatepending;

  updatepending = false;

  Tab_History = {};
  options = {};

  function setRound (round) {
    var $newcontainer;
    if (currentround === round) {
      return;
    }

    currentround = round;

    // update anchor and insert new header with current round
    template.$roundno.text(currentround);
    $newcontainer = template.$container.clone();
    $tab.append($newcontainer);
    template.$anchor = $newcontainer.find('table');
  }

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
   *          a result as returned by history.get()
   */
  function createBox (result) {
    if (currentround === 0 || template.$anchor === undefined) {
      return undefined;
    }

    // fill the fields
    template.game.$teamnos[0].text(result[0] + 1);
    template.game.$teamnos[1].text(result[1] + 1);
    template.game.$names[0].html(formatNamesHTML(result[0]));
    template.game.$names[1].html(formatNamesHTML(result[1]));
    template.game.$points[0].text(result[2]);
    template.game.$points[1].text(result[3]);

    // release the box to the DOM
    template.$anchor.append(template.game.$game.clone());

    Tabshandle.show('history');
  }

  /**
   * creates a box for a bye within the current round. No round verification.
   * 
   * @param teamid
   *          id of the team receiving a bye
   */
  function createBye (teamid) {
    if (template.$anchor === undefined) {
      return undefined;
    }

    template.bye.$teamno.text(teamid + 1);
    template.bye.$names.html(formatNamesHTML(teamid));
    template.$anchor.append(template.bye.$bye.clone());

    Tabshandle.show('history');
  }

  function isInt (n) {
    return n % 1 === 0;
  }

  function verify (p1, p2) {
    return isInt(p1) && isInt(p2) && !isNaN(p1) && !isNaN(p2) && p1 !== p2 && p1 >= 0 && p2 >= 0;
  }

  function showCorrection ($game) {
    var $points;

    // TODO somehow store the actual game id!
    $button = $game.find('button.correct');
    $points = $button.find('.points');
    $points = [ $($points[0]), $($points[1]) ];

    template.chpoints.$inputs[0].val($points[0].text());
    template.chpoints.$inputs[1].val($points[1].text());

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
    var op1, op2, np1, np2, $points, t1, t2, res, game, tmp, correction;

    if ($button === undefined) {
      return undefined;
    }

    $points = $button.find('.points');

    // retrieve values
    // TODO find better solution!
    op1 = Number($($points[0]).text());
    op2 = Number($($points[1]).text());

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
    $teams = template.chpoints.$chpoints.parents('.game').find('.number');
    t1 = Number($($teams[0]).text());
    t2 = Number($($teams[1]).text());

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
    res = History.findGames(0, t1, t2);

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
    Swiss().correct(game, [ op1, op2 ], [ np1, np2 ]);

    correction = res.slice(0);

    // store correction in history
    correction[2] = np1;
    correction[3] = np2;
    History.addCorrection(0, res, correction);

    // show correction and recalc ranking
    // TODO event passing
    Tab_Ranking.update();

    // apply values to interface
    $($points[0]).text(np1);
    $($points[1]).text(np2);

    template.chpoints.$chpoints.after($button);
    template.chpoints.$chpoints.detach();
    $button = undefined;

    // save changes
    // TODO event handler
    Storage.changed();

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
      if ($progressbox.prop('checked')) {
        $tab.addClass('progress');
      } else {
        $tab.removeClass('progress');
      }
    }

    $progressbox.click(progresstest);
    progresstest();
  }

  function initCorrection () {
    $button = undefined;

    $tab.on('click', '.game .correct', function () {
      var $game;

      // abort previous correction attempts
      abortCorrection();

      $button = $(this);
      // move to the actual button, if the user clicked the span
      if ($button.prop('tagName') === 'SPAN') {
        $button = $button.parent();
      }
      $game = $button.parent();

      showCorrection($game);

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

    // header template
    template.$roundno = template.$container.find('.roundno');

    // game template
    template.game = {};

    template.game.$game = template.$container.find('.game.tpl');
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
    template.game.$points = [];
    tmp = template.game.$game.find('.correct .points');
    for (i = 0; i < tmp.length; i += 1) {
      template.game.$points[i] = tmp.eq(i);
    }

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
    template.bye.$bye = template.$container.find('.bye.tpl');
    template.bye.$bye.detach();
    template.bye.$bye.removeClass('tpl');
    template.bye.$teamno = template.bye.$bye.find('.number');
    template.bye.$names = template.bye.$bye.find('.names');

    template.$anchor = undefined;
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
  Tab_History.update = function () {
    if (updatepending) {
      console.log('updatepending');
    } else {
      updatepending = true;
      window.setTimeout(function () {
        var round, maxround, id, numgames, bye, empty, votes;

        empty = true;

        Tab_History.reset();

        votes = History.getVotes(0);
        maxround = History.numRounds(0);
        for (round = 0; round < maxround; round += 1) {
          setRound(round + 1);

          bye = undefined;
          // search the bye for this round
          // TODO preprocessing?
          votes.map(function (vote) {
            var bye;
            if (vote[0] == History.BYE && vote[2] == round) {
              bye = vote[1];
              if (bye !== undefined) {
                empty = false;
                createBye(bye);
              }
            }
          });

          History.getRound(0, round).map(function (game) {
            empty = false;
            createBox(game);
          });
        }

        if (empty) {
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
