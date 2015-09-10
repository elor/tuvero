/**
 * KOMatchResultView
 *
 * @return KOMatchResultView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './matchresultview', './koline', //
'core/kotournamentmodel'], function(extend, MatchResultView, KOLine,
    KOTournamentModel) {
  var leftPadding, topPadding, width, height;

  width = 17;
  height = 4;
  topPadding = -1.5;
  leftPadding = 1;

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
  function KOMatchResultView(model, $view, teamlist, tournament, showNames) {
    if ($view) {
      KOMatchResultView.superconstructor.call(this, model, $view, teamlist,
          tournament);
    } else {
      this.model = model;
    }

    this.id = this.model.getID();
    this.group = this.model.getGroup();
    this.round = KOTournamentModel.roundOfMatchID(this.id);
    this.isThirdPlace = (this.group & 0x1) === 1;
    this.firstid = KOTournamentModel.firstMatchIDOfRound(this.round);
    this.numTeams = tournament.getTeams().length;
    this.firstRound = Math.min(//
    KOTournamentModel.initialRoundForTeams(this.numTeams), //
    KOTournamentModel.roundsInGroup(this.group & ~0x1) - 1 //
    );

    console.log(this.firstRound)

    this.x = this.calcXPosition();
    this.y = this.calcYPosition();

    if (this.$view) {
      this.$view.css('left', this.x + 'em');
      this.$view.css('top', this.y + 'em');

      // TODO print the KOLine
      this.line = undefined;
    }
  }
  extend(KOMatchResultView, MatchResultView);

  KOMatchResultView.prototype.calcXPosition = function() {
    return leftPadding + (this.firstRound - this.round) * width;
  };

  KOMatchResultView.prototype.calcYPosition = function() {
    var y, yFactor;

    yFactor = Math.pow(2, this.firstRound - this.round - 1);

    // padding
    y = topPadding;

    // position of first match in this round
    y += height * yFactor;

    // offset from first match in this round
    y += height * 2 * yFactor * (this.id - this.firstid);

    // third place offset
    if (this.isThirdPlace) {
      y += height * 1.5;
    }

    return y;
  };

  KOMatchResultView.width = width;
  KOMatchResultView.height = height;
  KOMatchResultView.topPadding = topPadding;
  KOMatchResultView.leftPadding = leftPadding;

  return KOMatchResultView;
});
