/**
 * Controller for finishing a Match
 *
 * TODO use ValueModel events to communicate the values, not jquery events
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

    this.$form = this.view.$view.find('form.finish');
    this.$submitbutton = this.$form.find('button');
    this.$points = this.$form.find('.points');

    this.initNumberValidation();
    this.initFormSubmission();

    this.updateSubmitButtonStatus();
  }
  extend(MatchController, Controller);

  MatchController.prototype.initNumberValidation = function() {
    var controller = this;

    // select the whole input field on focus. make id DAU-safe.
    this.$points.click(function() {
      $(this).select();
    });

    // We're using keyup to check the values as the user types, not only when
    // the focus is lost or the value is changed incrementally
    this.$points.on('change keyup', function() {
      var $this, value, valid;

      valid = true;

      $this = $(this);
      value = Number();

      value = $this.val();

      if (value.length === 0) {
        valid = false;
      } else {
        value = Number(value);

        if (isNaN(value)) {
          valid = false;
        } else if (value < Options.minpoints) {
          valid = false;
        } else if (value > Options.maxpoints) {
          valid = false;
        }
      }

      if (valid) {
        $this.removeClass('invalid');
      } else {
        $this.addClass('invalid');
      }

      controller.updateSubmitButtonStatus();
    }).attr('min', Options.minpoints).attr('max', Options.maxpoints);
  };

  MatchController.prototype.initFormSubmission = function() {
    var controller = this;

    this.$form.submit(function(e) {

      e.preventDefault();
      controller.finish();
      return false;
    });
  };

  MatchController.prototype.updateSubmitButtonStatus = function() {
    var valid, tie, firstpoints, maxpoints;

    valid = this.$points.filter('.invalid').length === 0;

    if (valid && (Options.tiesforbidden || Options.maxpointtiesforbidden)) {
      tie = true;
      firstpoints = undefined;

      this.$points.each(function() {
        var points = Number($(this).val());
        if (firstpoints === undefined) {
          firstpoints = points;
        }
        if (points !== firstpoints) {
          tie = false;
        }
      });

      if (tie && Options.tiesforbidden) {
        valid = false;
      }

      maxpoints = (Number(this.$points.eq(0).val()) == Options.maxpoints);
      if (tie && maxpoints && Options.maxpointtiesforbidden) {
        valid = false;
      }
    }

    this.$submitbutton.prop('disabled', !valid);
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
