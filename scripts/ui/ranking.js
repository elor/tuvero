/**
 * wrapper around the tournament ranking
 */

// TODO show past rankings, too
define([ './team', './strings', './options', './tournaments' ], function (Team, Strings, Options, Tournaments) {
  var Ranking;

  Ranking = {
    /**
     * converts ranking and correction information to a csv string
     */
    toCSV : function () {
      var lines, ranking, rank, length, corrs, makeline, i, tournamentid, retval, tournament;

      retval = [];

      for (tournamentid = 0; tournamentid < Tournaments.numTournaments(); tournamentid += 1) {

        // is it finished?
        if (!Tournaments.isRunning(tournamentid)) {
          continue;
        }

        tournament = Tournaments.getTournament(tournamentid);
        name = Tournaments.getName(tournamentid);

        // has it started?
        if (tournament.getRanking().round <= 0) {
          continue;
        }

        lines = [ Tournaments.getName(tournamentid) ];
        lines.push(Strings['rankhead' + Options.teamsize]);

        ranking = tournament.getRanking();

        makeline = function (rnk) {
          var line, tid, team, vote, i;

          line = [];

          tid = ranking.ids[rnk];
          team = Team.get(tid);

          line.push(rnk + 1);

          line.push(team.id + 1);
          for (i = 0; i < Options.teamsize; i += 1) {
            if (team.names[i]) {
              line.push('"' + team.names[i].replace(/"/g, '""') + '"');
            } else {
              line.push('"%% %%"');
            }
          }

          line.push(ranking.wins[rnk]);
          line.push(ranking.buchholz[rnk]);
          line.push(ranking.finebuchholz[rnk]);
          line.push(ranking.netto[rnk]);

          vote = [];
          if (ranking.roundupvote[rnk]) {
            vote.push(Strings.upvote);
          }
          if (ranking.rounddownvote[rnk]) {
            vote.push(Strings.downvote);
          }
          if (ranking.roundbyevote[rnk]) {
            vote.push(Strings.byevote);
          }

          line.push('"' + vote.join(',') + '"');

          return line.join(',');
        };

        length = ranking.ids.length;

        for (rank = 0; rank < length; rank += 1) {
          lines.push(makeline(rank));
        }

        corrs = Swiss().getCorrections();

        if (corrs !== undefined && corrs.length !== 0) {
          lines.push('');
          lines.push(Strings.correctionhead);

          makeline = function (corr) {
            var tid, line;

            line = [];

            tid = corr.game.teams[0][0];
            line.push(tid + 1);

            tid = corr.game.teams[1][0];
            line.push(tid + 1);

            line.push(corr.oldpoints[0]);
            line.push(corr.oldpoints[1]);

            line.push(corr.newpoints[0]);
            line.push(corr.newpoints[1]);

            return line.join(',');
          };

          corrs.forEach(function (corr) {
            lines.push(makeline(corr));
          });
        }

        retval.push(lines.join('\r\n'));
      }
      return retval.join('\r\n\r\n');
    }
  };

  return Ranking;
});