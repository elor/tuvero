/**
 * MatchView
 *
 * @return MatchView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', 'ui/teamview',
    'ui/matchcontroller', 'options', './playermodel', './teammodel',
    './strings', 'core/type'], function(extend, $, View, TeamView,
    MatchController, Options, PlayerModel, TeamModel, Strings, Type) {
  var byePlayer;

  // player name for bye votes
  byePlayer = new PlayerModel(Strings.byename);

  /**
   * create a team with exactly the wanted number of bye players.
   *
   * @return a TeamModel instance which is not part of the teams list, has only
   *         bye players and a (textual) team id which represents a bye vote
   */
  function createByeTeam(length) {
    var players, team;

    players = [];

    while (players.length < length) {
      players.push(byePlayer);
    }

    team = new TeamModel(players);
    team.setID(Strings.byeid);
    return team;
  }

  function $createTeamsLists($elements) {
    var team, teams, i, $element;

    team = undefined;
    teams = [];

    for (i = 0; i <= $elements.length; i += 1) {
      $element = $elements.eq(i);
      if (i === $elements.length || $element.hasClass('teamno')) {
        if (team) {
          teams.push($(team));
        }
        team = undefined;
      }

      if ($element) {
        if (!team) {
          team = [];
        }
        team.push($element[0]);
      }
    }

    return teams;
  }

  /**
   * Constructor
   *
   * @param model
   *          a MatchModel instance
   * @param $view
   *          a jQuery object representing a MatchView table
   * @param teamlist
   *          Optional. A ListModel of TeamModels, from which the teams will be
   *          read for visualization. See MatchView.bindTeamList(), too.
   */
  function MatchView(model, $view, teamlist) {
    MatchView.superconstructor.call(this, model, $view);

    this.teamviews = [];
    if (teamlist) {
      this.teamlist = teamlist;
    } else if (!this.teamlist) {
      this.teamlist = undefined;
    }

    this.$view.find('.finish .points').val(Options.defaultscore || 0);

    if (!this.model.isResult()) {
      this.controller = new MatchController(this);
    }

    this.update();
  }
  extend(MatchView, View);

  /**
   * destroy all team views before creating new ones on the existing items. This
   * is a bit too much, but it shouldn't be called too often, right?
   */
  MatchView.prototype.destroyTeamViews = function() {
    // destroy all teamviews in order to create new ones
    this.teamviews.forEach(function(teamview) {
      teamview.destroy();
    });
    this.teamviews.splice(0);
  };

  /**
   * update all the values
   */
  MatchView.prototype.update = function() {
    var $teams, i, $team, teamid, isBye, team;

    $teams = this.$view.find('.team');
    if ($teams.length === 0) {
      $teams = $createTeamsLists(this.$view.find('>.teamno , >.name'));
    }
    if ($teams.length === 0) {
      $teams = $createTeamsLists(this.$view.filter('.teamno,.name'));
    }

    this.destroyTeamViews();

    isBye = this.model.isBye && this.model.isBye();

    // FIXME support for a varying number of teams required
    for (i = 0; i < $teams.length; i += 1) {
      $team = $($teams[i]);
      teamid = this.model.getTeamID(i % this.model.length);

      if (teamid !== undefined && this.teamlist) {
        team = this.teamlist.get(teamid);
        if (isBye && i % 2) {
          team = createByeTeam(team.length);
        }
        this.teamviews.push(new TeamView(team, $team));
      } else {
        if (isBye) {
          team = Strings.byename;
        } else if (Type.isNumber(teamid)) {
          team = teamid + 1;
        } else {
          team = teamid;
        }
        $team.text(team);
      }
    }
  };

  /**
   * Callback Listener. For safety. Is never called in the current
   * implementation.
   *
   * @param emitter
   *          this.model
   * @param event
   *          'update'
   * @param data
   *          should be undefined
   */
  MatchView.prototype.onupdate = function(emitter, event, data) {
    this.update();
  };

  /**
   * bind a whole MatchView subclass to a list of teams for better display.
   *
   * @param teamlist
   *          a ListModel of TeamModel instances
   * @return a new MatchView constructor, which has this.teamList set
   */
  MatchView.bindTeamList = function(teamlist) {
    function MyMatchView() {
      MyMatchView.superconstructor.apply(this, arguments);
    }
    extend(MyMatchView, MatchView);

    MyMatchView.prototype.teamlist = teamlist;

    return MyMatchView;
  };

  return MatchView;
});
