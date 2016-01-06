/**
 * TabGamesCheapHackListener: manage Tab_New visibility and update when a new
 * player has been added
 *
 * @return TabGamesCheapHackListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/listener', '../state_new', '../tabshandle'//
], function(extend, Listener, State, Tabshandle) {

  /**
   * Constructor
   */
  function TabGamesCheapHackListener() {
    TabGamesCheapHackListener.superconstructor.call(this);

    State.tournaments.registerListener(this);

    this.update();
  }
  extend(TabGamesCheapHackListener, Listener);

  /**
   * show/hide the tab and update it as necessary
   */
  TabGamesCheapHackListener.prototype.update = function() {
    var i, isRunning;

    isRunning = false;

    for (i = 0; !isRunning && i < State.tournaments.length; i += 1) {
      isRunning = State.tournaments.get(i).getState().get() === 'running';
    }

    if (isRunning) {
      Tabshandle.show('games');
    } else {
      Tabshandle.hide('games');
    }
  };

  /**
   * a tournament state has been changed
   *
   * @param emitter
   * @param event
   * @param data
   */
  TabGamesCheapHackListener.prototype.onupdate = function(emitter, event, //
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
  TabGamesCheapHackListener.prototype.oninsert = function(emitter, event, //
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
  TabGamesCheapHackListener.prototype.onremove = function(emitter, event, //
  data) {
    data.object.getState().unregisterListener(this);
    this.update();
  };

  TabGamesCheapHackListener.instance = new TabGamesCheapHackListener();

  return TabGamesCheapHackListener;
});
