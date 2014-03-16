/**
 * wrapper around the tournament ranking
 * 
 * TODO: unit test TODO: interface test
 */

define([ './swiss', './team', './strings' ], function (Swiss, Team, Strings) {
  var Ranking;

  Ranking = {
    /**
     * converts ranking and correction information to a csv string
     */
    toCSV : function () {
      var lines, ranking, votes, rank, length, corrs, makeline;

      if (Swiss.getRound() <= 0) {
        return '';
      }

      lines = [ 'Rang,Team,Spieler 1,Spieler 2,Spieler 3,Siege,BH,FBH,Netto,Lose' ];

      ranking = Swiss.getRanking();
      votes = Swiss.getAllVotes();

      makeline = function (rnk) {
        var line, tid, team, vote;

        line = [];

        tid = ranking.ids[rnk];
        team = Team.get(tid);

        line.push(rnk + 1);

        line.push(team.id + 1);
        line.push('"' + team.names[0].replace(/"/g, '""') + '"');
        line.push('"' + team.names[1].replace(/"/g, '""') + '"');
        line.push('"' + team.names[2].replace(/"/g, '""') + '"');

        line.push(ranking.wins[rnk]);
        line.push(ranking.bh[rnk]);
        line.push(ranking.fbh[rnk]);
        line.push(ranking.netto[rnk]);

        vote = [];
        if (votes.up.indexOf(tid) !== -1) {
          vote.push(Strings.upvote);
        }
        if (votes.down.indexOf(tid) !== -1) {
          vote.push(Strings.downvote);
        }
        if (votes.bye.indexOf(tid) !== -1) {
          vote.push(Strings.byevote);
        }

        line.push('"' + vote.join(',') + '"');

        return line.join(',');
      };

      length = ranking.ids.length;

      for (rank = 0; rank < length; rank += 1) {
        lines.push(makeline(rank));
      }

      corrs = Swiss.getCorrections();

      if (corrs !== undefined && corrs.length !== 0) {
        lines.push('');
        lines.push('Team 1,Team 2,Fehler 1,Fehler 1,Korrektur 1,Korrektur 2');

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

      return lines.join('\r\n');
    }
  };

  return Ranking;
});