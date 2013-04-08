define([ './toast', './strings', './history', './swiss' ], function (Toast,
    Strings, History, Swiss) {
  var Tab_History, currentround;

  currentround = 0;

  Tab_History = {};

  $(function ($) {
    var $tpl, $header, $anchor, $nextanchor, $spans, $hanchor, setRound, $bye;

    $header = $('h3.tpl');
    $header.detach();
    $header.removeClass('tpl');

    // prepare templates
    $tpl = $('#history .game.tpl');
    $tpl.detach();
    $tpl.removeClass('tpl');
    $spans = $tpl.find('span');

    $bye = $('#history .bye.tpl');
    $bye.detach();
    $bye.removeClass('tpl');

    // no games can be added by default
    $anchor = undefined;
    $nextanchor = $('#history > br.clear');
    $hanchor = $('#history > h2');

    setRound = function (round) {
      if (currentround === round) {
        return;
      }

      currentround = round;

      // update anchor and insert new header with current round
      $anchor = $nextanchor;
      $nextanchor = $header.clone();
      $nextanchor.find('span').text(currentround);
      $hanchor.after($nextanchor);
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
      $($spans[0]).text(result.t1 + 1);
      $($spans[1]).text(result.p1);
      $($spans[2]).text(result.p2);
      $($spans[3]).text(result.t2 + 1);

      // release the box to the DOM
      $anchor.before($tpl.clone());
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
    Tab_History.clear = function () {
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
      $nextanchor = $('#history > br.clear');
    };

    /**
     * removes and redraws all boxes from History
     */
    Tab_History.updateBoxes = function () {
      var round, maxround, id, numgames, bye;

      Tab_History.clear();

      maxround = History.numRounds();
      for (round = 1; round <= maxround; round += 1) {
        setRound(round);

        bye = History.getBye(round);
        if (bye !== undefined) {
          Tab_History.createBye(bye);
        }

        numgames = History.numGames(round);
        for (id = 0; id < numgames; id += 1) {
          Tab_History.createBox(History.get(round, id));
        }
      }
    };

  });

  return Tab_History;
});
