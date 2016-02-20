/**
 * TabRankingCheapHackListener: manage Tab_New visibility and update when a new
 * player has been added
 *
 * @return TabRankingCheapHackListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/listener', 'ui/state', '../tabshandle'//
], function(extend, Listener, State, TabsHandle) {

  /**
   * Constructor
   */
  function TabRankingCheapHackListener() {
    TabRankingCheapHackListener.superconstructor.call(this);

    State.tournaments.registerListener(this);

    this.update();
  }
  extend(TabRankingCheapHackListener, Listener);

  /**
   * show/hide the tab and update it as necessary
   */
  TabRankingCheapHackListener.prototype.update = function() {
    var i, isRunning;

    isRunning = false;

    for (i = 0; !isRunning && i < State.tournaments.length; i += 1) {
      isRunning = State.tournaments.get(i).getState().get() !== 'initial';
    }

    if (isRunning) {
      TabsHandle.show('ranking');
    } else {
      TabsHandle.hide('ranking');
    }
  };

  /**
   * a tournament state has been changed
   *
   * @param emitter
   * @param event
   * @param data
   */
  TabRankingCheapHackListener.prototype.onupdate = function(emitter, event, //
  data) {
    if (emitter !== State.tournaments) {
      this.update();
    }
  };

  /**
   * a tournament has been added
   *
   * @param emitter
   * @param event
   * @param data
   */
  TabRankingCheapHackListener.prototype.oninsert = function(emitter, event, //
  data) {
    data.object.getState().registerListener(this);
    this.update();
  };

  /**
   * a tournament has been removed
   *
   * @param emitter
   * @param event
   * @param data
   */
  TabRankingCheapHackListener.prototype.onremove = function(emitter, event, //
  data) {
    data.object.getState().unregisterListener(this);
    this.update();
  };

  TabRankingCheapHackListener.instance = new TabRankingCheapHackListener();

  return TabRankingCheapHackListener;
});
