/**
 * RankingComponentView
 *
 * @return RankingComponentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "ui/textview", "ui/strings"], function (extend, TextView,
    Strings) {

  /**
   * Look for a prepared text representation within the Strings global object.
   *
   * @param text
   *          the key
   * @return if available, the string representation. if not, the key itself.
   */
  function getString(text) {
    return Strings["ranking_" + text] || text;
  }

  /**
   * Constructor
   *
   * @param name
   *          the name of the RankingComponent, e.g. "wins"
   * @param $view
   *          a JQuery object into which the component information is to be
   *          written
   */
  function RankingComponentView(name, $view) {
    RankingComponentView.superconstructor.call(this, name, $view);
  }
  extend(RankingComponentView, TextView);

  /**
   * set the "value" attribute to the text and read the displayed text from
   * Strings
   */
  RankingComponentView.prototype.update = function () {
    this.$view.val(this.model.text);
    this.$view.text(getString(this.model.text));
  };

  return RankingComponentView;
});
