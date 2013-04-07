define(
    [ './team', './toast', './strings', './swiss' ],
    function (Team, Toast, Strings, Swiss) {
      var Tab_Ranking;

      Tab_Ranking = {};

      $(function ($) {
        var $tpl, $fields, $anchor, shown, autoupdate, update, $box, $txt, $button, $ctpl, $cspans, $corrections, $cnos;

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
        };

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
        $txt = $('#ranking .options .autoupdatetext');
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

        $txt.click(function () {
          $box.click();
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
        $corrections = $('#ranking .corrections');
        $ctpl = $corrections.find('.corr.tpl');
        $ctpl.detach();
        $ctpl.removeClass('tpl');
        $cspans = $ctpl.find('span');
        $cnos = $ctpl.find('.name');

        /**
         * retrieves the corrections and displays them in the correction table
         */
        // TODO manage corrections using the game history
        Tab_Ranking.showCorrections = function () {
          var corrs, makeline;

          corrs = Swiss.getCorrections();

          if (corrs === undefined || corrs.length === 0) {
            $corrections.hide();
            return;
          }

          makeline = function (corr) {
            var tid;

            tid = corr.game.teams[0][0];
            $($cnos[0]).text(tid);

            tid = corr.game.teams[1][0];
            $($cnos[1]).text(tid);

            $($cspans[0]).text(corr.oldpoints[0]);
            $($cspans[1]).text(corr.oldpoints[1]);

            $($cspans[2]).text(corr.newpoints[0]);
            $($cspans[3]).text(corr.newpoints[1]);

            return $tpl.clone();
          };

          corrs.forEach(function (corr) {
            $corrections.append(makeline(corr));
          });

          $corrections.show();
        };
        
        // hide all corrections initially
        Tab_Ranking.showCorrections();

      });

      return Tab_Ranking;
    });
