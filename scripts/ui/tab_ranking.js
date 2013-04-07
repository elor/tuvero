define([ './team', './toast', './strings', './swiss' ], function (Team, Toast,
    Strings, Swiss) {
  var Tab_Ranking;

  Tab_Ranking = {};

  $(function ($) {
    var $tpl, $fields, $anchor, shown, autoupdate, update, $box, $txt, $button;

    autoupdate = false;

    // whether a ranking has been calculated and displayed
    shown = false;

    // prepare template
    $tpl = $('#ranking table .tpl');
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
       *          rank of the team for which to create the line. starting at 0
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

  });

  return Tab_Ranking;
});
