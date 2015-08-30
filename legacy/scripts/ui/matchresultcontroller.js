/**
 * MatchResultController
 *
 * @return MatchResultController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', './strings', './toast', 'options'], //
function(extend, Controller, Strings, Toast, Options) {
  /**
   * Constructor
   */
  function MatchResultController(view, $correctionForm, tournament) {
    var controller;
    MatchResultController.superconstructor.call(this, view);

    if (this.model.isBye()) {
      return;
    }

    if (this.model.length != 2) {
      console.error('corrections corrently only works with two teams.');
      return;
    }

    this.tournament = tournament;

    this.$result = this.view.$view.find('.result');
    this.$correction = $correctionForm;
    this.$score = this.$correction.find('.score');
    this.$match = this.$result.parent();
    this.$match.append(this.$correction);

    this.$cancelbutton = this.$correction.find('button.cancel');
    this.$submitbutton = this.$correction.find('button.submit');

    this.$result.click(this.enableCorrection.bind(this));
    this.$cancelbutton.click(this.cancel.bind(this));
    this.$submitbutton.click(this.submit.bind(this));

    controller = this;
    this.$correction.keydown(function(e) {
      switch (e.which) {
      case 27: // escape
        controller.cancel();
        break;
      case 13: // enter
        controller.submit();
        break;
      default:
        return;
      }

      e.preventDefault();
      return false;
    });

    this.updateScore();
  }
  extend(MatchResultController, Controller);

  MatchResultController.prototype.updateScore = function() {
    this.$score.eq(0).val(this.model.score[0]);
    this.$score.eq(1).val(this.model.score[1]);
    this.$score.attr('max', Options.maxpoints);
    this.$score.attr('min', Options.minpoints);
  };

  MatchResultController.prototype.enableCorrection = function() {
    this.updateScore();
    this.$match.addClass('correcting');
    this.$score.eq(0).focus().select();
  };

  MatchResultController.prototype.disableCorrection = function() {
    this.$match.removeClass('correcting');
  };

  MatchResultController.prototype.cancel = function() {
    new Toast(Strings.pointchangeaborted);
    this.disableCorrection();
  };

  MatchResultController.prototype.submit = function() {
    var score;

    score = [Number(this.$score.eq(0).val()), Number(this.$score.eq(1).val())];
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
