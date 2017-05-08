/**
 * MatchResultController
 *
 * @return MatchResultController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/matchcontroller', 'ui/strings', 'ui/toast', 'options'], //
function(extend, MatchController, Strings, Toast, Options) {
  /**
   * Constructor
   */
  function MatchResultController(view, $form, tournament) {
    MatchResultController.superconstructor.call(this, view, $form);

    if (this.model.length != 2) {
      console.error('corrections corrently only works with two teams.');
      return;
    }

    this.tournament = tournament;

    this.$match = this.$form.parents('.match').eq(0);
    this.$result = this.view.$result;

    this.$result.click(this.enableCorrection.bind(this));

    this.updateScore();
  }
  extend(MatchResultController, MatchController);

  MatchResultController.prototype.updateScore = function() {
    this.$scores.eq(0).val(this.model.score[0]);
    this.$scores.eq(1).val(this.model.score[1]);
    this.$scores.attr('max', Options.maxpoints);
    this.$scores.attr('min', Options.minpoints);
  };

  MatchResultController.prototype.enableCorrection = function() {
    this.updateScore();
    this.$match.addClass('correcting');
    this.$scores.eq(0).click();
  };

  MatchResultController.prototype.disableCorrection = function() {
    this.$match.removeClass('correcting');
  };

  MatchResultController.prototype.cancel = function() {
    new Toast(Strings.pointchangeaborted);
    this.disableCorrection();
  };

  MatchResultController.prototype.accept = function() {
    var score;

    score = [];
    score.push(Number(this.$scores.eq(0).val()));
    score.push(Number(this.$scores.eq(1).val()));

    if (isNaN(score[0]) || isNaN(score[1])) {
      return;
    } else if (score[0] < Options.minpoints || score[1] < Options.minpoints) {
      return;
    } else if (score[0] > Options.maxpoints || score[1] > Options.maxpoints) {
      return;
    } else if (score[0] === this.model.score[0]
        && score[1] === this.model.score[1]) {
      return;
    }

    this.tournament.correct(this.model, score);

    new Toast(Strings.pointchangeapplied);
    this.disableCorrection();
  };

  return MatchResultController;
});
