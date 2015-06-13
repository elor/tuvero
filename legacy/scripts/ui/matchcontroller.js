/**
 * Controller for finishing a Match
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/controller', 'options'], function(extend,
    Controller, Options) {
  /**
   * Constructor
   *
   * @param view
   *          the associated MatchView
   */
  function MatchController(view) {
    MatchController.superconstructor.call(this, view);

    this.initNumberValidation();
    this.initFinishButton();
  }
  extend(MatchController, Controller);

  MatchController.prototype.initNumberValidation = function() {
    this.view.$view.find('.points').change(function() {
      var $this, value, valid;

      valid = true;

      $this = $(this);
      value = Number($this.val());

      if (isNaN(value)) {
        valid = false;
      }
      if (value < Options.minpoints) {
        valid = false;
      }
      if (value > Options.maxpoints) {
        valid = false;
      }

      if (valid) {
        $this.removeClass('invalid');
      } else {
        $this.addClass('invalid');
      }
    }).attr("min", Options.minpoints).attr("max", Options.maxpoints);
  };

  MatchController.prototype.initFinishButton = function() {
    this.view.$view.find('.finish').click(this.finish.bind(this));
  };

  MatchController.prototype.finish = function() {
    var points;

    points = [];

    this.view.$view.find('.points').each(function(i) {
      points[i] = Number($(this).val());
    });

    this.model.finish(points);
  };

  return MatchController;
});
