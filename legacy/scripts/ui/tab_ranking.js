/**
 * Model, View and Controller of the ranking tab
 *
 * This tab shows all results in tabulated form and is supposed to provide some
 * kind of sorting functionality
 *
 * TODO slay this beast
 *
 * @return Tab_Ranking
 * @implements ./tab
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['./tournaments', './team', './toast', './strings', 'options',
    './tabshandle', './tab', './history', './shared', './boxview',
    './state_new'], function(Tournaments, Team, Toast, Strings, Options,
    Tabshandle, Tab, History, Shared, BoxView, State) {
  var Tab_Ranking, template, $tab;

  template = undefined;
  Tab_Ranking = undefined;
  $tab = undefined;

  function initTemplate() {
    var i, tmp;

    template = {};

    template.$box = $tab.find('div.boxview.tpl');
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
      if (template.rank.$fields[i].hasClass('name')) {
        template.rank.$fields[i].css('display', 'none');
      }
    }

    // corrections
    template.correction = {};

    template.correction.$container = template.$box.find('.corrections');
    template.correction.$container.detach();

    template.correction.$correction = template.correction.$container
        .find('.corr');
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

  function updateTemplate() {
    var i;
    // adjust number of columns to the teamsize
    template.rank.$table.find('th:nth-child(3)').attr('colspan',
        State.teamsize.get());
    
    // hide unimportant columns
    for (i = 0; i < Options.maxteamsize; i += 1) {
      if (i < State.teamsize.get()) {
        template.rank.$fields[i + 2]
            && template.rank.$fields[i + 2].css('display', '');
      } else {
        template.rank.$fields[i + 2]
            && template.rank.$fields[i + 2].css('display', 'none');
      }
    }
  }

  function init() {
    if ($tab) {
      console.error('tab_ranking: $tab already exists:');
      console.error($tab);
      return;
    }

    $tab = $('#ranking');

    initTemplate();
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
   * @return a filled copy of the template
   */
  function createRankRow(rank, ranking) {
    var tid, team, vote, i;

    tid = ranking.ids[rank];
    team = Team.get(tid);

    template.rank.$fields[0].text(ranking.place[rank] + 1);

    template.rank.$fields[1].text(team.getID() + 1);
    for (i = 0; i < State.teamsize.get(); i += 1) {
      template.rank.$fields[i + 2].text(team.getPlayer(i).getName());
    }

    template.rank.$fields[5].text(ranking.games ? ranking.games[rank] : '');

    template.rank.$fields[6].text(ranking.wins ? ranking.wins[rank] : '');
    template.rank.$fields[7].text(ranking.buchholz ? ranking.buchholz[rank]
        : '');
    template.rank.$fields[8]
        .text(ranking.finebuchholz ? ranking.finebuchholz[rank] : '');
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
   * @param tournamentid
   *          the tournament id
   * @param $box
   *          the box to add the ranking to
   * @return {boolean} false on failure, true on success
   */
  function showRanking(tournamentid, $box) {
    var ranking, rank, $container, notempty;

    $container = template.rank.$table.clone();

    ranking = Tournaments.getRanking(tournamentid);

    if (ranking.round <= 0) {
      return false;
    }

    if (ranking.place.every(function(place) {
      return place === 0;
    })) {
      // all players are in the first place, i.e. there's no real ranking
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
   *
   * @param tournamentid
   *          the tournament id
   * @param $box
   *          the box to add content to
   * @return true if anything has been added to the DOM, false otherwise
   */
  function showCorrections(tournamentid, $box) {
    var corrections, empty, $container, $table;

    empty = true;

    corrections = History.getCorrections(tournamentid);

    if (corrections === undefined || corrections.length === 0) {
      return false;
    }

    $container = template.correction.$container.clone();
    $table = $container.find('.correctionstable');

    corrections.forEach(function(correction) {
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

  function reset() {
    if (!$tab) {
      init();
    }

    // delete everything, i.e. the wrapping box
    $tab.find('.boxview').remove();

    // update template to the team size
    updateTemplate();
  }

  function updateTournamentRankings() {
    var hidden, tournamentid, keepbox, $box;

    hidden = true;

    reset();

    tournamentid = 0;
    for (; tournamentid < Tournaments.numTournaments(); tournamentid += 1) {

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
        if (!Tournaments.isRunning(tournamentid)) {
          $box.addClass('collapsed');
        }
        new BoxView($box);
      }
    }

    if (hidden) {
      Tabshandle.hide('ranking');
    } else {
      Tabshandle.show('ranking');
    }
  }

  function update() {
    if (updateTournamentRankings() === true) {
      // new Toast(Strings.rankingupdate);
    }
  }

  Tab_Ranking = Tab.createTab('ranking', reset, update);
  Shared.Tab_Ranking = Tab_Ranking;
  return Tab_Ranking;
});
