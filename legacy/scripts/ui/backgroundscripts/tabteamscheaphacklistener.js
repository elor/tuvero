/**
 *
 * TabTeamsCheapHackListener: manage Tab_Teams visibility: Only visible when a
 * tournament can be saved
 *
 * @return TabTeamsCheapHackListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/listener', 'timemachine/timemachine',
    '../tabshandle'], function(extend, Listener, TimeMachine, TabsHandle) {

  /**
   * Constructor
   */
  function TabTeamsCheapHackListener() {
    TabTeamsCheapHackListener.superconstructor.call(this);

    TimeMachine.commit.registerListener(this);

    this.update();
  }
  extend(TabTeamsCheapHackListener, Listener);

  /**
   * show/hide the tab and update it as necessary
   */
  TabTeamsCheapHackListener.prototype.update = function() {
    if (TimeMachine.commit.get()) {
      TabsHandle.show('teams');
    } else {
      TabsHandle.hide('teams');
    }
  };

  /**
   * the number of teams has changed
   */
  TabTeamsCheapHackListener.prototype.onupdate = function() {
    this.update();
  };

  TabTeamsCheapHackListener.instance = new TabTeamsCheapHackListener();

  return TabTeamsCheapHackListener;
});
