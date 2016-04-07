/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './listview', './teamview', 'ui/state',
    './newteamview', './lengthview', './teamsizeview', './preregcloserview',
    './checkboxview', 'core/classview', './tabshandle',
    './teamremovecontroller', './teamnamecontroller', './teamtableview',
    './inputview', './teamsfileloadcontroller', 'presets', 'core/lengthmodel',
    './deleteallteamscontroller', './autocompletionmodel',
    './autocompletionview', './autocompletionlegacyblobber',
    './teamformatdownloadcontroller', 'timemachine/timemachine'], function(
    extend, View, ListView, TeamView, State, NewTeamView, LengthView,
    TeamSizeView, PreregCloserView, CheckBoxView, ClassView, TabsHandle,
    TeamRemoveController, TeamNameController, TeamTableView, InputView,
    TeamsFileLoadController, Presets, LengthModel, DeleteAllTeamsController,
    AutocompletionModel, AutocompletionView, AutocompletionLegacyBlobber,
    TeamFormatDownloadController, TimeMachine) {
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
  function TeamsTab($tab) {
    TeamsTab.superconstructor.call(this, undefined, $tab);

    this.init();

    this.update();

    TimeMachine.commit.registerListener(this);
  }
  extend(TeamsTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  TeamsTab.prototype.init = function() {
    var $template, $container, $button, value;

    // teamsize bugfix
    if (State.teamsize.get() < Presets.registration.minteamsize) {
      State.teamsize.set(Presets.registration.minteamsize);
    }
    if (State.teamsize.get() > Presets.registration.maxteamsize) {
      State.teamsize.set(Presets.registration.maxteamsize);
    }

    // teamlist
    $container = this.$view.find('>.teamlist');
    $template = $container.find('.team.template');
    this.teamList = new ListView(State.teams, $container, $template, TeamView);

    // teamtable
    $container = this.$view.find('>.teamtable');
    $template = $container.find('.team.template');
    this.teamTable = new ListView(State.teams, $container, $template, //
    TeamView);

    // registration
    $container = this.$view.find('>.newteamview');
    this.newTeamView = new NewTeamView(State.teams, $container, //
    State.teamsize);

    // number of teams
    $container = this.$view.find('> h2 > .numteams');
    this.lengthView = new LengthView(State.teams, $container);

    // change team size
    $container = this.$view.find('> .teamsizeview');
    if ($container.length !== 0) {
      this.teamSizeView = new TeamSizeView(State.teamsize, $container);
    }

    // hide team size buttons when a team has been registered
    this.teamSizeCloserView = new PreregCloserView(State.teams, this.$view);

    // hide registration and removal buttons after the first tournament
    this.regVisibilityView = new ClassView(new LengthModel(State.tournaments),
        this.$view, 'noreg');

    // name maxwidth checkbox
    value = State.tabOptions.nameMaxWidth;
    $container = this.$view.find('>.options input.maxwidth');
    this.maxwidthCheckBoxView = new CheckBoxView(value, $container);
    this.maxwidthClassView = new ClassView(value, this.$view, 'maxwidth',
        'nomaxwidth');

    // list/table selection checkbox
    value = State.tabOptions.teamTable;
    $container = this.$view.find('>.options input.showtable');
    this.showtableCheckBoxView = new CheckBoxView(value, $container);
    this.showtableClassView = new ClassView(value, this.$view, 'showtable');

    // update the tab when the team size changes
    if (Presets.registration.teamsizeicon) {
      TabsHandle.bindTabOpts('teams', State.teamsize);
    }

    // team removal controllers
    $container = this.$view.find('>button.delete');
    this.teamRemoveController = new TeamRemoveController([this.teamList,
        this.teamTable], $container, this.$view);

    $container = this.$view.find('>button.deleteall');
    this.deleteAllTeamsController = new DeleteAllTeamsController(new View(
        undefined, $container));

    // player name changes
    this.teamNameController = new TeamNameController(this.teamList);
    this.teamNameController = new TeamNameController(this.teamTable);

    // hide teamTable content depending on state
    this.teamTableView = new TeamTableView(this.teamTable, State.teamsize);

    $button = this.$view.find('>button.fileloadteams');
    this.teamsFileLoadController = new TeamsFileLoadController($button);

    this.autocompletionModel = new AutocompletionModel();
    this.autocompletionModel.download(Presets.names.playernameurl);
    AutocompletionLegacyBlobber.set(this.autocompletionModel);

    $container = this.$view.find('input.playername');
    this.autocompletionView = new AutocompletionView(this.autocompletionModel,
        $container);

    $container = this.$view.find('.downloadcsvexample');
    this.downloadexamplecontroller = new TeamFormatDownloadController(new View(
        undefined, $container));
  };

  TeamsTab.prototype.onupdate = function() {
    this.update();
  }

  TeamsTab.prototype.update = function() {
    if (TimeMachine.commit.get()) {
      TabsHandle.show('teams');
    } else {
      TabsHandle.hide('teams');
    }
  }

  // FIXME CHEAP HACK AHEAD
  $(function($) {
    var $tab;

    $tab = $('#tabs > [data-tab="teams"]');
    if ($tab.length && $('#testmain').length === 0) {
      return new TeamsTab($tab);
    }
  });

  return TeamsTab;
});
