/**
 * RequireModsShortcut
 *
 * @return RequireModsShortcut
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import Model from '../core/model.js';
function RequireModsShortcut() {
  RequireModsShortcut.superconstructor.call(this);
  window.setTimeout(this.createModsObject.bind(this), 1);
}
extend(RequireModsShortcut, Model);
// RequireJS module registry no longer exists in ESM; window.mods shortcuts unavailable
RequireModsShortcut.prototype.createModsObject = function () {};
export default RequireModsShortcut;