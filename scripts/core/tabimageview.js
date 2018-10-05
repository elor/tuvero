/**
 * TabImageView:display the tab image
 *
 * @return TabImageView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "core/view"], function (extend, View) {
  /**
   * Constructor
   *
   * @param tabname
   *          the base name of the tab
   * @param model
   *          a ValueModel instance. The value will be appended to the base name
   *          to create the image descriptor
   * @param $view
   *          the associated view
   */
  function TabImageView(tabname, model, $view) {
    TabImageView.superconstructor.call(this, model, $view);

    this.tabname = tabname;

    this.update();
  }
  extend(TabImageView, View);

  /**
   * update the image to the given parameters
   */
  TabImageView.prototype.update = function () {
    this.$view.attr("data-img", this.tabname + this.model.get());
  };

  /**
   * Callback function for the associated ValueModel
   */
  TabImageView.prototype.onupdate = function () {
    this.update();
  };

  return TabImageView;
});
