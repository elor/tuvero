define([ './team', './toast', './strings', './swiss', './options',
    './tabshandle' ], function (Team, Toast, Strings, Swiss, Options, Tabshandle) {
  var Tab_Ranking, $ctpl, $cpts, $corrections, $cnos;

  Tab_Ranking = {};

  $(function ($) {
    var $tpl, $fields, $anchor, shown, autoupdate, update, $box, $button, i;

    autoupdate = false;

    // whether a ranking has been calculated and displayed
    shown = false;

    // prepare template
    $tpl = $('#ranking table .line.tpl');
    $fields = $tpl.find('td').map(function () {
      return $(this);
    });
    $tpl.detach();
    $tpl.removeClass('tpl');
    $anchor = $('#ranking table .head');

    $('th:nth-child(3)').attr('colspan', Options.teamsize);

    for (i = 0; i < Options.maxteamsize; i += 1) {
      if (i < Options.teamsize) {
        $fields[i + 2] && $fields[i + 2].css('display', '');
      } else {
        $fields[i + 2] && $fields[i + 2].css('display', 'none');
      }
    }

    Tab_Ranking.reset = function () {
      $('#ranking table .line').remove();
      clearCorrections();
    };

    /**
     * @returns {boolean} false on failure, true on success
     */
    update = function () {
      var ranking, makeline, rank, votes, empty;

      empty = true;

      if (Swiss.getRound() <= 0) {
        Tabshandle.hide('ranking');
        return false;
      }

      Tab_Ranking.reset();

      ranking = Swiss.getRanking();
      votes = Swiss.getAllVotes();

      /**
       * fill template and return copy
       * 
       * @param rnk
       *          rank of the team for which to create the line. starting at 0
       * @returns a filled copy of the template
       */
      makeline = function (rnk) {
        var tid, team, vote, i;

        tid = ranking.ids[rnk];
        team = Team.get(tid);

        $fields[0].text(rnk + 1);

        $fields[1].text(team.id + 1);
        for (i = 0; i < Options.teamsize; i += 1) {
          $fields[i + 2].text(team.names[i]);
        }

        $fields[5].text(ranking.wins[rnk]);
        $fields[6].text(ranking.bh[rnk]);
        $fields[7].text(ranking.fbh[rnk]);
        $fields[8].text(ranking.netto[rnk]);

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

        $fields[9].text(vote.join(', '));

        return $tpl.clone();
      };

      for (rank = ranking.ids.length - 1; rank >= 0; rank -= 1) {
        $anchor.after(makeline(rank));
        empty = false;
      }

      if (!shown) {
        $('#ranking .preparing').hide();
        shown = true;
      }

      showCorrections();

      if (empty) {
        Tabshandle.hide('ranking');
      } else {
        Tabshandle.show('ranking');
      }

      return true;
    };

    Tab_Ranking.update = function () {
      if (autoupdate) {
        if (update() === true) {
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
      if (update() === true) {
        new Toast(Strings.rankingupdate);
      }
    });

    /**
     * removes all correction DOM nodes
     */
    function clearCorrections () {
      $('#ranking .corrections .corr').remove();
    }

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
    function showCorrections () {
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
    }

    // hide all corrections initially
    showCorrections();

    // show corrections for the first time (avoids flashing)
    $('#ranking .corrections').removeClass('tpl');

    Tabshandle.hide('ranking');
  });

  return Tab_Ranking;
});
