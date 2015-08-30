/**
 * MatchTableView
 *
 * @return MatchTableView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listview', 'core/listener', 'core/matchresult'], //
function(extend, ListView, Listener, MatchResult) {
  /**
   * Constructor
   */
  function MatchTableView() {
    var $container = arguments[1];
    arguments[1] = $container.children('table');
    MatchTableView.superconstructor.apply(this, arguments);

    this.$container = $container;

    this.$round = this.$container.find('.round');

    this.updateRunningState();
    this.updateGroupNumber();
  }
  extend(MatchTableView, ListView);

  /**
   * print the group ID as soon as it's available
   */
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

  MatchTableView.prototype.updateRunningState = function() {
    var i, isRunning;

    isRunning = false;
    for (i = 0; i < this.model.length; i += 1) {
      if (!this.model.get(i).isResult()) {
        isRunning = true;
        break;
      }
    }

    if (isRunning) {
      this.$container.addClass('running');
      this.$container.removeClass('finished');
    } else {
      this.$container.addClass('finished');
      this.$container.removeClass('running');
    }

  };

  /**
   * callback function, which gets called by insert and remove
   *
   * @param emitter
   * @param event
   * @param data
   */
  MatchTableView.prototype.onresize = function(emitter, event, data) {
    this.updateRunningState();
  }

  return MatchTableView;
});
