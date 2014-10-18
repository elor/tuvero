/**
 * wrapper around the tournament ranking
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ './team', './strings', './options', './tournaments' ], function (Team, Strings, Options, Tournaments) {
  var Ranking;

  Ranking = {
    /**
     * converts ranking and correction information to a csv string
     */
    toCSV : function () {
      var lines, ranking, rank, length, corrs, makeline, i, tournamentid, tournament;

      lines = [];

      for (tournamentid = 0; tournamentid < Tournaments.numTournaments(); tournamentid += 1) {

        tournament = Tournaments.getTournament(tournamentid);
        name = Tournaments.getName(tournamentid);

        ranking = Tournaments.getRanking(tournamentid);

        // has it started?
        if (ranking.round <= 0) {
          continue;
        }

        lines.push('#' + Tournaments.getName(tournamentid) + ' Ranking,');
        lines.push(Strings['rankhead' + Options.teamsize]);

        makeline = function (rnk) {
          var line, tid, team, vote, i;

          line = [];

          tid = ranking.ids[rnk];
          team = Team.get(tid);

          line.push(ranking.place[rnk] + 1);

          line.push(team.id + 1);
          for (i = 0; i < Options.teamsize; i += 1) {
            if (team.names[i]) {
              line.push('"' + team.names[i].replace(/"/g, '""') + '"');
            } else {
              line.push('"%% %%"');
            }
          }

          line.push(ranking.wins ? ranking.wins[rnk] : '""');
          line.push(ranking.buchholz ? ranking.buchholz[rnk] : '""');
          line.push(ranking.finebuchholz ? ranking.finebuchholz[rnk] : '""');
          line.push(ranking.netto ? ranking.netto[rnk] : '""');

          vote = [];
          if (ranking.roundupvote && ranking.roundupvote[rnk]) {
            vote.push(Strings.upvote);
          }
          if (ranking.rounddownvote && ranking.rounddownvote[rnk]) {
            vote.push(Strings.downvote);
          }
          if (ranking.roundbyevote && ranking.roundbyevote[rnk]) {
            vote.push(Strings.byevote);
          }

          line.push('"' + vote.join(',') + '"');

          return line.join(',');
        };

        length = ranking.ids.length;

        for (rank = 0; rank < length; rank += 1) {
          lines.push(makeline(rank));
        }

        corrs = tournament ? tournament.getCorrections() : undefined;

        if (corrs !== undefined && corrs.length !== 0) {
          lines.push('#' + Tournaments.getName(tournamentid) + ' Korrekturen,');
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
      }
      return lines.join('\r\n');
    }
  };

  return Ranking;
});