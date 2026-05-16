/**
 * Create a StateModel singleton
 *
 * Note to self: Avoid DOM manipulations at all costs!
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import ServerModel from './servermodel.js';
import Storage from './storage.js';
import Presets from 'presets';
var Server;
Server = Storage.register(Presets.names.apitoken, ServerModel);
export default Server;