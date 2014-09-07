define([ './team', './toast', './strings', './swiss', './options',
    './tabshandle', './opts' ], function (Team, Toast, Strings, Swiss, Options, Tabshandle, Opts) {
  var Tab_Ranking, template, shown, $tab, options, updatepending;
  
  updatepending = false;

  Tab_Ranking = {};
  options = {};

  function initState () {
    // whether a ranking has been calculated and displayed
    // TODO use some kind of checksum
    shown = false;
  }

  function initRankRow () {
    var i, tmp;

    template = {};

    // ranks, i.e. table rows
    template.rank = {};

    template.rank.$row = $tab.find('table .line.tpl');
    template.rank.$row.detach();
    template.rank.$row.removeClass('tpl');

    tmp = template.rank.$row.find('td');
    template.rank.$fields = [];
    for (i = 0; i < tmp.length; i += 1) {
      template.rank.$fields[i] = tmp.eq(i);
    }
    template.rank.$anchor = $tab.find('table .head');

    // corrections
    template.correction = {};

    updateTemplate();
  }

  function updateTemplate () {
    var i;
    // adjust number of columns to the teamsize
    $tab.find('table th:nth-child(3)').attr('colspan', Options.teamsize);

    // hide unimportant columns
    for (i = 0; i < Options.maxteamsize; i += 1) {
      if (i < Options.teamsize) {
        template.rank.$fields[i + 2] && template.rank.$fields[i + 2].css('display', '');
      } else {
        template.rank.$fields[i + 2] && template.rank.$fields[i + 2].css('display', 'none');
      }
    }
  }

  function initCorrection () {
    var i, tmp;
    // prepare nodes

    template.correction.$correction = $tab.find('.corr.tpl');

    template.correction.$correction.detach();
    template.correction.$correction.removeClass('tpl');

    template.correction.$container = $tab.find('.corrections');
    template.correction.$anchor = $tab.find('.corrections > table');
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

    // hide all corrections initially
    showCorrections();
  }

  function init () {
    if ($tab) {
      console.error('tab_ranking: $tab already exists:');
      console.error($tab);
      return;
    }

    $tab = $('#ranking');

    initState();
    initRankRow();
    initCorrection();

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
  function showRanks () {
    var ranking, rank, empty;

    empty = true;

    if (Swiss().getRanking().round <= 0) {
      Tabshandle.hide('ranking');
      return false;
    }

    Tab_Ranking.reset();

    ranking = Swiss().getRanking();

    for (rank = ranking.ids.length - 1; rank >= 0; rank -= 1) {
      template.rank.$anchor.after(createRankRow(rank, ranking));
      empty = false;
    }

    if (!shown) {
      // TODO move somewhere else
      $tab.find('.preparing').hide();
      shown = true;
    }

    return !empty;
  }

  /**
   * removes all correction DOM nodes
   */
  function clearCorrections () {
    $tab.find('.corrections .corr').remove();
  }

  /**
   * retrieves the corrections and displays them in the correction table
   */
  function showCorrections () {
    var corrections, empty;

    empty = true;

    corrections = Swiss().getCorrections();

    if (corrections === undefined || corrections.length === 0) {
      template.correction.$container.hide();
      return false;
    }

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

      template.correction.$anchor.append(template.correction.$correction.clone());

      empty = false;
    });

    if (empty) {
      template.correction.$container.hide();
    } else {
      template.correction.$container.show();
    }

    return !empty;
  }

  Tab_Ranking.reset = function () {
    if (!$tab) {
      init();
    }

    // delete everything
    $tab.find('table .line').remove();
    clearCorrections();

    // reset everything
    updateTemplate();
  };

  function update () {
    var hidden;

    hidden = true;

    if (showRanks()) {
      hidden = false;
    }

    if (showCorrections()) {
      hidden = false;
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
        if (update() === true) {
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
