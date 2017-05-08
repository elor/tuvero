/**
 * SwissVotePropView
 *
 * @return SwissVotePropView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/classview', 'ui/swissvotepropcontroller'], function(
    extend, ClassView, SwissVotePropController) {
  /**
   * Constructor
   *
   * @param model
   *          a ValueModel instance, which has a boolean value
   * @param $view
   *          a '.swissvotes .prop' DOM element
   */
  function SwissVotePropView(model, $view) {
    SwissVotePropView.superconstructor.call(this, model, $view, undefined,
        'forbidden');

    this.controller = new SwissVotePropController(this);
  }
  extend(SwissVotePropView, ClassView);

  return SwissVotePropView;
});
