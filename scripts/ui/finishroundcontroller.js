/**
 * FinishRoundController
 *
 * @return FinishRoundController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'core/view', 'ui/state',
    'options'], function(extend, Controller, View, State, Options) {
  /**
   * Constructor
   */
  function FinishRoundController($button) {
    FinishRoundController.superconstructor.call(this, new View(undefined,
        $button));

    this.view.$view.click(this.finishRound.bind(this));
  }
  extend(FinishRoundController, Controller);

  /**
   *
   */
  FinishRoundController.prototype.finishRound = function() {
    State.tournaments.map(function(tournament) {
      var matches, finished;

      matches = tournament.getMatches();

      do {
        finished = true;

        matches.map(function(match) {
          if (match.isRunningMatch()) {
            match.finish(this.getScore(match.length));
            finished = false;
          }
        }, this);

      } while (!finished);
    }, this);
  };

  FinishRoundController.prototype.getScore = function() {
    return [Options.maxpoints, 0];
  };

  return FinishRoundController;
});
