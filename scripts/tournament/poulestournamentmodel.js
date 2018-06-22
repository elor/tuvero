define(
  [
    "lib/extend",
    "tournament/tournamentmodel",
    "tournament/ressources/poulestables",
    "core/matchmodel",
    "presets",
    "core/random",
    "core/valuemodel"
  ],
  function (extend, TournamentModel, PoulesTables, MatchModel, Presets, Random, ValueModel) {
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
      var groups;

      groups = this.createGroups();

      groups.forEach(function (group, groupID) {
        switch (group.length) {
          case 4:
            this.matches.push(new MatchModel([group[0], group[2]], 0, groupID));
            this.matches.push(new MatchModel([group[1], group[3]], 1, groupID));

            this.matches.push(
              new MatchModel([undefined, undefined], 2, groupID)
            );
            this.matches.push(
              new MatchModel([undefined, undefined], 3, groupID)
            );

            this.matches.push(
              new MatchModel([undefined, undefined], 4, groupID)
            );
            break;
          default:
            throw "Poules is only supported for groups of size 3 and 4 at the moment";
        }
      }, this);

      return true;
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