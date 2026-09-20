/**
 * Supermêlée: teams are drawn fresh every round, the standings count
 * players.
 *
 * Two id spaces meet here. The tournament's *teams* are the
 * registered players — that is what `this.teams` holds, what the
 * ranking is sized by, and what a rank belongs to. The *matches*, on
 * the other hand, are played by line-ups: ad-hoc doublettes or
 * triplettes drawn for one round, stored in `this.lineups` and
 * referenced by their index.
 *
 * Everything that crosses between the two spaces is in one of three
 * places: applyResult()/recalculateRanking() translate a line-up
 * result into one result per player, getMatches()/getHistory() hand
 * out line-up ids unmapped (the view resolves them, see
 * getDisplayTeams()), and drawHistory() reads the played rounds back
 * out for the next draw.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import TournamentModel from './tournamentmodel.js'
import MatchModel from '../core/matchmodel.js'
import MatchResult from '../core/matchresult.js'
import MatchReferenceModel from '../core/matchreferencemodel.js'
import ResultReferenceModel from '../core/resultreferencemodel.js'
import ReferenceListModel from '../list/referencelistmodel.js'
import SortedReferenceListModel from '../list/sortedreferencelistmodel.js'
import CombinedReferenceListModel from '../list/combinedreferencelistmodel.js'
import { drawRound } from './meleedraw.js'
import Presets from 'presets'

const DEFAULTTEAMSIZE = 2

class MeleeTournamentModel extends TournamentModel {
  /**
   * @param rankingorder
   *          an array of ranking component names
   */
  constructor (rankingorder) {
    super(rankingorder)
    this.round = -1

    /**
     * every drawn line-up, in draw order. A match references two of
     * them by index, so this list only ever grows.
     */
    this.lineups = []

    this.setProperty('meleeteamsize',
      (Presets.systems.melee && Presets.systems.melee.teamsize) || DEFAULTTEAMSIZE)
  }

  /**
   * @return the line-up with the given index: an array of internal
   *         player ids
   */
  getLineup (lineupid) {
    return this.lineups[lineupid]
  }

  /**
   * @return the current round, or -1 before the first draw
   */
  getRound () {
    return this.round
  }

  initialMatches () {
    return this.drawNextRound()
  }

  idleMatches () {
    return this.drawNextRound()
  }

  /**
   * Draw the next round: compose line-ups, pair them up and send the
   * leftover players to the bench.
   *
   * @return true on success, false if no full match can be drawn
   */
  drawNextRound () {
    const teamsize = this.getProperty('meleeteamsize')
    const players = this.teams.map(function (globalid, internalid) {
      return internalid
    })
    const draw = drawRound(players, this.drawHistory(), { teamsize })
    if (draw.matches.length === 0) {
      this.emit('error', 'melee: not enough players for a single match')
      return false
    }

    this.round += 1
    const offset = this.lineups.length
    draw.lineups.forEach(function (lineup) {
      this.lineups.push(lineup.slice(0))
    }, this)
    draw.matches.forEach(function (pairing, matchid) {
      this.matches.push(new MatchModel(
        [offset + pairing[0], offset + pairing[1]], matchid, this.round))
    }, this)
    draw.byes.forEach(function (playerid, index) {
      this.addBye(playerid, draw.matches.length + index, this.round)
    }, this)

    this.ranking.invalidate()
    this.emit('update')
    return true
  }

  /**
   * Read the played rounds back out for the next draw.
   *
   * @return the three accessors drawRound() expects
   */
  drawHistory () {
    const partners = {}
    const opponents = {}
    const byes = {}

    function count (table, a, b) {
      const key = a + ':' + b
      table[key] = (table[key] || 0) + 1
    }

    this.history.forEach(function (result) {
      if (result.isBye && result.isBye()) {
        const playerid = result.getTeamID(0)
        byes[playerid] = (byes[playerid] || 0) + 1
        return
      }
      const sides = [
        this.getLineup(result.getTeamID(0)) || [],
        this.getLineup(result.getTeamID(1)) || []
      ]
      sides.forEach(function (lineup, side) {
        lineup.forEach(function (playerid, index) {
          lineup.slice(index + 1).forEach(function (partnerid) {
            count(partners, playerid, partnerid)
            count(partners, partnerid, playerid)
          })
          sides[1 - side].forEach(function (opponentid) {
            count(opponents, playerid, opponentid)
          })
        })
      })
    }, this)

    return {
      partners: function (a, b) {
        return partners[a + ':' + b] || 0
      },
      opponents: function (a, b) {
        return opponents[a + ':' + b] || 0
      },
      byes: function (playerid) {
        return byes[playerid] || 0
      }
    }
  }

  /**
   * Translate a line-up result into one result per player.
   *
   * Line-ups of a match always have the same size, so pairing the
   * players by position gives every one of them exactly one game
   * with the correct score — which is what the wins, points, saldo
   * and numgames listeners count.
   *
   * @param matchresult
   *          a MatchResult between two line-ups
   * @return an array of MatchResult instances between players
   */
  expandResult (matchresult) {
    const home = this.getLineup(matchresult.getTeamID(0)) || []
    const guest = this.getLineup(matchresult.getTeamID(1)) || []
    return home.map(function (playerid, index) {
      const match = new MatchModel([playerid, guest[index]],
        matchresult.getID(), matchresult.getGroup())
      return new MatchResult(match, matchresult.score.slice(0))
    })
  }

  /**
   * @return the history with every line-up result expanded into
   *         player results. Byes already are player results.
   */
  expandHistory () {
    const expanded = []
    this.history.forEach(function (result) {
      if (result.isBye && result.isBye()) {
        expanded.push(result)
      } else {
        expanded.push(...this.expandResult(result))
      }
    }, this)
    return expanded
  }

  applyResult (matchresult) {
    this.expandResult(matchresult).forEach(function (playerresult) {
      this.ranking.result(playerresult)
    }, this)
  }

  /**
   * A correction arrives with line-up ids, which the ranking
   * listeners cannot use. Replaying the whole history is cheap at
   * mêlée scale and keeps the two id spaces from leaking into the
   * ranking.
   */
  applyCorrection (correction) {
    this.recalculateRanking()
  }

  postprocessCorrection (correction) {
    this.recalculateRanking()
  }

  recalculateRanking () {
    this.ranking.recalculate(this.expandHistory(), this.totalvotes)
  }

  verifyRanking () {
    const rankingcopy = this.ranking.clone()
    rankingcopy.recalculate(this.expandHistory(), this.totalvotes)
    return JSON.stringify(this.ranking.get()) === JSON.stringify(rankingcopy.get())
  }

  /*
   * The three list getters below hand out matches with *line-up*
   * ids. The base class maps internal ids to global team ids here,
   * which would be wrong twice over: a match side is not a player,
   * and the view resolves line-ups through getDisplayTeams().
   */
  getMatches () {
    if (this.singletons.matches === undefined) {
      this.singletons.matches = new ReferenceListModel(
        new SortedReferenceListModel(this.matches, TournamentModel.matchCompare),
        undefined, MatchReferenceModel)
    }
    return this.singletons.matches
  }

  getHistory () {
    if (this.singletons.history === undefined) {
      this.singletons.history = new ReferenceListModel(
        new SortedReferenceListModel(this.history, TournamentModel.matchCompare),
        undefined, ResultReferenceModel)
    }
    return this.singletons.history
  }

  getCombinedHistory () {
    if (this.singletons.combinedHistory === undefined) {
      this.singletons.combinedRawHistory =
        new CombinedReferenceListModel(this.matches, this.history)
      this.singletons.sortedCombinedRawHistory = new SortedReferenceListModel(
        this.singletons.combinedRawHistory, TournamentModel.matchCompare)
      this.singletons.combinedHistory = new ReferenceListModel(
        this.singletons.sortedCombinedRawHistory, undefined, ResultReferenceModel)
    }
    return this.singletons.combinedHistory
  }

  save () {
    const data = super.save()
    data.round = this.round
    data.lineups = this.lineups.map(function (lineup) {
      return lineup.slice(0)
    })
    return data
  }

  restore (data) {
    if (!super.restore(data)) {
      return false
    }
    this.round = data.round
    this.lineups = data.lineups.map(function (lineup) {
      return lineup.slice(0)
    })
    return true
  }
}

MeleeTournamentModel.prototype.SYSTEM = 'melee'
MeleeTournamentModel.prototype.RANKINGDEPENDENCIES = []

MeleeTournamentModel.prototype.SAVEFORMAT =
  Object.create(TournamentModel.prototype.SAVEFORMAT)
MeleeTournamentModel.prototype.SAVEFORMAT.round = Number
MeleeTournamentModel.prototype.SAVEFORMAT.lineups = [[Number]]

export default MeleeTournamentModel
