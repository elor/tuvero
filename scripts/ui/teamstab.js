/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(
    ['lib/extend', './view', './listview', './teamview', './state_new',
        './newteamview', './lengthview', './teamsizeview',
        './preregcloserview', './valuemodel', './checkboxview', './classview',
        './taboptslistener', './teamremovecontroller'],
    function(extend, View, ListView, TeamView, State, NewTeamView, LengthView,
        TeamSizeView, PreregCloserView, ValueModel, CheckboxView, ClassView,
        TabOptsListener, TeamRemoveController) {
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

        // teams
        $container = this.$view.find('>.teamlist');
        $template = $container.find('>.team.template').detach().removeClass(
            'template');
        this.teamView = new ListView(State.teams, $container, $template,
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
        $container = this.$view.find('>.options>input.maxwidth');
        this.maxwidthCheckboxView = new CheckboxView(value, $container);
        this.maxwidthClassView = new ClassView(value, this.$view, 'maxwidth',
            'nomaxwidth');

        // update the tab when the team size changes
        this.tabOptsListener = new TabOptsListener(State.teamsize);

        // team removal controller
        $container = this.$view.find('>button.delete');
        this.teamRemoveController = new TeamRemoveController(this.teamView,
            $container, this.$view);
      };

      // FIXME CHEAP HACK AHEAD
      $(function($) {
        var $tab;

        $tab = $('#teams');
        return new TeamsTab($tab);
      });

      return TeamsTab;
    });
