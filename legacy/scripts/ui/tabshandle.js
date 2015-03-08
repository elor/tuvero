/**
 * Instantiates the TabMenuView and abstracts the old Tabs calls to the new
 * TabsMenuView interface.
 *
 * FIXME use TabMenuView directly and remove this file
 *
 * @return TabsHandle
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['core/tabmenuview', 'jquery'], function(TabMenuView, $) {
  var tabmenu, TabsHandle;

  if ($('#testmain').length !== 0) {
    // TODO remove this extremely cheap hack
    function dummy() {

    }

    return {
      hide: dummy,
      show: dummy,
      focus: dummy,
      bindTabOpts: dummy
    };
  }

  tabmenu = new TabMenuView($('#tabs'));

  TabsHandle = {
    hide: function(tabname) {
      var tab = tabmenu.getTabModel(tabname);

      tab.visibility.set(false);
      tab.accessibility.set(false);
    },
    show: function(tabname) {
      var tab = tabmenu.getTabModel(tabname);

      tab.visibility.set(true);
      tab.accessibility.set(true);
    },
    focus: function(tabname) {
      tabmenu.focus(tabname);
    },
    bindTabOpts: function(tabname, valueModel) {
      var tab = tabmenu.getTabModel(tabname);
      tab.imgParam.bind(valueModel);
    },
    direct: tabmenu

  };

  // hide the lanes tab
  TabsHandle.direct.getTabModel('lanes').visibility.set(false);

  return TabsHandle;
});
