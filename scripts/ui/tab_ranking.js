define([ './tournaments', './team', './toast', './strings', './options',
    './tabshandle', './opts', './history' ], function (Tournaments, Team, Toast, Strings, Options, Tabshandle, Opts, History) {
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
    template.rank.$table.detach();

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

    template.rank.$fields[0].text(ranking.place[rank] + 1);

    template.rank.$fields[1].text(team.id + 1);
    for (i = 0; i < Options.teamsize; i += 1) {
      template.rank.$fields[i + 2].text(team.names[i]);
    }

    template.rank.$fields[5].text(ranking.games ? ranking.games[rank] : '');

    template.rank.$fields[6].text(ranking.wins ? ranking.wins[rank] : '');
    template.rank.$fields[7].text(ranking.buchholz ? ranking.buchholz[rank] : '');
    template.rank.$fields[8].text(ranking.finebuchholz ? ranking.finebuchholz[rank] : '');
    template.rank.$fields[9].text(ranking.netto ? ranking.netto[rank] : '');

    vote = [];
    if (ranking.upvote) {
      for (i = 0; i < ranking.upvote[rank]; ++i) {
        vote.push(Strings.upvote);
      }
    }
    if (ranking.downvote) {
      for (i = 0; i < ranking.downvote[rank]; ++i) {
        vote.push(Strings.downvote);
      }
    }
    if (ranking.byevote) {
      for (i = 0; i < ranking.byevote[rank]; ++i) {
        vote.push(Strings.byevote);
      }
    }

    template.rank.$fields[10].text(vote.join(''));

    return template.rank.$row.clone();
  }

  /**
   * @returns {boolean} false on failure, true on success
   */
  function showRanking (tournamentid, $box) {
    var ranking, rank, $container, notempty;

    $container = template.rank.$table.clone();

    ranking = Tournaments.getRanking(tournamentid);

    if (ranking.round <= 0) {
      return false;
    }

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
  function showCorrections (tournamentid, $box) {
    var corrections, empty, $container, $table;

    empty = true;

    corrections = History.getCorrections(tournamentid);

    if (corrections === undefined || corrections.length === 0) {
      return false;
    }

    $container = template.correction.$container.clone();
    $table = $container.find('.correctionstable');

    corrections.forEach(function (correction) {
      var tid;

      tid = correction[0][0];
      template.correction.$teamnos[0].text(tid + 1);

      tid = correction[0][1];
      template.correction.$teamnos[1].text(tid + 1);

      template.correction.$points[0].text(correction[0][2]);
      template.correction.$points[1].text(correction[0][3]);

      template.correction.$points[2].text(correction[1][2]);
      template.correction.$points[3].text(correction[1][3]);

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
    var hidden, tournamentid, keepbox, $box;

    hidden = true;

    Tab_Ranking.reset();

    for (tournamentid = 0; tournamentid < Tournaments.numTournaments(); tournamentid += 1) {

      // skip finished tournaments
      // TODO print past rankings!
      if (!Tournaments.isRunning) {
        continue;
      }

      keepbox = false;

      template.$boxname.text(Tournaments.getName(tournamentid));
      $box = template.$box.clone();

      if (showRanking(tournamentid, $box)) {
        hidden = false;
        keepbox = true;
      }

      if (showCorrections(tournamentid, $box)) {
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

  Tab_Ranking.update = function (force) {

    if (force) {
      updatepending = false;
    }

    if (updatepending) {
      console.log('updatepending');
    } else {
      updatepending = true;
      window.setTimeout(function () {
        try {
          if (updateTournamentRankings() === true) {
            // new Toast(Strings.rankingupdate);
          }
          console.log('update');
        } catch (er) {
          console.log(er);
          new Toast(Strings.tabupdateerror.replace('%s', strings.tab_ranking));
        }
        updatepending = false;
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
