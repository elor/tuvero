/**
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "jquery", "core/view", "ui/state", "ui/systemlistview",
    "ui/tournamentviewpopulator", "ui/checkboxview", "core/classview",
    "ui/tabshandle"], function (extend, $, View, State, SystemListView,
    TournamentViewPopulator, CheckBoxView, ClassView, TabsHandle) {
  /**
   * represents a whole team tab
   *
   * TODO write a TabView superclass with common functions
   *
   * TODO isolate common tab-related function
   *
   * @param $tab
   *          the tab DOM element
   */
  function NewTab($tab) {
    NewTab.superconstructor.call(this, undefined, $tab);

    this.init();

    this.update();

    State.teams.registerListener(this);
  }
  extend(NewTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  NewTab.prototype.init = function () {
    var $view, factory, $templates, view;

    $templates = this.$view.find(".template[data-system]").detach();
    factory = new TournamentViewPopulator($templates);
    $view = this.$view.find(".systemtable");
    view = new SystemListView(State.teams, $view, State.tournaments,
        State.teamsize, factory);

    this.$view.find(".boxview.system.template").detach();
  };

  // FIXME CHEAP HACK AHEAD
  $(function ($) {
    var $tab;

    $tab = $("#tabs > [data-tab=\"teams\"]");
    if ($tab.length && $("#testmain").length === 0) {
      return new NewTab($tab);
    }
  });

  return NewTab;
});
