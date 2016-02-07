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

define(['ui/optionstemplate'], function(OptionsTemplate) {
  var Default;

  Default = {
    // must stay the same across this save, hence OptionsTemplate, not Presets
    minpoints: -999,
    maxpoints: 999,
    byepointswon: 1,
    byepointslost: 0,
    defaultscore: 0,
    tiesforbidden: false,
    maxpointtiesforbidden: true
  };

  OptionsTemplate.setDefault(Default);
  OptionsTemplate.reset();

  return OptionsTemplate;
});
