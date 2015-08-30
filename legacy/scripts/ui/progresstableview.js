/**
 * ProgressTableView
 *
 * @return ProgressTableView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view'], function(extend, View) {
  /**
   * Constructor
   */
  function ProgressTableView(model, $view) {
    ProgressTableView.superconstructor.call(this, model, $view);
  }
  extend(ProgressTableView, View);

  return ProgressTableView;
});
