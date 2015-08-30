/**
 * MatchTableView
 *
 * @return MatchTableView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listview', 'core/listener'], function(extend,
    ListView, Listener) {
  /**
   * Constructor
   */
  function MatchTableView() {
    var $view = arguments[1];
    arguments[1] = $view.children('table');
    MatchTableView.superconstructor.apply(this, arguments);

    this.$round = $view.find('.round');

    this.updateGroupNumber();
  }
  extend(MatchTableView, ListView);

  MatchTableView.prototype.updateGroupNumber = function() {
    var view = this;

    if (this.model.length === 0) {
      this.groupListener = new Listener(this.model);
      this.groupListener.onresize = function(emitter, event, data) {
        view.updateGroupNumber();
        this.destroy();
      };
    } else {
      this.$round.text(Number(this.model.get(0).getGroup()) + 1);
    }
  };

  return MatchTableView;
});
