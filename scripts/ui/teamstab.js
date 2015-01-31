/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(
    ['lib/extend', './view', './listview', './teamview', './state_new', './newteamview'],
    function(extend, View, ListView, TeamView, State, NewTeamView) {
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
        var $template, $container;

        // teams
        $container = this.$view.find('>.teamlist');
        $template = $container.find('>.team.template').detach().removeClass(
            'template');

        this.teamView = new ListView(State.teams, $container, $template,
            TeamView);

        // registration
        $container = this.$view.find('>form#newteam');
        this.newTeamView = new NewTeamView(State.teams, $container);
      };

      // FIXME CHEAP HACK AHEAD
      $(function($) {
        var $tab;

        $tab = $('#teams');

        new TeamsTab($tab);
      });

      return TeamsTab;
    });
