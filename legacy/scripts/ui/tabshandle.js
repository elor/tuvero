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

  tabmenu = {
    getTabModel: function() {
      return undefined;
    }
  };

  $(function() {
    if ($('#tabs').length === 1 && $('#testmain').length === 0) {
      tabmenu = new TabMenuView($('#tabs'));
    }

    // hide the lanes tab
    if (tabmenu.getTabModel('lanes')) {
      tabmenu.getTabModel('lanes').visibility.set(false);
    }
  });

  TabsHandle = {
    hide: function(tabname) {
      var tab = tabmenu.getTabModel(tabname);

      if (!tab) {
        return;
      }

      tab.visibility.set(false);
      tab.accessibility.set(false);
    },
    show: function(tabname) {
      var tab = tabmenu.getTabModel(tabname);

      if (!tab) {
        return;
      }

      tab.visibility.set(true);
      tab.accessibility.set(true);
    },
    focus: function(tabname) {
      tabmenu.focus(tabname);
    },
    bindTabOpts: function(tabname, valueModel) {
      var tab = tabmenu.getTabModel(tabname);

      if (!tab) {
        return undefined;
      }

      tab.imgParam.bind(valueModel);
    }
  };

  return TabsHandle;
});
