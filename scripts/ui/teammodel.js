import IndexedModel from '../list/indexedmodel.js';
import PlayerModel from './playermodel.js';
import Type from '../core/type.js';

/**
 * Constructor
 *
 * @param players
 *          an array of PlayerModel instances
 * @param id
 *          a preferably unique numeric team id
 */
class TeamModel extends IndexedModel {
  constructor(players, id) {
    super(id);
    this.number = '';
    this.alias = '';
    this.club = '';
    this.email = '';
    this.elo = 0;
    this.rankingpoints = 0;
    this.players = [];
    this.setPlayers(players);
  }

  /**
   * retrieve a single player. For the number of players, see
   * TeamModel.prototype.length
   *
   * @param id
   *          the index of the player inside the team
   * @return a PlayerModel reference
   */
  getPlayer(id) {
    if (id >= 0 && id < this.length) {
      return this.players[id];
    }
    return undefined;
  }

  /**
   * DO NOT USE DIRECTLY (why not?)
   *
   * @param players
   *          an array of PlayerModel instances
   */
  setPlayers(players) {
    players = players || [];
    if (players.length === 0) {
      players.push(new PlayerModel());
    }
    this.length = players.length;
    this.players = players.slice(0);
    this.players.forEach(function (player) {
      player.registerListener(this);
    }, this);
  }

  getNames() {
    return this.players.map(function (player) {
      return player.getName();
    });
  }

  getName() {
    let name = this.alias;
    if (this.getID() === undefined || this.getID() === '') {
      return '';
    }
    if (name) {
      return name;
    }
    name = 'Team ' + this.getNumber();
    return name;
  }

  setName(alias) {
    function trimName(name) {
      return name.trim().replace(/\s+/g, ' ');
    }
    alias = trimName(alias || '');
    if (alias !== this.alias) {
      this.alias = alias;
      this.emit('update');
    }
  }

  getNumber() {
    let number = this.number;
    if (number) {
      return number;
    }
    number = this.getID();
    if (Type.isNumber(number)) {
      return number + 1;
    }
    return number;
  }

  /**
   * Callback listener
   *
   * One of the player names was updated. This is passed through to the team
   * event emitter.
   *
   * @param emitter
   *          a PlayerModel instance
   * @param event
   *          the event type
   *
   */
  onupdate(emitter, event) {
    let data;
    data = {
      id: this.players.indexOf(emitter)
    };
    this.emit('update', data);
  }

  // TeamModel.prototype.SAVEFORMAT.number = String;
  // TeamModel.prototype.SAVEFORMAT.alias = String;
  // TeamModel.prototype.SAVEFORMAT.club = String;
  // TeamModel.prototype.SAVEFORMAT.email = String;
  // TeamModel.prototype.SAVEFORMAT.elo = Number;
  // TeamModel.prototype.SAVEFORMAT.rankingpoints = Number;

  updateRankingPointSum() {
    this.rankingpoints = this.players.map(function (player) {
      return player.rankingpoints;
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
    this.emit('update');
  }

  /**
   * prepares a serializable data object, which can later be used for restoring
   * the current state using the restore() function
   *
   * @return a serializable data object, which can be used for restoring
   */
  save() {
    const data = super.save();
    data.p = this.players.map(function (player) {
      return player.save();
    });
    if (this.number) {
      data.number = this.number;
    }
    if (this.alias) {
      data.alias = this.alias;
    }
    if (this.club) {
      data.club = this.club;
    }
    if (this.email) {
      data.email = this.email;
    }
    if (this.elo) {
      data.elo = this.elo;
    }
    if (this.rankingpoints) {
      data.rankingpoints = this.rankingpoints;
    }
    return data;
  }

  /**
   * restore a previously saved state from a serializable data object
   *
   * @param data
   *          a data object, that was previously written by save()
   * @return true on success, false otherwise
   */
  restore(data) {
    if (!super.restore(data)) {
      return false;
    }
    this.setPlayers(data.p.map(function (player) {
      const p = new PlayerModel();
      p.restore(player);
      return p;
    }));
    if (data.number) {
      this.number = data.number;
    }
    if (data.alias) {
      this.alias = data.alias;
    }
    if (data.club) {
      this.club = data.club;
    }
    if (data.email) {
      this.email = data.email;
    }
    if (data.elo) {
      this.elo = Number(data.elo);
    }
    if (data.rankingpoints) {
      this.rankingpoints = Number(data.rankingpoints);
    }
    return true;
  }
}

/**
 * .length represents the size of the team
 */
TeamModel.prototype.length = 0;

TeamModel.prototype.SAVEFORMAT = Object.create(IndexedModel.prototype.SAVEFORMAT);
TeamModel.prototype.SAVEFORMAT.p = [Object];
export default TeamModel;