/**
 * RoundTournamentModel
 *
 * @return RoundTournamentModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './tournamentmodel', './matchmodel'], function(extend,
    TournamentModel, MatchModel) {
  /**
   * Constructor
   *
   * @param rankingorder
   *          the order of the ranking
   */
  function RoundTournamentModel(rankingorder) {
    RoundTournamentModel.superconstructor.call(this, rankingorder);

    this.round = -1;
  }
  extend(RoundTournamentModel, TournamentModel);

  RoundTournamentModel.prototype.SYSTEM = 'round';

  /**
   * create all matches during the initial->running transition
   *
   * @returns true on success, false otherwise
   */
  RoundTournamentModel.prototype.initialMatches = function() {
    this.round = 0;

    if (this.teams.length < 2) {
      return false;
    }

    RoundTournamentModel.generateSlideSystemMatches.call(this);

    return true;
  };

  /**
   * create all matches during the idle->running transition
   *
   * @returns true on success, false otherwise
   */
  RoundTournamentModel.prototype.idleMatches = function() {
    this.round += 1;

    RoundTournamentModel.generateSlideSystemMatches.call(this);

    return true;
  };

  /**
   * use the slide system to generate a roundtournament. "this" is required to
   * be a RoundTournamentModel instance.
   */
  RoundTournamentModel.generateSlideSystemMatches = function() {
    var list1, list2, numTeams, numGames, i, start, stop;

    numTeams = this.teams.length;
    numGames = numTeams >> 1;

    if (numTeams % 2) {
      this.votes.bye.push(numTeams - this.round - 1);
    }

    list1 = [];
    list2 = [];

    start = numTeams - this.round;
    stop = numTeams - this.round + numGames;
    for (i = start; i < stop; i += 1) {
      list1.push(i % numTeams);
      list2.push((i + numGames) % numTeams);
    }
    list2.reverse();

    for (i = 0; i < numGames; i += 1) {
      this.matches.push(new MatchModel([list1[i], list2[i]], i, this.round));
    }
  };

  /**
   *
   * @param matchresult
   *          Ignored.
   */
  RoundTournamentModel.prototype.postprocessMatch = function(matchresult) {
    if (this.matches.length === 0) {
      if (this.round === this.teams.length - 1) {
        this.state.set('finished');
      }
    }
  };

  /**
   * write the round to the data object
   *
   * @returns a serializable data object
   */
  RoundTournamentModel.prototype.save = function() {
    var data = RoundTournamentModel.superclass.save.call(this);
    data.round = this.round;
    return data;
  };

  /**
   * restore the state form a data object, including this.round
   *
   * @param data
   *          a deserialized data object
   * @returns true on success, false otherwise
   */
  RoundTournamentModel.prototype.restore = function(data) {
    if (!RoundTournamentModel.superclass.restore.call(this, data)) {
      return false;
    }
    this.round = data.round;
    return true;
  };

  /**
   * add "round" to the data object
   */
  RoundTournamentModel.prototype.SAVEFORMAT = Object
      .create(RoundTournamentModel.superclass.SAVEFORMAT);
  RoundTournamentModel.prototype.SAVEFORMAT.round = Number;

  return RoundTournamentModel;
});
