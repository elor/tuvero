import Model from '../core/model.js';

class RequireModsShortcut extends Model {
  constructor() {
    super();
    window.setTimeout(this.createModsObject.bind(this), 1);
  }

  // RequireJS module registry no longer exists in ESM; window.mods shortcuts unavailable
  createModsObject() {}
}

export default RequireModsShortcut;