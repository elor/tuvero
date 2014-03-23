define([ './toast', './strings', './history', './swiss', './tab_ranking',
    '../backend/game', './storage', './tabshandle' ], function (Toast, Strings, History, Swiss, Tab_Ranking, Game, Storage, Tabshandle) {
  var Tab_History, currentround, $form, abort;

  $form = undefined;
  abort = undefined;

  currentround = 0;

  Tab_History = {};

  $(function ($) {
    var $tpl, $h3, $anchor, $nanchor, $spans, $hanchor, setRound, $bye, $teamnos;

    $h3 = $('h3.tpl');
    $h3.detach();
    $h3.removeClass('tpl');

    // prepare templates
    $tpl = $('#history .game.tpl');
    $tpl.detach();
    $tpl.removeClass('tpl');
    $teamnos = $tpl.find('.teamno');
    $spans = $tpl.find('.correct .points');

    $form = $tpl.find('.chpoints');
    $form.detach();

    $bye = $('#history .bye.tpl');
    $bye.detach();
    $bye.removeClass('tpl');

    // no games can be added by default
    $anchor = undefined;
    $nanchor = $('#history > br.clear'); // next anchor
    $hanchor = $('#history > h2');

    setRound = function (round) {
      if (currentround === round) {
        return;
      }

      currentround = round;

      // update anchor and insert new header with current round
      $anchor = $nanchor;
      $nanchor = $h3.clone();
      $nanchor.find('span').text(currentround);
      $hanchor.after($nanchor);
    };

    /**
     * hints Tab_history that a new round might have started, which it verifies
     * by itself. If so, a new header is added and the anchors are updated
     */
    Tab_History.nextRound = function () {
      setRound(Swiss.getRound());
    };

    /**
     * creates a box for the current result in the current round. Note that the
     * correct round isn't verified (both in the result and currentround)
     * 
     * @param result
     *          a result as returned by history.get()
     */
    Tab_History.createBox = function (result) {
      if (currentround === 0 || $anchor === undefined) {
        return undefined;
      }

      // fill the fields
      $($teamnos[0]).text(result.t1 + 1);
      $($teamnos[1]).text(result.t2 + 1);
      $($spans[0]).text(result.p1);
      $($spans[1]).text(result.p2);

      // release the box to the DOM
      $anchor.before($tpl.clone());

      Tabshandle.show('history');
    };

    /**
     * creates a box for a bye within the current round. No round verification.
     * 
     * @param teamid
     *          id of the team receiving a bye
     */
    Tab_History.createBye = function (teamid) {
      if ($anchor === undefined) {
        return undefined;
      }

      // fill the fields
      $bye.find('span').text(teamid + 1);

      // release the box to the DOM
      $anchor.before($bye.clone());
    };

    /**
     * remove all evidence of any games ever (from the overview only)
     */
    Tab_History.reset = function () {
      abort();

      // remove games
      $('#history > .game').remove();

      // remove byes
      $('#history > .bye').remove();

      // remove headers
      $('#history > h3').remove();

      // reset the round to 0
      currentround = 0;

      // reset anchors
      $anchor = undefined;
      $nanchor = $('#history > br.clear');
    };

    /**
     * removes and redraws all boxes from History
     */
    Tab_History.update = function () {
      var round, maxround, id, numgames, bye, empty;

      empty = true;

      Tab_History.reset();

      maxround = History.numRounds();
      for (round = 1; round <= maxround; round += 1) {
        setRound(round);

        bye = History.getBye(round);
        if (bye !== undefined) {
          empty = false;
          Tab_History.createBye(bye);
        }

        numgames = History.numGames(round);
        for (id = 0; id < numgames; id += 1) {
          empty = false;
          Tab_History.createBox(History.get(round, id));
        }
      }

      if (empty) {
        Tabshandle.hide('history');
      }
    };

  });

  $(function ($) {
    var $button, $inputs, show, save, isInt, verify;

    isInt = function (n) {
      return n % 1 === 0;
    };

    $button = undefined;

    $inputs = $form.find('input');
    $inputs = [ $($inputs[0]), $($inputs[1]) ];
    $save = $form.find('button');

    verify = function (p1, p2) {
      return isInt(p1) && isInt(p2) && !isNaN(p1) && !isNaN(p2) && p1 !== p2 && p1 >= 0 && p2 >= 0;
    };

    show = function ($game) {
      var $spans;

      $button = $game.find('button.correct');
      $spans = $button.find('.points');
      $spans = [ $($spans[0]), $($spans[1]) ];

      $inputs[0].val($spans[0].text());
      $inputs[1].val($spans[1].text());

      $button.after($form);
      $button.detach();

      $inputs[0].focus();
    };

    abort = function () {
      if ($button === undefined) {
        return undefined;
      }

      $form.after($button);
      $form.detach();
      $button = undefined;

      new Toast(Strings.pointchangeaborted);
    };

    save = function () {
      var op1, op2, np1, np2, $spans, t1, t2, res, game;

      if ($button === undefined) {
        return undefined;
      }

      $spans = $button.find('span');

      // retrieve values
      op1 = Number($($spans[0]).text());
      op2 = Number($($spans[1]).text());

      np1 = Number($inputs[0].val());
      np2 = Number($inputs[1].val());

      // verify values
      if (!verify(op1, op2) || !verify(np1, np2)) {
        new Toast(Strings.invalidresult);
        abort();
        Tab_History.update();
        return undefined;
      }

      // check for equality
      if (op1 === np1 && op2 === np2) {
        abort();
        return undefined;
      }

      // retrieve team ids from displayed team number
      $teams = $form.parents('.game').find('.teamno');
      t1 = Number($($teams[0]).text());
      t2 = Number($($teams[1]).text());

      if (!isInt(t1) || !isInt(t2) || isNaN(t1) || isNaN(t2)) {
        new Toast(Strings.invalidresult);
        abort();
        Tab_History.update();
        return undefined;
      }

      t1 -= 1;
      t2 -= 1;

      // find the game by team ids only
      res = History.find(t1, t2);

      if (res === undefined) {
        new Toast(Strings.invalidresult);
        abort();
        Tab_History.update();
        return undefined;
      }

      // correct new points order if necessary
      if (t1 === res.t2) {
        t1 = np1;
        np1 = np2;
        np2 = t1;

        t1 = op1;
        op1 = op2;
        op2 = t1;
      }

      // compare original points with saved ones
      if (res.p1 !== op1 || res.p2 !== op2) {
        new Toast(Strings.invalidresult);
        abort();
        Tab_History.update();
        return undefined;
      }

      // create Game instance (old one is already destroyed, but swiss doesn't
      // mind)
      game = new Game(res.t1, res.t2);

      // apply correction
      Swiss.correct(game, [ op1, op2 ], [ np1, np2 ]);

      // store correction in history
      res.p1 = np1;
      res.p2 = np2;
      History.correct(res);

      // show correction and recalc ranking
      Tab_Ranking.update();

      // apply values to interface
      $($spans[0]).text(np1);
      $($spans[1]).text(np2);

      $form.after($button);
      $form.detach();
      $button = undefined;

      // save changes
      Storage.changed();

      new Toast(Strings.pointchangeapplied);
    };

    $('#history').delegate('.game .correct', 'click', function (e) {
      var $game;

      abort();

      $button = $(e.target);
      if ($button.prop('tagName') === 'SPAN') {
        $button = $button.parent();
      }
      $game = $button.parent();

      show($game);

      return false;
    });

    $form.submit(function (e) {
      save();
      e.preventDefault();
      return false;
    });

    $form.find('button.abort').click(function (e) {
      abort();

      e.preventDefault();
      return false;
    });
  });

  // FIXME reload from history page moves to another tab because it's closed
  Tabshandle.hide('history');

  return Tab_History;
});
