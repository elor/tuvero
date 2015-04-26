/**
 * Options object, which contains options such as database keys, points, etc.
 *
 * @deprecated will be replaced with a new OptionsModel class or something
 *
 * @return Options
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['ui/options'], function(Options) {
  var Default;

  Default = {
    // installation-specific
    // global : {},
    playernameurl: 'https://boulesdb.appspot.com/json',
    maxteamsize: 3,
    minpoints: 0,
    maxpoints: 15,
    byepointswon: 13,
    byepointslost: 7,
    // user-specific
    // local : {},
    dbname: 'boulestournament',
    dbplayername: 'bouleplayers',
    roundtries: 20
  // tournament-specific
  // tournament : {},
  };

  Options.setDefault(Default);
  Options.reset();

  return Options;
});
