/**
 * CorrectionController: initiate corrections
 *
 * FIXME update documentation comments (I know that I'll never do it)
 *
 * @return CorrectionController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', './matchview', 'core/matchmodel',
    'core/listener'], function(extend, Controller, MatchView, MatchModel,
    Listener) {
  /**
   * Constructor
   *
   * @param view
   *          a ListView instance with TeamView instances
   * @param $input
   *          a DOM element which contains all input stuff
   */
  function CorrectionController(view, $input, tournament) {
    var correctionController;
    CorrectionController.superconstructor.call(this, view);

    if (!$input) {
      console.error('$input is required for CorrectionController()');
      return;
    }

    this.tournament = tournament;

    this.$input = $input;
    this.$abort = $input.find('button.cancel');
    this.$points = this.$input.find('input.points');

    this.originalresult = undefined;
    this.matchmodel = new MatchModel();
    this.matchview = new MatchView(this.matchmodel, this.$input);

    correctionController = this;
    Listener.bind(this.matchmodel, 'finish', function(emitter, event, result) {
      correctionController.correct(result);
    });

    this.view.$view.on('click', '.result', this,
        CorrectionController.onResultClicked);

    this.hideInputField();
  }
  extend(CorrectionController, Controller);

  /**
   * Retrieve the MatchResult instance, which is associated with the $result
   * element
   *
   * This requires working knowledge of the TeamView structure. So be it.
   *
   * @param $result
   *          the DOM element which displays the player name
   * @return the associated PlayerModel instance
   */
  CorrectionController.prototype.getMatchResult = function($result) {
    var index, subview;

    index = this.view.indexOf($result);
    subview = this.view.getSubview(index);

    return subview.model;
  };

  /**
   * show the input field in place of a player name
   *
   * @param $result
   *          the DOM element which displays the player name
   */
  CorrectionController.prototype.showInputField = function($result) {
    this.hideInputField(true);

    this.originalresult = this.getMatchResult($result);

    if (this.originalresult.isBye()) {
      console.log('cannot correct a bye');
      return;
    }

    this.attachInputListeners();

    // set the score
    this.originalresult.score.forEach(function(score, index) {
      this.$points.eq(index).val(score);
    }, this);

    this.matchmodel.teams.splice(0);
    this.originalresult.teams.forEach(function(teamid) {
      this.matchmodel.teams.push(teamid);
    }, this);
    this.matchmodel.length = this.originalresult.length;
    this.matchmodel.id = this.originalresult.getID();
    this.matchmodel.group = this.originalresult.getGroup();

    $result.addClass('hideresult');
    $result.children().last().append(this.$input);

    this.$points.eq(0).focus();
  };

  /**
   * detach the input field from the DOM and change/reset the player name
   *
   * @param abort
   *          if true, the new player name will be discarded
   */
  CorrectionController.prototype.hideInputField = function(abort) {
    var $row;

    $row = this.$input.parents('.matchrow,.matchview');
    if ($row.length > 0) {
      this.detachInputListeners();
      this.$input.detach();
      $row.removeClass('hideresult');
    }
  };

  /**
   * attach blur and keydown listeners. This is required to avoid double-blurs,
   * where the browser sends a second blur event, if an element is detached
   * within a blur event. Keydown should be fine, but we'll do it anyways.
   */
  CorrectionController.prototype.attachInputListeners = function() {
    var correctionController = this;
    this.$input.keydown(this, CorrectionController.onInputKeydown);
    this.$abort.click(function(e) {
      correctionController.hideInputField(true);
      e.preventDefault();
      return false;
    });
  };

  /**
   * detach blur and keydown listeners. This is required to avoid double-blurs,
   * where the browser sends a second blur event, if an element is detached
   * within a blur event. Keydown should be fine, but we'll do it anyways.
   */
  CorrectionController.prototype.detachInputListeners = function() {
    this.$input.off('keydown');
    this.$abort.off('click');
  };

  /**
   * .name click callback function
   *
   * @param e
   *          jQuery Event object
   */
  CorrectionController.onResultClicked = function(e) {
    var controller;

    controller = e.data;
    controller.showInputField($(this).parents('.matchrow,.matchview'));
  };

  /**
   * escape or enter key: discard or keep name, respectively
   *
   * @param e
   *          jQuery Event object
   */
  CorrectionController.onInputKeydown = function(e) {
    var controller;

    controller = e.data;

    switch (e.which) {
    case 27:
      controller.hideInputField(true);
      // TODO prevent default?
      break;
    }
  };

  /**
   * @param result
   *          a MatchResult instance, as emitted by MatchModel's 'finish'
   *
   */
  CorrectionController.prototype.correct = function(result) {
    if (this.originalresult) {
      this.tournament.correct(this.originalresult, result.score);
    }
  };

  return CorrectionController;
});
