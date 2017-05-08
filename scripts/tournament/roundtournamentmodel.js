/**
 * RoundTournamentModel
 *
 * @return RoundTournamentModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'tournament/tournamentmodel', 'core/matchmodel', 'core/byeresult',
    'options', 'core/type'], function(extend, TournamentModel, MatchModel,
    ByeResult, Options, Type) {
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
   * @return true on success, false otherwise
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
   * @return true on success, false otherwise
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
    var slideList, teamA, teamB, id;

    slideList = RoundTournamentModel.generateSlideList(this.teams.length,
        this.round);

    if (slideList.length % 2) {
      // TODO use a function to auto-create all bye conditions. DRY principle.
      if (this.round == slideList.length - 1) {
        teamB = slideList.shift();
      } else {
        teamB = slideList.pop();
      }
      id = slideList.length >> 1;

      this.addBye(teamB, id, this.round);
    }

    id = 0;

    while (slideList.length > 1) {
      teamA = slideList.shift();
      teamB = slideList.pop();

      this.matches.push(new MatchModel([teamA, teamB], id, this.round));

      id += 1;
    }
  };

  /**
   * @param numteams
   *          the number of teams
   * @param round
   *          the round, starting with 0.
   * @return an array of teams in a clockwise slide order, starting with the
   *         first team. Undefined on error.
   */
  RoundTournamentModel.generateSlideList = function(numteams, round) {
    var teams, slideteam;

    if (!Type.isNumber(numteams) || !Type.isNumber(round)) {
      return undefined;
    }

    if (round <= 0) {
      teams = [];
      while (teams.length < numteams) {
        teams.push(teams.length);
      }
      return teams;
    }

    teams = RoundTournamentModel.generateSlideList(numteams, round - 1);

    slideteam = teams.splice(numteams - 1, 1)[0];
    teams.splice(1, 0, slideteam);

    return teams;
  };

  /**
   *
   * @param matchresult
   *          Ignored.
   */
  RoundTournamentModel.prototype.postprocessMatch = function(matchresult) {
    if (this.matches.length === 0) {
      if (this.round === this.numRounds() - 1) {
        this.state.set('finished');
      }
    }
  };

  /**
   * @return the current or recently finished round. returns -1 if the
   *         tournament hasn't been started yet
   */
  RoundTournamentModel.prototype.getRound = function() {
    return this.round;
  };

  /**
   * @return the total number of rounds.
   */
  RoundTournamentModel.prototype.numRounds = function() {
    if (this.teams.length % 2) {
      // tournaments with odd teams take one round longer due to the byes
      return this.teams.length;
    }
    return this.teams.length - 1;
  };

  /**
   * write the round to the data object
   *
   * @return a serializable data object
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
   * @return true on success, false otherwise
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
