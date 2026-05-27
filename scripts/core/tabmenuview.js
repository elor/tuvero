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
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import View from './view.js'
import TabMenuController from './tabmenucontroller.js'
import ListModel from '../list/listmodel.js'
import SelectionValueModel from './selectionvaluemodel.js'
import TabModel from './tabmodel.js'
import ClassView from './classview.js'
import TabImageView from './tabimageview.js'
import ListExclusionListener from '../list/listexclusionlistener.js'

/**
 * Constructor
 *
 * @param $view
 *          associated DOM element
 */
class TabMenuView extends View {
  constructor ($view) {
    const tabnames = new ListModel()
    super(new SelectionValueModel(undefined, tabnames), $view)
    this.tabnames = tabnames
    this.keys = {}
    this.$tabs = {}
    this.$tabicons = {}
    this.tabmodels = {}
    this.$menu = undefined
    this.tabmodels = {}
    this.initTabs()
    this.controller = new TabMenuController(this)
  }

  /**
   * Perform all initializations
   */
  initTabs () {
    this.extractTabNames()
    this.createTabMenu()
    this.createTabModels()
    this.readDefaultTab()
  }

  /**
   * read the data-tab of the tabs, remove them and store them in tabnames
   */
  extractTabNames () {
    const tabnames = this.tabnames
    const $tabs = this.$tabs
    const keys = this.keys
    this.$view.find('> div').each(function (index) {
      const $this = $(this)
      const tabname = $this.attr('data-tab')
      keys[tabname] = $this.attr('accesskey')
      $this.removeAttr('accesskey')
      $tabs[tabname] = $this
      tabnames.push(tabname)
    })
  }

  /**
   * For every extracted tabname, create and bind a TabModel which controls the
   * visibility, accessibility and image parameter
   */
  createTabModels () {
    this.tabnames.map(function (tabname) {
      /*
       * Using a throwaway tmp variable to avoid unjustified Lint warnings, but
       * keep them active for other parts of the code. This is bad coding, but I
       * don't want another reference outside of emitters and listeners.
       */
      let tmp
      const model = new TabModel()
      this.tabmodels[tabname] = model
      tmp = new ClassView(model.visibility, this.$tabicons[tabname], undefined, 'hidden')
      tmp = new TabImageView(tabname, model.imgParam, this.$tabicons[tabname])
      tmp = new ListExclusionListener(model.accessibility, this.tabnames, tabname)
      return tmp
    }, this)
  }

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
  readDefaultTab () {
    // This implicitly calls onupdate()
    this.model.setDefault(this.tabnames.get(0))
  }

  /**
   * Retrieve the controlling TabModel instances
   *
   * @param tabname
   *          the tab name
   * @return undefined on failure, the associated tab model otherwise
   */
  getTabModel (tabname) {
    return this.tabmodels[tabname]
  }

  /**
   * create and add the menu to the DOM
   */
  createTabMenu () {
    this.$menu = $('<span>').addClass('tabmenu')
    this.tabnames.forEach(function (tabname) {
      const $tab = $('<a>').attr('tabindex', -1)
      $tab.attr('href', '#' + tabname)
      if (this.keys[tabname]) {
        $tab.attr('accesskey', this.keys[tabname])
      }
      this.$tabicons[tabname] = $tab
      this.$menu.append($tab)
    }, this)
    this.$view.before(this.$menu)
  }

  /**
   * shows the currently active tab
   */
  update () {
    // guaranteed to be a valid index, because of SelectionValueModel
    const tabname = this.model.get()
    this.$view.find('>.open').removeClass('open')
    this.$menu.find('>.open').removeClass('open')
    this.$tabs[tabname].addClass('open')
    this.$tabicons[tabname].addClass('open')
  }

  /**
   * Callback Listener for SelectionValueModel changes
   */
  onupdate () {
    this.update()
  }

  /**
   * Delegate the focus request all the way to the controller
   *
   * @param tabname
   *          the tab to focus
   */
  focus (tabname) {
    this.controller.focus(tabname)
  }
}

export default TabMenuView
