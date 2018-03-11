define(['lib/extend', 'tournament/tournamentmodel', 'core/matchmodel', 'core/byeresult',
  'options', 'core/type'], function (extend, TournamentModel, MatchModel,
    ByeResult, Options, Type) {

    function PoulesTournamentModel() {
      PoulesTournamentModel.superconstructor.call(this, ['wins']);
      this.poules = 0;
    }
    extend(PoulesTournamentModel, TournamentModel);

    PoulesTournamentModel.prototype.SYSTEM = 'poules';

    PoulesTournamentModel.prototype.initialMatches = function () {
      var groupID, teams, groups;
      this.poules = Math.ceil(this.teams.length / 4);

      groups = [];
      while (groups.length < this.poules) {
        groupID = groups.length;
        teams = [];
        while (teams.length * this.poules + groupID < this.teams.length) {
          teams.push(teams.length * this.poules + groupID);
        }
        groups.push(teams);
      }

      groups.forEach(function (group, groupID) {
        switch (group.length) {
          case 4:
            this.matches.push(new MatchModel([group[0], group[2]], 0, groupID));
            this.matches.push(new MatchModel([group[1], group[3]], 1, groupID));
            this.matches.push(new MatchModel([undefined, undefined], 2, groupID));
            this.matches.push(new MatchModel([undefined, undefined], 3, groupID));
            this.matches.push(new MatchModel([undefined, undefined], 4, groupID));
            break;
          default:
            throw "Poules is only supported for groups of size 3 and 4 at the moment";
        }
      }, this);

      return true;
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
                match.emit('update');
              } else if (match.id === 3) {
                match.teams[matchresult.id] = loser;
                match.emit('update');
              }
            }
          });

          break;
        case 2:
        case 3:
          break;
      }

      if (this.matches.length === 0) {
        this.state.set('finished');
      }
    };

    PoulesTournamentModel.prototype.numPoules = function () {
      return this.poules;
    };

    PoulesTournamentModel.prototype.save = function () {
      var data = PoulesTournamentModel.superclass.save.call(this);
      data.poules = this.poules;
      return data;
    };

    PoulesTournamentModel.prototype.restore = function (data) {
      if (!PoulesTournamentModel.superclass.restore.call(this, data)) {
        return false;
      }
      this.poules = data.poules;
      return true;
    };

    PoulesTournamentModel.prototype.SAVEFORMAT = Object
      .create(PoulesTournamentModel.superclass.SAVEFORMAT);
    PoulesTournamentModel.prototype.SAVEFORMAT.poules = Number;

    return PoulesTournamentModel;
  });
