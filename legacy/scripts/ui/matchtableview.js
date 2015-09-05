/**
 * MatchTableView
 *
 * @return MatchTableView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './listview', 'core/listener',
    'core/matchresult', './/matchresultview'], function(extend, View, ListView,
    Listener, MatchResult, MatchResultView) {
  /**
   * Constructor
   */
  function MatchTableView(model, $view, $rowtemplate, undefined, teamlist,
      $correction, tournament) {
    var $listview;
    MatchTableView.superconstructor.call(this, model, $view);

    $listview = this.$view.children('table');
    this.listView = new ListView(this.model, $listview, $rowtemplate,
        MatchResultView, teamlist, $correction, tournament);

    this.$round = this.$view.find('.round');

    this.updateRunningState();
    this.updateGroupNumber();
  }
  extend(MatchTableView, View);

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
      this.$view.addClass('running');
      this.$view.removeClass('finished');
    } else {
      this.$view.addClass('finished');
      this.$view.removeClass('running');
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

  MatchTableView.prototype.destroy = function() {
    this.listView.destroy();
  }

  return MatchTableView;
});
