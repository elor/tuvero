/**
 * TabHistoryCheapHackListener: manage Tab_New visibility and update when a new
 * player has been added
 *
 * @return TabHistoryCheapHackListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/listener', '../state_new', '../tabshandle'//
], function(extend, Listener, State, Tabshandle) {

  /**
   * Constructor
   */
  function TabHistoryCheapHackListener() {
    TabHistoryCheapHackListener.superconstructor.call(this);

    State.tournaments.registerListener(this);

    this.update();
  }
  extend(TabHistoryCheapHackListener, Listener);

  /**
   * show/hide the tab and update it as necessary
   */
  TabHistoryCheapHackListener.prototype.update = function() {
    var i, hasHistory;

    hasHistory = false;

    for (i = 0; !hasHistory && i < State.tournaments.length; i += 1) {
      hasHistory = State.tournaments.get(i).getCombinedHistory().length > 0;

      if (hasHistory) {
        break;
      }
    }

    if (hasHistory) {
      Tabshandle.show('history');
    } else {
      Tabshandle.hide('history');
    }
  };

  /**
   * a tournament state has been changed
   *
   * @param emitter
   * @param event
   * @param data
   */
  TabHistoryCheapHackListener.prototype.onresize = function(emitter, event, //
  data) {
    this.update();
  };

  /**
   * a tournament has been added
   *
   * @param emitter
   * @param event
   * @param data
   */
  TabHistoryCheapHackListener.prototype.oninsert = function(emitter, event, //
  data) {
    if (emitter === State.tournaments) {
      data.object.getCombinedHistory().registerListener(this);
    }
    this.update();
  };

  /**
   * a tournament has been removed
   *
   * @param emitter
   * @param event
   * @param data
   */
  TabHistoryCheapHackListener.prototype.onremove = function(emitter, event, //
  data) {
    if (emitter === State.tournaments) {
      data.object.getHistory().unregisterListener(this);
    }
    this.update();
  };

  TabHistoryCheapHackListener.instance = new TabHistoryCheapHackListener();

  return undefined;
});
