/**
 * TabMenuView: manage the visibility of tabs and show a tab menu. Also
 * re-assigns the tab ids. Due to the use of the location hash, there cannot be
 * more than one Tabmenu. This is a deliberate design decision.
 *
 * This class is supposed to avoid the css :target attribute for a multitude of
 * reasons. First, :target is not as cross-browser-compatible as required: Most
 * browsers cannot print :target-displayed elements. :target-displayed elements
 * will force the scroll position on reload, which "hides" the tabmenu. Also,
 * using the history (back/forward feature) of the browser, it's possible to
 * move to an already closed or non-existant tab. Worst of all, the tabmenu has
 * to be hidden behind its containing tab by using a lower z-index, which
 * renders the tabmenu unclickable in Internet Explorer.
 *
 * By using CSS classes to show/hide tabs, all of the above errors are avoided.
 *
 * @return TabMenuView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './view', './tabmenucontroller'], function(extend, View,
    TabMenuController) {
  /**
   * Constructor
   */
  function TabMenuView($view) {
    TabMenuView.superconstructor.call(this, undefined, $view);

    this.tabnames = [];
    this.$tabs = [];
    this.$tabicons = [];

    this.initTabs();

    this.controller = new TabMenuController(this);
  }
  extend(TabMenuView, View);

  /**
   * Perform all initializations
   */
  TabMenuView.prototype.initTabs = function() {
    this.extractTabNames();
    this.addMenu();
    this.openValidTab();
  };

  /**
   * read the ids of the tabs, remove them and store them in the tabnames array
   */
  TabMenuView.prototype.extractTabNames = function() {
    var tabnames, $tabs;

    tabnames = this.tabnames;
    $tabs = this.$tabs;

    this.$view.find('> [id]').each(function() {
      var $this = $(this);
      tabnames.push($this.attr('id'));
      $this.removeAttr('id');
      $tabs.push($this);
    });
  };

  /**
   * create and add the menu to the DOM
   */
  TabMenuView.prototype.addMenu = function() {
    var $menu;

    $menu = $('<span>').addClass('tabmenu');

    this.tabnames.forEach(function(name) {
      var $tab = $('<a>');
      $tab.attr('id', name);
      $tab.attr('href', '#' + name);
      $tab.attr('data-img', name);
      this.$tabicons.push($tab);
      $menu.append($tab);
    }, this);

    this.$view.before($menu);
  };

  /**
   * opens a valid tab, i.e. it has to be registered and visible
   */
  TabMenuView.prototype.openValidTab = function() {
    this.$view.find('>.open').removeClass('open');
    this.$tabs[0].addClass('open');
    this.$tabicons[0].addClass('open');
  };

  return TabMenuView;
});
