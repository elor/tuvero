/**
 * TAC Presets: TAC rankings, followed by wins and numgames
 *
 * @return Presets
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(function () {
  var Presets;

  Presets = {
    target: "tac",
    systems: {
      swiss: {
        ranking: ["tac", "numgames", "wins", "headtohead"],
        mode: "ranks"
      },
      ko: {
        mode: "matched"
      },
      round: {
        ranking: ["tac", "numgames", "wins", "headtohead"]
      },
      placement: {}
    },
    ranking: {
      components: ["tac", "numgames", "wins", "headtohead", "saldo"]
    },
    registration: {
      defaultteamsize: 1,
      minteamsize: 1,
      maxteamsize: 3,
      teamsizeicon: false
    },
    taboptions: {
      namemaxwidth: false,
      showmatchtables: true
    },
    names: {
      playernameurl: "",
      dbplayername: "tacplayers",
      apitoken: "apitoken",
      teamsfile: "tuvero-anmeldungen.txt"
    },
    ui: {
      rankingpoints: false
    }
  };

  return Presets;
});