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
   */
  function MatchResultView(model, $view, teamlist, $correctionForm, //
  tournament) {
    MatchResultView.superconstructor.call(this, model, $view, teamlist);

    this.$results = this.$view.find('.result');
    this.$scores = this.$results.find('.score');

    this.updateScore();

    if ($correctionForm && tournament && this.model.isResult()) {
      this.controller = new MatchResultController(this,
          $correctionForm.clone(), tournament);
    }
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
