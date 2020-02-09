/**
 * Options object, which contains options such as database keys, points, etc.
 *
 * @deprecated will be replaced with a new OptionsModel class or something
 *
 * @return OptionsTemplate
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(['ui/optionstemplate'], function (OptionsTemplate) {
  var Default

  Default = {
    // must stay the same across this save, hence OptionsTemplate, not Presets
    minpoints: 0,
    maxpoints: 15,
    byepointswon: 13,
    byepointslost: 7,
    defaultscore: 0,
    tiesforbidden: false,
    maxpointtiesforbidden: true,
    formulexbyescore: [13, 12],
    formulexpoints: 100
  }

  OptionsTemplate.setDefault(Default)
  OptionsTemplate.reset()

  return OptionsTemplate
})
