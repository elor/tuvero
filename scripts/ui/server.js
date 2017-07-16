/**
 * Create a StateModel singleton
 *
 * Note to self: Avoid DOM manipulations at all costs!
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['ui/ServerModel', 'ui/storage', 'presets'], function (ServerModel, Storage, Presets) {
  var Server;

  Server = Storage.register(Presets.names.apitoken, ServerModel);

  return Server;
});
