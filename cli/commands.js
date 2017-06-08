function extractTeams(state) {
  return {
    teams: state.teams.map(function (team) {
      let result = {
        id: team.getID(),
        number: team.getID() + 1
      };

      team.getNames().forEach(function (name, playerid) {
        result['name' + (playerid + 1)] = name;
      });

      return result;
    }),
    teamsize: state.teamsize.get()
  }
}

function extractStages(state) {
  let result = {
    tournaments: state.tournaments.map(function (tournament) {
      return {
        id: tournament.getID(),
        name: tournament.getName().get(),
        system: tournament.SYSTEM,
        state: tournament.getState().get(),
        size: tournament.getTeams().length
      };
    }),
    numtournaments: state.tournaments.length
  };

  result.closed = state.tournaments.closedTournaments.asArray().map(id => result.tournaments[id]);

  return result;
}

function extractRanking(state) {
  return state.tournaments.getGlobalRanking();
}

function extractMatches(state) {
  let teams = extractTeams(state).teams;

  function insertTeam(team) {
    if (typeof (team) === 'number')
      return teams[team];
    return team.map(team => teams[team]);
  }

  function formatMatch(match) {
    return {
      teams: match.teams.map(insertTeam),
      group: match.group,
      id: match.getID()
    };
  }

  function formatResult(match) {
    let result = formatMatch(match);
    result.score = match.score;
    return result;
  }

  return {
    tournaments: state.tournaments.map(function (tournament) {
      return {
        finished: tournament.getHistory().map(formatResult),
        running: tournament.getMatches().asArray()
          .filter(match => match.teams.indexOf(undefined) === -1)
          .map(formatMatch),
        corrections: tournament.getCorrections().map(function (correction) {
          return {
            before: formatResult(correction.before),
            after: formatResult(correction.after)
          }
        })
      };
    }),
  };
}

module.exports = {
  ranking: extractRanking,
  teams: extractTeams,
  stages: extractStages,
  matches: extractMatches
};
