define([ './tournaments', './team', './toast', './strings', './options',
    './tabshandle', './opts' ], function (Tournaments, Team, Toast, Strings, Options, Tabshandle, Opts) {
  var Tab_Ranking, template, $tab, options, updatepending;

  updatepending = false;

  Tab_Ranking = {};
  options = {};

  function initTemplate () {
    var i, tmp;

    template = {};

    template.$box = $tab.find('div.box.tpl');
    template.$box.detach();
    template.$box.removeClass('tpl');

    template.$boxname = template.$box.find('>h3');

    // ranking table
    template.rank = {};

    template.rank.$table = template.$box.find('table.ranking');

    template.rank.$row = template.rank.$table.find('.line');
    template.rank.$row.detach();

    tmp = template.rank.$row.find('td');
    template.rank.$fields = [];
    for (i = 0; i < tmp.length; i += 1) {
      template.rank.$fields[i] = tmp.eq(i);
    }

    // corrections
    template.correction = {};

    template.correction.$container = template.$box.find('.corrections');
    template.correction.$container.detach();

    template.correction.$correction = template.correction.$container.find('.corr');
    template.correction.$correction.detach();

    template.correction.$points = [];
    tmp = template.correction.$correction.find('.points span');
    for (i = 0; i < tmp.length; i += 1) {
      template.correction.$points[i] = tmp.eq(i);
    }
    template.correction.$teamnos = [];
    tmp = template.correction.$correction.find('.teamno');
    for (i = 0; i < tmp.length; i += 1) {
      template.correction.$teamnos[i] = tmp.eq(i);
    }

    updateTemplate();
  }

  function updateTemplate () {
    var i;
    // adjust number of columns to the teamsize
    template.rank.$table.find('th:nth-child(3)').attr('colspan', Options.teamsize);

    // hide unimportant columns
    for (i = 0; i < Options.maxteamsize; i += 1) {
      if (i < Options.teamsize) {
        template.rank.$fields[i + 2] && template.rank.$fields[i + 2].css('display', '');
      } else {
        template.rank.$fields[i + 2] && template.rank.$fields[i + 2].css('display', 'none');
      }
    }
  }

  function init () {
    if ($tab) {
      console.error('tab_ranking: $tab already exists:');
      console.error($tab);
      return;
    }

    $tab = $('#ranking');

    initTemplate();

    // TODO reload within ranking tab?
    // Tabshandle.hide('ranking');
  }

  /**
   * fill template and return copy
   * 
   * @param rank
   *          rank of the team for which to create the line. starting at 0
   * @param ranking
   *          a valid ranking object
   * @param votes
   *          a valid votes object
   * @returns a filled copy of the template
   */
  function createRankRow (rank, ranking) {
    var tid, team, vote, i;

    tid = ranking.ids[rank];
    team = Team.get(tid);

    template.rank.$fields[0].text(rank + 1);

    template.rank.$fields[1].text(team.id + 1);
    for (i = 0; i < Options.teamsize; i += 1) {
      template.rank.$fields[i + 2].text(team.names[i]);
    }

    template.rank.$fields[5].text(ranking.games[rank]);

    template.rank.$fields[6].text(ranking.wins[rank]);
    template.rank.$fields[7].text(ranking.buchholz[rank]);
    template.rank.$fields[8].text(ranking.finebuchholz[rank]);
    template.rank.$fields[9].text(ranking.netto[rank]);

    vote = [];
    for (i = 0; i < ranking.upvote[rank]; ++i) {
      vote.push(Strings.upvote);
    }
    for (i = 0; i < ranking.downvote[rank]; ++i) {
      vote.push(Strings.downvote);
    }
    for (i = 0; i < ranking.byevote[rank]; ++i) {
      vote.push(Strings.byevote);
    }

    template.rank.$fields[10].text(vote.join(''));

    return template.rank.$row.clone();
  }

  /**
   * @returns {boolean} false on failure, true on success
   */
  function showRanking (Tournament, $box) {
    var ranking, rank, $container, notempty;

    $container = template.rank.$table.clone();

    if (Tournament.getRanking().round <= 0) {
      Tabshandle.hide('ranking');
      return false;
    }

    ranking = Tournament.getRanking();

    for (rank = 0; rank < ranking.ids.length; rank += 1) {
      $container.append(createRankRow(rank, ranking));
    }

    notempty = ranking.ids.length > 0;

    if (notempty) {
      $box.append($container);
    }

    return notempty;
  }

  /**
   * retrieves the corrections and displays them in the correction table
   */
  function showCorrections (Tournament, $box) {
    var corrections, empty, $container, $table;

    empty = true;

    corrections = Tournament.getCorrections();

    if (corrections === undefined || corrections.length === 0) {
      return false;
    }

    $container = template.correction.$container.clone();
    $table = $container.find('.correctionstable');

    corrections.forEach(function (correction) {
      var tid;

      tid = correction.game.teams[0][0];
      template.correction.$teamnos[0].text(tid + 1);

      tid = correction.game.teams[1][0];
      template.correction.$teamnos[1].text(tid + 1);

      template.correction.$points[0].text(correction.oldpoints[0]);
      template.correction.$points[1].text(correction.oldpoints[1]);

      template.correction.$points[2].text(correction.newpoints[0]);
      template.correction.$points[3].text(correction.newpoints[1]);

      $table.append(template.correction.$correction.clone());

      empty = false;
    });

    if (!empty) {
      $box.append($container);
    }

    return !empty;
  }

  Tab_Ranking.reset = function () {
    if (!$tab) {
      init();
    }

    // delete everything, i.e. the wrapping box
    $tab.find('.box').remove();

    // update template to the team size
    updateTemplate();
  };

  function updateTournamentRankings () {
    var hidden, tournamentid, tournament, keepbox, $box;

    hidden = true;

    Tab_Ranking.reset();

    for (tournamentid = 0; tournamentid < Tournaments.size(); tournamentid += 1) {

      // skip finished tournaments
      // TODO print past rankings!
      if (!Tournaments.isRunning) {
        continue;
      }

      tournament = Tournaments.getTournament(tournamentid);

      keepbox = false;

      template.$boxname.text(Tournaments.getName(tournamentid));
      $box = template.$box.clone();

      if (showRanking(tournament, $box)) {
        hidden = false;
        keepbox = true;
      }

      if (showCorrections(tournament, $box)) {
        hidden = false;
        keepbox = true;
      }

      if (keepbox) {
        $tab.append($box);
      }
    }

    if (hidden) {
      Tabshandle.hide('ranking');
    } else {
      Tabshandle.show('ranking');
    }

  }

  Tab_Ranking.update = function () {
    if (updatepending) {
      console.log('updatepending');
    } else {
      updatepending = true;
      window.setTimeout(function () {
        if (updateTournamentRankings() === true) {
          // new Toast(Strings.rankingupdate);
        }
        updatepending = false;
        console.log('update');
      }, 1);
    }
  };

  Tab_Ranking.getOptions = function () {
    return Opts.getOptions({
      options : options
    });
  };

  Tab_Ranking.setOptions = function (opts) {
    return Opts.setOptions({
      options : options
    }, opts);
  };

  return Tab_Ranking;
});
