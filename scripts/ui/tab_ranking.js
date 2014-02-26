define(
    [ './team', './toast', './strings', './swiss' ],
    function (Team, Toast, Strings, Swiss) {
      var Tab_Ranking, $ctpl, $cpts, $corrections, $cnos;

      Tab_Ranking = {};

      $(function ($) {
        var $tpl, $fields, $anchor, shown, autoupdate, update, $box, $button;

        autoupdate = false;

        // whether a ranking has been calculated and displayed
        shown = false;

        // prepare template
        $tpl = $('#ranking table .line.tpl');
        $fields = $tpl.find('td');
        $tpl.detach();
        $tpl.removeClass('tpl');
        $anchor = $('#ranking table .head');

        Tab_Ranking.clear = function () {
          $('#ranking table .line').remove();
          Tab_Ranking.clearCorrections();
        };

        /**
         * @returns {boolean} undefined on failure, true on success
         */
        update = function () {
          var ranking, makeline, rank;

          if (Swiss.getRound() <= 0) {
            return undefined;
          }

          Tab_Ranking.clear();

          ranking = Swiss.getRanking();
          votes = Swiss.getAllVotes();

          /**
           * fill template and return copy
           * 
           * @param rank
           *          rank of the team for which to create the line. starting at
           *          0
           * @returns a filled copy of the template
           */
          makeline = function (rank) {
            var tid, team, vote;

            tid = ranking.ids[rank];
            team = Team.get(tid);

            $($fields[0]).text(rank + 1);

            $($fields[1]).text(team.id + 1);
            $($fields[2]).text(team.names[0]);
            $($fields[3]).text(team.names[1]);
            $($fields[4]).text(team.names[2]);

            $($fields[5]).text(ranking.wins[rank]);
            $($fields[6]).text(ranking.bh[rank]);
            $($fields[7]).text(ranking.fbh[rank]);
            $($fields[8]).text(ranking.netto[rank]);

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

            $($fields[9]).text(vote.join(', '));

            return $tpl.clone();
          };

          for (rank = ranking.ids.length - 1; rank >= 0; rank -= 1) {
            $anchor.after(makeline(rank));
          }

          if (!shown) {
            $('#ranking .preparing').hide();
            shown = true;
          }

          Tab_Ranking.showCorrections();

          return true;
        };

        Tab_Ranking.update = function () {
          if (autoupdate) {
            if (update()) {
              // new Toast(Strings.rankingupdate);
            }
          }
        };

        $box = $('#ranking .options .autoupdate');
        $button = $('#ranking .options button.update');

        autoupdate = !!$box.prop('checked');

        $box.click(function () {
          autoupdate = !!$box.prop('checked');
          if (autoupdate) {
            new Toast(Strings.autoupdateon);
            $button.click();
          } else {
            new Toast(Strings.autoupdateoff);
          }
        });

        // update button
        $button.click(function () {
          if (update()) {
            new Toast(Strings.rankingupdate);
          }
        });

        /**
         * removes all correction DOM nodes
         */
        Tab_Ranking.clearCorrections = function () {
          $('#ranking .corrections .corr').remove();
        };

        // prepare nodes
        $corrections = $('#ranking .corrections > table');
        $ctpl = $corrections.find('.corr.tpl');
        $ctpl.detach();
        $ctpl.removeClass('tpl');
        $cpts = $ctpl.find('.points span');
        $cnos = $ctpl.find('.teamno');

        /**
         * retrieves the corrections and displays them in the correction table
         */
        Tab_Ranking.showCorrections = function () {
          var corrs, makeline;

          corrs = Swiss.getCorrections();

          if (corrs === undefined || corrs.length === 0) {
            $corrections.parent().hide();
            return;
          }

          makeline = function (corr) {
            var tid;

            tid = corr.game.teams[0][0];
            $($cnos[0]).text(tid + 1);

            tid = corr.game.teams[1][0];
            $($cnos[1]).text(tid + 1);

            $($cpts[0]).text(corr.oldpoints[0]);
            $($cpts[1]).text(corr.oldpoints[1]);

            $($cpts[2]).text(corr.newpoints[0]);
            $($cpts[3]).text(corr.newpoints[1]);

            return $ctpl.clone();
          };

          corrs.forEach(function (corr) {
            $corrections.append(makeline(corr));
          });

          $corrections.parent().show();
        };

        // hide all corrections initially
        Tab_Ranking.showCorrections();

        /**
         * converts ranking and correction information to a csv string
         */
        Tab_Ranking.toCSV = function () {
          var lines, ranking, votes, rank, length, corrs;

          if (Swiss.getRound() <= 0) {
            return '';
          }

          lines = [ 'Rang,Team,Spieler 1,Spieler 2,Spieler 3,Siege,BH,FBH,Netto,Lose' ];

          ranking = Swiss.getRanking();
          votes = Swiss.getAllVotes();

          makeline = function (rank) {
            var line, tid, team, vote;

            line = [];

            tid = ranking.ids[rank];
            team = Team.get(tid);

            line.push(rank + 1);

            line.push(team.id + 1);
            line.push('"' + team.names[0].replace(/"/g, '""') + '"');
            line.push('"' + team.names[1].replace(/"/g, '""') + '"');
            line.push('"' + team.names[2].replace(/"/g, '""') + '"');

            line.push(ranking.wins[rank]);
            line.push(ranking.bh[rank]);
            line.push(ranking.fbh[rank]);
            line.push(ranking.netto[rank]);

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
            lines
                .push('Team 1,Team 2,Fehler 1,Fehler 1,Korrektur 1,Korrektur 2');

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
        };

        // show corrections for the first time (avoids flashing)
        $('#ranking .corrections').removeClass('tpl');
      });

      return Tab_Ranking;
    });
