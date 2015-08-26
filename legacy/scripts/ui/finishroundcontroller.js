/**
 * FinishRoundController
 *
 * @return FinishRoundController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'core/view', './state_new',
    './options'], function(extend, Controller, View, State, Options) {
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
      var matches = tournament.getMatches();
      while (matches.length > 0) {
        matches.get(0).finish(this.getScore(matches.get(0).length));
      }
    }, this);
  };

  FinishRoundController.prototype.getScore = function() {
    return [Options.maxpoints, 0];
  };

  return FinishRoundController;
});
