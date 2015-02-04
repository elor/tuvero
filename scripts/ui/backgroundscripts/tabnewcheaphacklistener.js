/**
 * TabNewCheapHackListener: manage Tab_New visibility and update when a new
 * player has been added
 *
 * @return TabNewCheapHackListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', '../listener', '../tab_new', '../state_new',
    '../tabshandle'], function(extend, Listener, Tab_New, State, Tabshandle) {
  /**
   * Constructor
   */
  function TabNewCheapHackListener() {
    TabNewCheapHackListener.superconstructor.call(this);

    State.teams.registerListener(this);

    this.update();
  }
  extend(TabNewCheapHackListener, Listener);

  /**
   * show/hide the tab and update it as necessary
   */
  TabNewCheapHackListener.prototype.update = function() {
    if (State.teams.length < 2) {
      Tabshandle.hide('new');
    } else {
      Tabshandle.show('new');
      Tab_New.update();
    }
  };

  /**
   * the number of teams has changed
   */
  TabNewCheapHackListener.prototype.onresize = function() {
    this.update();
  };

  return new TabNewCheapHackListener();
  // return TabNewCheapHackListener;
});
