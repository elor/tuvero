function extractTeams (state) {
  return {
    teams: state.teams.map(function (team) {
      const result = {
        id: team.getID(),
        number: team.getID() + 1
      }

      team.getNames().forEach(function (name, playerid) {
        result['name' + (playerid + 1)] = name
      })

      return result
    }),
    teamsize: state.teamsize.get()
  }
}

function extractStages (state) {
  const result = {
    tournaments: state.tournaments.map(function (tournament) {
      return {
        id: tournament.getID(),
        name: tournament.getName().get(),
        size: tournament.getTeams().length,
        state: tournament.getState().get(),
        system: tournament.SYSTEM
      }
    }),
    teamsize: state.teamsize.get()
  }

  result.closed = state.tournaments.closedTournaments.asArray().map(id => result.tournaments[id])

  return result
}

function extractRanking (state) {
  const teams = extractTeams(state).teams
  const globalRanking = state.tournaments.getGlobalRanking(teams.length)

  return {
    globalranking: globalRanking.displayOrder.map(function (teamid, displayid) {
      return {
        displayid,
        globalrank: globalRanking.globalRanks[teamid],
        team: teams[teamid],
        tournamentid: globalRanking.tournamentIDs[teamid],
        tournamentrank: globalRanking.tournamentRanks[teamid]
      }
    }),
    tournaments: state.tournaments.map(function (tournament, tournamentid) {
      const ranking = tournament.getRanking().get()
      return {
        components: ranking.components.slice(),
        globaloffset: globalRanking.tournamentOffsets[tournamentid],
        id: tournament.getID(),
        name: tournament.getName().get(),
        ranking: ranking.displayOrder.map(function (internalid, displayid) {
          const teamid = ranking.ids[internalid]
          const points = {}

          ranking.components.forEach(function (component) {
            points[component] = ranking[component][internalid]
          })

          return {
            team: teams[teamid],
            rank: ranking.ranks[internalid],
            displayid,
            points
          }
        }),
        state: tournament.getState().get(),
        system: tournament.SYSTEM
      }
    }),
    teamsize: state.teamsize.get()
  }
}

function extractMatches (state) {
  const teams = extractTeams(state).teams

  function insertTeam (team) {
    if (typeof (team) === 'number') { return teams[team] }
    return team.map(team => teams[team])
  }

  function formatMatch (match) {
    return {
      teams: match.teams.map(insertTeam),
      group: match.group,
      id: match.getID(),
      place: match.place || ''
    }
  }

  function formatResult (match) {
    const result = formatMatch(match)
    result.score = match.score
    return result
  }

  return {
    tournaments: state.tournaments.map(function (tournament) {
      return {
        name: tournament.getName().get(),
        size: tournament.getTeams().length,
        state: tournament.getState().get(),
        system: tournament.SYSTEM,
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
      }
    }),
    teamsize: state.teamsize.get()
  }
}

function extractAll (state) {
  const ret = {}

  for (const command in commands) {
    if (command !== 'all') {
      ret[command] = commands[command](state)
    }
  }

  return ret
}

const commands = {
  all: extractAll,
  matches: extractMatches,
  ranking: extractRanking,
  stages: extractStages,
  teams: extractTeams
}

export default commands
