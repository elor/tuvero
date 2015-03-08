/**
 * TabMenuView: manage the visibility of tabs and show a tab menu. This class
 * does not work with ids and targets directly, so multiple instances are
 * possible, but still discouraged.
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
define(['lib/extend', './view', './tabmenucontroller', './listmodel',
    './selectionvaluemodel'], function(extend, View, TabMenuController,
    ListModel, SelectionValueModel) {
  /**
   * Constructor
   *
   * @param $view
   *          associated DOM element
   */
  function TabMenuView($view) {
    this.tabnames = new ListModel();
    TabMenuView.superconstructor.call(this, new SelectionValueModel(undefined,
        this.tabnames), $view);

    this.keys = {};
    this.$tabs = {};
    this.$tabicons = {};
    this.$menu = undefined;

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
    // This implicitly calls onupdate()
    this.model.setDefault(this.tabnames.get(0));
  };

  /**
   * read the data-tab of the tabs, remove them and store them in tabnames
   */
  TabMenuView.prototype.extractTabNames = function() {
    var tabnames, $tabs, keys;

    tabnames = this.tabnames;
    $tabs = this.$tabs;
    keys = this.keys;

    this.$view.find('> div').each(function(index) {
      var $this, tabname;
      $this = $(this);
      tabname = $this.attr('data-tab');

      keys[tabname] = $this.attr('accesskey');
      $this.removeAttr('accesskey');

      $tabs[tabname] = $this;
      tabnames.push(tabname);
    });
  };

  /**
   * create and add the menu to the DOM
   */
  TabMenuView.prototype.addMenu = function() {

    this.$menu = $('<span>').addClass('tabmenu');

    this.tabnames.map(function(tabname) {
      var $tab = $('<a>').attr('tabindex', -1);
      $tab.attr('href', '#' + tabname);
      $tab.attr('data-img', tabname);
      if (this.keys[tabname]) {
        $tab.attr('accesskey', this.keys[tabname]);
      }
      if (this.$tabs[tabname].hasClass('hiddentab')) {
        $tab.addClass('hidden');
      }
      this.$tabicons[tabname] = $tab;
      this.$menu.append($tab);
    }, this);

    this.$view.before(this.$menu);
  };

  /**
   * shows the currently active tab
   */
  TabMenuView.prototype.update = function() {
    var tabname;

    // guaranteed to be a valid index, because of SelectionValueModel
    tabname = this.model.get();

    this.$view.find('>.open').removeClass('open');
    this.$menu.find('>.open').removeClass('open');
    this.$tabs[tabname].addClass('open');
    this.$tabicons[tabname].addClass('open');
  };

  /**
   * Callback Listener for SelectionValueModel changes
   */
  TabMenuView.prototype.onupdate = function() {
    this.update();
  };

  return TabMenuView;
});
