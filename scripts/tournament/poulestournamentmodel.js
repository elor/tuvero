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

    function getTeamIDFromWho(result, who) {
      switch (who) {
        case "winner":
          return result.getWinner();
        case "loser":
          return result.getLoser();
      }

      throw new Error("unknown 'who': " + who);
    }

    function PoulesTournamentModel() {
      PoulesTournamentModel.superconstructor.call(this, ["wins"]);

      this.setProperty("poulesmode", (Presets.systems.poules && Presets.systems.poules.mode) || PoulesTournamentModel.MODES.barrage);
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

      this.groups = [];
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
      var drawtables;

      this.groups = this.createGroups();
      drawtables = this.getDrawTables();

      this.groups.forEach(function (group, groupID) {
        var draws = drawtables[group.length];

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

    PoulesTournamentModel.prototype.postprocessMatch = function (matchresult) {
      this.checkForFollowupMatches(matchresult);

      if (this.matches.length === 0) {
        this.state.set("finished");
      }
    };

    PoulesTournamentModel.prototype.findMatch = function (matchID, groupID) {
      var searchResult;

      searchResult = this.matches.asArray().filter(function (match) {
        return groupID === match.getGroup() && matchID === match.getID();
      });

      switch (searchResult.length) {
        case 0:
          return undefined;
        case 1:
          return searchResult[0];
      }

      throw new Error("Duplicate Match. ID/Group: " + matchID + "/" + groupID);
    };

    PoulesTournamentModel.prototype.getDependentDraws = function (matchID, groupID, who) {
      var groupSize, draws, drawsindexed;

      groupSize = this.groups[groupID].length;
      draws = this.getDrawTables()[groupSize];

      if (!draws) {
        throw new Error("no matching draw table found. group size: " + groupSize);
      }

      drawsindexed = draws.map(function (draw, index) {
        return {
          draw: draw,
          drawindex: index,
          teamindex: draw.map(function (team, teamindex) {
            return team.from === matchID && team.who === who ? teamindex : undefined;
          }).filter(function (value) {
            return value !== undefined;
          })[0]
        };
      });

      return drawsindexed.filter(function (draw) {
        return draw.teamindex !== undefined;
      });
    };

    PoulesTournamentModel.prototype.checkForFollowupMatches = function (result) {
      this.checkFollowupMatch(result, "winner");
      this.checkFollowupMatch(result, "loser");
    };

    PoulesTournamentModel.prototype.checkFollowupMatch = function (result, who) {
      var dependencies, groupID, teamID;

      teamID = getTeamIDFromWho(result, who);
      groupID = result.getGroup();

      dependencies = this.getDependentDraws(result.getID(), groupID, who);

      dependencies.forEach(function (dependency) {
        var match = this.findMatch(dependency.drawindex, groupID);

        if (match) {
          this.createFollowupMatch(match, dependency, teamID);
        }
      }, this);
    };

    PoulesTournamentModel.prototype.createFollowupMatch = function (match, dependencyDraw, teamID) {
      var groupID, matchID;

      matchID = match.getID();
      groupID = match.getGroup();

      switch (dependencyDraw.draw.length) {
        case 2:
          match.teams[dependencyDraw.teamindex] = teamID;
          this.matches.insert(this.matches.indexOf(match), new MatchModel(match.teams, matchID, groupID));
          this.matches.erase(match);
          break;
        case 1:
          this.matches.erase(match);
          this.addBye(teamID, matchID, groupID);
          break;
        default:
          throw new Error("invalid number of teams in PoulesTable draw definition: " + dependencyDraw);
      }
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

    PoulesTournamentModel.prototype.destroy = function () {
      this.numbyepoules.destroy();
      this.numpoules.destroy();

      PoulesTournamentModel.superclass.destroy.call(this);
    };

    PoulesTournamentModel.prototype.save = function () {
      var data = PoulesTournamentModel.superclass.save.call(this);

      data.numpoules = this.numpoules.get();
      data.groups = this.groups.slice();

      return data;
    };

    PoulesTournamentModel.prototype.restore = function (data) {
      if (!PoulesTournamentModel.superclass.restore.call(this, data)) {
        return false;
      }

      this.numpoules.set(data.numpoules);
      this.groups = data.groups.slice();

      return true;
    };

    PoulesTournamentModel.prototype.SAVEFORMAT = Object.create(
      PoulesTournamentModel.superclass.SAVEFORMAT
    );
    PoulesTournamentModel.prototype.SAVEFORMAT.numpoules = Number;
    PoulesTournamentModel.prototype.SAVEFORMAT.groups = [
      [Number]
    ];


    return PoulesTournamentModel;
  });