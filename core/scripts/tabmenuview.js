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
    './selectionvaluemodel', './tabmodel', './classview', './tabimageview',
    './listexclusionlistener'], function(extend, View, TabMenuController,
    ListModel, SelectionValueModel, TabModel, ClassView, TabImageView,
    ListExclusionListener) {
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
    this.tabmodels = {};
    this.$menu = undefined;
    this.tabmodels = {};

    this.initTabs();

    this.controller = new TabMenuController(this);
  }
  extend(TabMenuView, View);

  /**
   * Perform all initializations
   */
  TabMenuView.prototype.initTabs = function() {
    this.extractTabNames();
    this.createTabMenu();
    this.createTabModels();
    this.readDefaultTab();
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
   * For every extracted tabname, create and bind a TabModel which controls the
   * visibility, accessibility and image parameter
   */
  TabMenuView.prototype.createTabModels = function() {
    this.tabnames.map(function(tabname) {
      /*
       * Using a throwaway tmp variable to avoid unjustified Lint warnings, but
       * keep them active for other parts of the code. This is bad coding, but I
       * don't want another reference outside of emitters and listeners.
       */
      var tmp, model;

      model = new TabModel();
      this.tabmodels[tabname] = model;

      tmp = new ClassView(model.visibility, this.$tabicons[tabname], undefined,
          'hidden');
      tmp = new TabImageView(tabname, model.imgParam, this.$tabicons[tabname]);
      tmp = new ListExclusionListener(model.accessibility, this.tabnames,
          tabname);

      return tmp;
    }, this);
  };

  /**
   * use the first tab as the default tab.
   *
   * Side note: The "first tab" is the first tab in the list, not the first tab
   * on the page. Right after starting the software, they coincide, but this can
   * change when the first tab is made unaccessible. Though this is unwanted
   * behaviour,it's good enough for Tuvero. Just don't hide the start page.
   *
   * If you do, I urge you to adjust the code somehow. Hook into the events of
   * this.tabnames or this.model to get a new default tab.
   */
  TabMenuView.prototype.readDefaultTab = function() {
    // This implicitly calls onupdate()
    this.model.setDefault(this.tabnames.get(0));
  };

  /**
   * Retrieve the controlling TabModel instances
   *
   * @param tabname
   *          the tab name
   * @return undefined on failure, the associated tab model otherwise
   */
  TabMenuView.prototype.getTabModel = function(tabname) {
    return this.tabmodels[tabname];
  };

  /**
   * create and add the menu to the DOM
   */
  TabMenuView.prototype.createTabMenu = function() {

    this.$menu = $('<span>').addClass('tabmenu');

    this.tabnames.map(function(tabname) {
      var $tab = $('<a>').attr('tabindex', -1);
      $tab.attr('href', '#' + tabname);
      if (this.keys[tabname]) {
        $tab.attr('accesskey', this.keys[tabname]);
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

  /**
   * Delegate the focus request all the way to the controller
   *
   * @param tabname
   *          the tab to focus
   */
  TabMenuView.prototype.focus = function(tabname) {
    this.controller.focus(tabname);
  };

  return TabMenuView;
});
