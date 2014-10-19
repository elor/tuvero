/**
 * wrapper around the backend options interface, to minimize confusion between
 * them and the ./options object.
 * 
 * TODO rename to further reduce naming confusion
 * 
 * @exports Opts
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ '../backend/options' ], function (Options) {
  var Opts;
  Opts = Options;
  return Opts;
});
