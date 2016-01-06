/**
 * OptionsTemplate object, which contains options such as database keys, points, etc.
 *
 * @deprecated will be replaced with a new OptionsTemplateModel class or something
 *
 * @return OptionsTemplate
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['ui/optionstemplate'], function(OptionsTemplate) {
  var Default;

  Default = {
    // must stay the same across this save, hence OptionsTemplate, not Presets
    minpoints: 0,
    maxpoints: 8,
    byepointswon: 8,
    byepointslost: 6,
    defaultscore: 8,
    tiesforbidden: false,
    maxpointtiesforbidden: true
  };

  OptionsTemplate.setDefault(Default);
  OptionsTemplate.reset();

  return OptionsTemplate;
});
