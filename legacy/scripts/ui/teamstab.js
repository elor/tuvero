/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(
    ['lib/extend', 'core/view', './listview', './teamview', './state_new',
        './newteamview', './lengthview', './teamsizeview',
        './preregcloserview', 'core/valuemodel', './checkboxview',
        'core/classview', './tabshandle', './teamremovecontroller',
        './teamnamecontroller', './teamtableview', './inputview',
        './teamsfileloadcontroller', 'options'],
    function(extend, View, ListView, TeamView, State, NewTeamView, LengthView,
        TeamSizeView, PreregCloserView, ValueModel, CheckboxView, ClassView,
        TabsHandle, TeamRemoveController, TeamNameController, TeamTableView,
        InputView, TeamsFileLoadController, Options) {
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
      }
      extend(TeamsTab, View);

      /**
       * initialize the tab functionality
       *
       * TODO maybe split it into multiple autodetected functions?
       */
      TeamsTab.prototype.init = function() {
        var $template, $container, value;

        // teamsize bugfix
        if (State.teamsize.get() < Options.minteamsize) {
          State.teamsize.set(Options.minteamsize);
        }
        if (State.teamsize.get() > Options.maxteamsize) {
          State.teamsize.set(Options.maxteamsize);
        }

        // teamlist
        $container = this.$view.find('>.teamlist');
        $template = $container.find('.team.template');
        this.teamList = new ListView(State.teams, $container, $template,
            TeamView);

        // teamtable
        $container = this.$view.find('>.teamtable');
        $template = $container.find('.team.template');
        this.teamTable = new ListView(State.teams, $container, $template,
            TeamView);

        // registration
        $container = this.$view.find('>.newteamview');
        this.newTeamView = new NewTeamView(State.teams, $container,
            State.teamsize);

        // number of teams
        $container = this.$view.find('> h2 > .numteams');
        this.lengthView = new LengthView(State.teams, $container);

        // change team size
        $container = this.$view.find('> .teamsizeview');
        this.teamSizeView = new TeamSizeView(State.teamsize, $container);

        // hide team size buttons when a team has been registered
        this.teamSizeCloserView = new PreregCloserView(State.teams, this.$view);

        // name maxwidth checkbox
        value = new ValueModel();
        $container = this.$view.find('>.options input.maxwidth');
        this.maxwidthCheckboxView = new CheckboxView(value, $container);
        this.maxwidthClassView = new ClassView(value, this.$view, 'maxwidth',
            'nomaxwidth');

        // list/table selection checkbox
        value = new ValueModel();
        $container = this.$view.find('>.options input.showtable');
        this.showtableCheckboxView = new CheckboxView(value, $container);
        this.showtableClassView = new ClassView(value, this.$view, 'showtable');

        // update the tab when the team size changes
        TabsHandle.bindTabOpts('teams', State.teamsize);

        // team removal controllers
        $container = this.$view.find('>button.delete');
        this.teamRemoveController = new TeamRemoveController([this.teamList,
            this.teamTable], $container, this.$view);

        // player name changes
        this.teamNameController = new TeamNameController(this.teamList);
        this.teamNameController = new TeamNameController(this.teamTable);

        // hide teamTable content depending on state
        this.teamTableView = new TeamTableView(this.teamTable, State.teamsize);

        $container = this.$view.find('>.filereader input');
        this.teamsFileLoadController = new TeamsFileLoadController(
            new InputView($container));
      };

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
