/**
 * TabNewCheapHackListener: manage Tab_New visibility and update when a new
 * player has been added
 *
 * @return TabNewCheapHackListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/listener', '../state_new', '../tabshandle'//
], function(extend, Listener, State, TabsHandle) {

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
      TabsHandle.hide('new');
    } else {
      TabsHandle.show('new');
    }
  };

  /**
   * the number of teams has changed
   */
  TabNewCheapHackListener.prototype.onresize = function() {
    this.update();
  };

  TabNewCheapHackListener.instance = new TabNewCheapHackListener();

  return TabNewCheapHackListener;
});
