define(
  [
    "lib/extend",
    "tournament/tournamentmodel",
    "tournament/ressources/poulestables",
    "core/matchmodel",
    "presets",
    "core/random",
    "core/valuemodel",
    "core/type"
  ],
  function (extend, TournamentModel, PoulesTables, MatchModel, Presets,
    Random, ValueModel, Type) {
    var rng = new Random();

    function PoulesTournamentModel() {
      PoulesTournamentModel.superconstructor.call(this, ["wins"]);

      this.setProperty("poulesmode", (Presets.systems.poules && Presets.systems.poules.mode) || PoulesTournamentModel.MODES.acbd);
      this.setProperty("poulesseed", (Presets.systems.poules && Presets.systems.poules.seed) || PoulesTournamentModel.SEED.quarters);
      this.setProperty("poulesbyepoules", (Presets.systems.poules && Presets.systems.poules.byepoules) || PoulesTournamentModel.BYEPOULES.front);
      this.setProperty("poulesbyeteams", (Presets.systems.poules && Presets.systems.poules.byeteams) || PoulesTournamentModel.BYETEAMS.favorites);

      this.numpoules = new ValueModel(0);
      this.numbyepoules = new ValueModel(0);

      this.teams.registerListener(this.numpoules);
      this.numpoules.clamp = (function () {
        this.numpoules.set(
          Math.min(
            Math.max(
              this.numpoules.get(),
              this.minPoules()
            ), this.maxPoules()
          ));
      }).bind(this);
      this.numpoules.onresize = this.numpoules.clamp;

      this.numpoules.registerListener(this.numbyepoules);
      this.teams.registerListener(this.numbyepoules);
      this.numbyepoules.onupdate = (function () {
        this.numpoules.clamp();
        this.numbyepoules.set(this.numpoules.get() * 4 - this.teams.length);
        this.emit("update");
      }).bind(this);
      this.numbyepoules.onresize = this.numbyepoules.onupdate;
    }
    extend(PoulesTournamentModel, TournamentModel);

    PoulesTournamentModel.prototype.SYSTEM = "poules";

    PoulesTournamentModel.MODES = {
      acbd: "acbd",
      barrage: "barrage",
      roundrobin: "roundrobin"
    };

    PoulesTournamentModel.SEED = {
      order: "order",
      quarters: "quarters",
      heads: "heads",
      random: "random"
    };

    PoulesTournamentModel.BYEPOULES = {
      front: "front",
      back: "back"
    };

    PoulesTournamentModel.BYETEAMS = {
      favorites: "favorites",
      lastteams: "lastteams"
    };

    PoulesTournamentModel.prototype.initialMatches = function () {
      var groups, drawtables;

      groups = this.createGroups();
      drawtables = this.getDrawTables();

      groups.forEach(function (group, groupID) {
        var draws = drawtables[group.length];

        console.log(groupID);

        if (!draws) {
          throw new Error("no draw mode for group of size " + group.length);
        }

        draws.forEach(function (draw, matchID) {
          var teamA, teamB;

          teamA = Type.isNumber(draw[0]) ? group[draw[0]] : undefined;

          if (draw.length === 1 && teamA !== undefined) {
            this.addBye(teamA, matchID, groupID);
          } else {
            teamB = Type.isNumber(draw[1]) ? group[draw[1]] : undefined;
            this.matches.push(new MatchModel([teamA, teamB], matchID, groupID));
          }
        }, this);
      }, this);

      return true;
    };

    PoulesTournamentModel.prototype.getDrawTables = function () {
      var drawmode, defaultmode, byemode, poulesmode, poulesbyemode;

      poulesmode = this.getProperty("poulesmode");
      poulesbyemode = this.getProperty("poulesbyeteams");

      drawmode = PoulesTables.MATCHES[poulesmode];
      if (!drawmode) {
        throw new Error("unknown draw mode: " + poulesmode);
      }

      defaultmode = drawmode.default;
      byemode = drawmode[poulesbyemode];

      if (!defaultmode) {
        throw new Error("draw mode has no default: " + poulesmode);
      }
      if (!byemode) {
        throw new Error("draw/bye mode combination has no byemode: " + poulesmode + " / " + poulesbyemode);
      }

      return {
        4: defaultmode,
        3: byemode
      };
    };

    PoulesTournamentModel.prototype.minPoules = function () {
      return Math.ceil(this.teams.length / 4);
    };

    PoulesTournamentModel.prototype.maxPoules = function () {
      return Math.floor(this.teams.length / 3);
    };

    PoulesTournamentModel.prototype.isByePoule = function (pouleID) {
      var numPoules, numByePoules;
      numPoules = this.numpoules.get();
      numByePoules = this.numbyepoules.get();

      switch (this.getProperty("poulesbyepoules")) {
        case PoulesTournamentModel.BYEPOULES.front:
          return pouleID >= 0 && pouleID < numByePoules;
        case PoulesTournamentModel.BYEPOULES.back:
          return pouleID < numPoules && pouleID >= (numPoules - numByePoules);
      }

      throw new Error("unknown poulebyepoules value: " + this.getProperty("poulesbyepoules"));
    };

    PoulesTournamentModel.prototype.getInternalTeamIDs = function () {
      return this.teams.map(function (externalID, internalID) {
        return internalID;
      });
    };

    PoulesTournamentModel.prototype.createGroups = function () {
      switch (this.getProperty("poulesseed")) {
        case PoulesTournamentModel.SEED.order:
          return this.createGroupsOrder();
        case PoulesTournamentModel.SEED.quarters:
          return this.createGroupsQuarters();
        case PoulesTournamentModel.SEED.heads:
          return this.createGroupsHeads();
        case PoulesTournamentModel.SEED.random:
          return this.createGroupsRandom();
        default:
          throw new Error(
            "Unsupported seed mode: " + this.getProperty("poulesseed")
          );
      }
    };

    PoulesTournamentModel.prototype.createEmptyPoules = function () {
      var poules = [];

      while (poules.length < this.numpoules.get()) {
        poules.push([]);
      }

      return poules;
    };

    PoulesTournamentModel.prototype.createGroupsOrder = function () {
      var groups, teams;

      groups = this.createEmptyPoules();
      teams = this.getInternalTeamIDs();

      return groups.map(function (group, groupID) {
        if (this.isByePoule(groupID)) {
          return teams.splice(0, 3);
        } else {
          return teams.splice(0, 4);
        }
      }, this);
    };

    PoulesTournamentModel.prototype.createGroupsQuarters = function () {
      var groups, teams;

      groups = this.createEmptyPoules();
      teams = this.getInternalTeamIDs();

      teams.forEach(function (teamID) {
        var groupID = teamID % this.numpoules.get();
        groups[groupID].push(teamID);
      }, this);

      return groups;
    };

    PoulesTournamentModel.prototype.createGroupsHeads = function () {
      var groups, left, heads;

      groups = this.createEmptyPoules();
      left = this.getInternalTeamIDs();

      heads = left.splice(0, this.numpoules.get());

      groups.forEach(function (group, groupID) {
        group.push(heads[groupID]);
        group.push(rng.pickAndRemove(left));
        group.push(rng.pickAndRemove(left));
        if (!this.isByePoule(groupID)) {
          group.push(rng.pickAndRemove(left));
        }
      }, this);

      return groups;
    };

    PoulesTournamentModel.prototype.createGroupsRandom = function () {
      var groups, left;

      groups = this.createEmptyPoules();
      left = this.getInternalTeamIDs();

      groups.forEach(function (group, groupID) {
        group.push(rng.pickAndRemove(left));
        group.push(rng.pickAndRemove(left));
        group.push(rng.pickAndRemove(left));
        if (!this.isByePoule(groupID)) {
          group.push(rng.pickAndRemove(left));
        }
      }, this);

      return groups;
    };

    PoulesTournamentModel.prototype.postprocessMatch = function (matchresult) {
      var winner, loser;

      if (matchresult.score[0] > matchresult.score[1]) {
        winner = matchresult.teams[0];
        loser = matchresult.teams[1];
      } else if (matchresult.score[0] < matchresult.score[1]) {
        winner = matchresult.teams[1];
        loser = matchresult.teams[0];
      }

      switch (matchresult.id) {
        case 0:
        case 1:
          this.matches.map(function (match) {
            if (match.group === matchresult.group) {
              if (match.id === 2) {
                match.teams[matchresult.id] = winner;
                match.emit("update");
              } else if (match.id === 3) {
                match.teams[matchresult.id] = loser;
                match.emit("update");
              }
            }
          });

          break;
        case 2:
        case 3:
          break;
      }

      if (this.matches.length === 0) {
        this.state.set("finished");
      }
    };

    PoulesTournamentModel.prototype.destroy = function () {
      this.numbyepoules.destroy();
      this.numpoules.destroy();

      PoulesTournamentModel.superclass.destroy.call(this);
    };

    PoulesTournamentModel.prototype.save = function () {
      var data = PoulesTournamentModel.superclass.save.call(this);

      data.numpoules = this.numpoules.get();

      return data;
    };

    PoulesTournamentModel.prototype.restore = function (data) {
      if (!PoulesTournamentModel.superclass.restore.call(this, data)) {
        return false;
      }

      this.numpoules.set(data.numpoules);

      return true;
    };

    PoulesTournamentModel.prototype.SAVEFORMAT = Object.create(
      PoulesTournamentModel.superclass.SAVEFORMAT
    );
    PoulesTournamentModel.prototype.SAVEFORMAT.numpoules = Number;


    return PoulesTournamentModel;
  });