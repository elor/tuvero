import Model from '../core/model.js';
/**
 * remove extra white spaces from a player name
 *
 * @param name
 *          the name
 * @return a trimmed version of the name
 */
function trimName(name) {
  return name.trim().replace(/\s+/g, ' ');
}

/**
 * Constructor
 *
 * @param name
 *          the player name
 */
class PlayerModel extends Model {
  constructor(name) {
    super();
    this.club = '';
    this.email = '';
    this.license = '';
    this.firstname = '';
    this.lastname = '';
    this.elo = 0;
    this.rankingpoints = 0;
    this.alias = PlayerModel.NONAME;
    this.setName(name);
  }

  /**
   * retrieve a copy of the player name
   *
   * @return a copy of the player name
   */
  getName() {
    return this.alias.slice(0);
  }

  /**
   * change the player name. Invalid player names (empty or whitespace only)
   * will be ignored
   *
   * @param name
   *          the new name
   */
  setName(alias) {
    alias = trimName(alias || '');
    if (!alias) {
      alias = trimName(this.firstname + ' ' + this.lastname);
    }
    if (alias && alias !== this.alias) {
      this.alias = alias;
      this.emit('update');
    }
  }

  /**
   * prepares a serializable data object, which can later be used for restoring
   * the current state using the restore() function
   *
   * @return a serializable data object, which can be used for restoring
   */
  save() {
    const data = super.save();
    data.n = this.getName();
    if (this.club) {
      data.club = this.club;
    }
    if (this.email) {
      data.email = this.email;
    }
    if (this.license) {
      data.license = this.license;
    }
    if (this.firstname) {
      data.firstname = this.firstname;
    }
    if (this.lastname) {
      data.lastname = this.lastname;
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
    this.setName(data.n);
    if (data.club) {
      this.club = data.club;
    }
    if (data.email) {
      this.email = data.email;
    }
    if (data.license) {
      this.license = data.license;
    }
    if (data.firstname) {
      this.firstname = data.firstname;
    }
    if (data.lastname) {
      this.lastname = data.lastname;
    }
    if (data.lastname) {
      this.elo = Number(data.elo);
    }
    if (data.rankingpoints) {
      this.rankingpoints = Number(data.rankingpoints);
    }
    return true;
  }

  static NONAME = 'noname';
}

PlayerModel.prototype.SAVEFORMAT = Object.create(Model.prototype.SAVEFORMAT);
PlayerModel.prototype.SAVEFORMAT.n = String;

export default PlayerModel;