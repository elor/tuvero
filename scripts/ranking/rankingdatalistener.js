import Listener from '../core/listener.js';

/**
 * Constructor.
 *
 * Subclasses are required to create "ranking.{NAME}" in the constructor
 *
 * @param ranking
 *          a RankingModel instance
 * @param fieldobject
 *          the object for the field this class is calculating
 */
class RankingDataListener extends Listener {
  constructor(ranking, fieldobject) {
    let Const;
    super();

    /**
     * This.constructor, on inherited classes, is NOT RankingDataListener, but
     * the constructor that was invoked by 'new'
     */
    Const = this.constructor;
    this.ranking = ranking;

    // resize and map the ranking field
    if (fieldobject.length !== ranking.length) {
      fieldobject.resize(ranking.length);
    }
    if (ranking[Const.NAME] !== undefined) {
      throw new Error('ranking field already exists: ' + Const.NAME);
    }
    ranking[Const.NAME] = fieldobject;
    this[Const.NAME] = fieldobject;

    // create dependency links
    if (Const.DEPENDENCIES) {
      Const.DEPENDENCIES.forEach(function (DEPNAME) {
        this[DEPNAME] = ranking[DEPNAME];
        if (this[DEPNAME] === undefined) {
          console.warn('ranking dependency not found: ' + DEPNAME);
        }
      }, this);
    }
    ranking.registerListener(this);
  }

  /**
   * detect whether this specific instance is a primary data listener, or is
   * only processing recalc events, i.e. processing data of other data listeners
   *
   * @return true if this listener contains primary data, false otherwise
   */
  isPrimary() {
    return this.onbye !== RankingDataListener.prototype.onbye || this.onresult !== RankingDataListener.prototype.onresult;
  }

  destroy() {
    super.destroy();
    delete this.ranking[this.constructor.NAME];
  }

  /**
   * insert the results of a game into the ranking.
   *
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param game
   *          a game result
   */
  onresult(r, e, game) {
    // do something to this.NAME, where NAME is the value of constructor.NAME
  }

  /**
   * inserts a bye into the ranking
   *
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param data
   *          object with team and round info: {teams:[0, 1], round: 0}
   */
  onbye(r, e, data) {
    // do something to this.NAME, where NAME is the value of constructor.NAME
  }

  /**
   * correct a ranking entry. Do not check whether it's valid. The
   * TournamentModel has to take care of that
   *
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param correction
   *          a game correction (CorrectionModel instance)
   */
  oncorrect(r, e, correction) {
    // do something to this.NAME, where NAME is the value of constructor.NAME
  }

  /**
   * calculate the field
   */
  onrecalc() {
    // do something to this.NAME, where NAME is the value of constructor.NAME
  }

  zero() {
    const data = this[this.constructor.NAME];
    if (data.fill) {
      data.fill(0);
    }
  }

  /**
   * reset the field
   */
  onreset() {
    this.zero();
  }

  /**
   * resize the contents
   *
   * @param ranking
   */
  onresize(ranking) {
    const dataobject = this[this.constructor.NAME];
    if (dataobject && dataobject.resize) {
      this[this.constructor.NAME].resize(ranking.length);
    }
  }

  /**
   * the name of the field, which is handled by this class, e.g. 'wins'
   */
  static NAME = 'undefined';

  /**
   * an array of dependencies, e.g. [ 'buchholz', 'games'] for finebuchholz
   */
  static DEPENDENCIES = [];
}

export default RankingDataListener;