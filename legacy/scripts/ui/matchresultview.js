/**
 * MatchResultView
 *
 * @return MatchResultView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './matchview', './matchresultcontroller'], function(
    extend, MatchView, MatchResultController) {
  /**
   * Constructor
   *
   * @param model
   *          a MatchResult instance
   * @param $view
   *          the container element
   * @param teamlist
   *          a ListModel of TeamModel instances
   * @param tournament
   *          a TournamentModel instance
   */
  function MatchResultView(model, $view, teamlist, tournament) {
    MatchResultView.superconstructor.call(this, model, $view, teamlist);

    this.$result = this.$view.find('.result');
    this.$scores = this.$result.find('.score');
    this.$correctionform = this.$view.find('.correct');

    if (this.model.isResult()) {
      if (this.model.isBye()) {
        this.$correctionform.remove();
        this.$correctionform = undefined;
      } else {
        if (tournament) {
          this.controller = new MatchResultController(this,
              this.$correctionform, tournament);
        }
      }
    } else {
      this.$result.remove();
      this.$result = undefined;
      this.$scores = undefined;
      this.$correctionform.remove();
      this.$correctionform = undefined;
    }

    this.updateScore();
  }
  extend(MatchResultView, MatchView);

  /**
   * display the score of the MatchResult
   */
  MatchResultView.prototype.updateScore = function() {
    if (this.model.isResult()) {
      this.model.score.forEach(function(score, index) {
        this.$scores.eq(index).text(score);
      }, this);
    }
  };

  return MatchResultView;
});
