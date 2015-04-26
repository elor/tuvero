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
    playernameurl: '',
    minteamsize: 1,
    maxteamsize: 1,
    minpoints: 0,
    maxpoints: 8,
    byepointswon: 8,
    byepointslost: 6,
    // user-specific
    // local : {},
    dbname: 'tactournament',
    dbplayername: 'tacplayers',
    roundtries: 20,
    savefile: 'tac.json',
    csvfile: 'tac.csv',
    teamsizeicon: false
  // tournament-specific
  // tournament : {},
  };

  Options.setDefault(Default);
  Options.reset();

  return Options;
});
