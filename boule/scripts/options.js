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
    // must stay the same across this save, hence Options, not Presets
    minpoints: 0,
    maxpoints: 15,
    byepointswon: 13,
    byepointslost: 7,
    defaultscore: 0,
    tiesforbidden: true,
    maxpointtiesforbidden: true
  };

  Options.setDefault(Default);
  Options.reset();

  return Options;
});
