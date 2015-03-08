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

    this.$tabs = {};
    this.$tabicons = {};

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
  };

  /**
   * read the ids of the tabs, remove them and store them in the tabnames array
   */
  TabMenuView.prototype.extractTabNames = function() {
    var tabnames, $tabs;

    tabnames = this.tabnames;
    $tabs = this.$tabs;

    this.$view.find('> [id]').each(function(index) {
      var $this, tabname;
      $this = $(this);
      tabname = $this.attr('id');
      $this.removeAttr('id');
      $tabs[tabname] = $this;
      tabnames.push(tabname);
    });

    // This implicitly calls onupdate(), which is why there's a setTimeout call
    this.model.setDefault(tabnames.get(0));
  };

  /**
   * create and add the menu to the DOM
   */
  TabMenuView.prototype.addMenu = function() {
    var $menu;

    $menu = $('<span>').addClass('tabmenu');

    this.tabnames.map(function(tabname) {
      var $tab = $('<a>').attr('tabindex', -1);
      $tab.attr('id', tabname);
      $tab.attr('href', '#' + tabname);
      $tab.attr('data-img', tabname);
      this.$tabicons[tabname] = $tab;
      $menu.append($tab);
    }, this);

    this.$view.before($menu);
  };

  /**
   * shows the currently active tab
   */
  TabMenuView.prototype.update = function() {
    var tabname;

    // guaranteed to be a valid index, because of SelectionValueModel
    tabname = this.model.get();

    this.$view.find('>.open').removeClass('open');
    this.$tabs[tabname].addClass('open');
    this.$tabicons[tabname].addClass('open');
  };

  /**
   * Callback Listener for SelectionValueModel changes
   */
  TabMenuView.prototype.onupdate = function() {
    /*
     * We're using a timeout to avoid race conditions during construction:
     * $tabicons and $tabs need to be initialized before the first update()
     * call. Due to the single-threaded nature of JavaScript, there should be no
     * conceivable difference in speed and visibility.
     *
     * Note that pre-IE10-browsers won't support the additional parameters, so
     * there's an additional problem. They're not the target browsers, anyhow
     */
    window.setTimeout(function(view) {
      view.update();
    }, 0, this);
  };

  return TabMenuView;
});
