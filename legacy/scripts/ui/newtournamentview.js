/**
 * NewTournamentView
 *
 * @return NewTournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view'], function(extend, View) {
  /**
   * Constructor
   */
  function NewTournamentView(model, $view) {
    NewTournamentView.superconstructor.call(this, model, $view);
  }
  extend(NewTournamentView, View);

  return NewTournamentView;
});
