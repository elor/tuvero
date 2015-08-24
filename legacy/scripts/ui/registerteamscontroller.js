/**
 * RegisterTeamsController
 *
 * @return RegisterTeamsController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'core/view', './state_new',
    './teammodel', './playermodel', 'backend/random'], function(extend,
    Controller, View, State, TeamModel, PlayerModel, Random) {
  var rng;

  rng = new Random();

  /**
   * Constructor
   */
  function RegisterTeamsController($button, $numteams) {
    RegisterTeamsController.superconstructor.call(this, new View(undefined,
        $button));

    this.$button = $button;
    this.$numteams = $numteams;

    $button.click(this.registerTeams.bind(this));
    this.$numteams.keydown((function(e) {
      if (e.which == 13) {
        this.registerTeams();
      }
    }).bind(this));
  }
  extend(RegisterTeamsController, Controller);

  RegisterTeamsController.prototype.registerTeams = function() {
    var numTeams;

    numTeams = Number(this.$numteams.val());
    if (isNaN(numTeams)) {
      return;
    }

    for (; numTeams > 0; numTeams -= 1) {
      State.teams.push(RegisterTeamsController.createTeam());
    }
  };

  RegisterTeamsController.createTeam = function() {
    var players, team;

    players = [];
    while (players.length < State.teamsize.get()) {
      players.push(new PlayerModel(RegisterTeamsController.randomName()));
    }

    team = new TeamModel(players);

    return team;
  };

  RegisterTeamsController.randomName = function() {
    var first, last, length, i, letters, Letters;

    letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ä',
        'ö', 'ü', 'ß'];
    Letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Ä',
        'Ö', 'Ü'];

    length = rng.nextInt(6) + 3;
    first = '';
    first += rng.pick(Letters);
    for (i = 0; i < length; i++) {
      first += rng.pick(letters);
    }

    length = rng.nextInt(6) + 3;
    last = '';
    last += rng.pick(Letters);
    for (i = 0; i < length; i++) {
      last += rng.pick(letters);
    }

    return first + ' ' + last;
  }

  return RegisterTeamsController;
});
