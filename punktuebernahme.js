tacByTeamID = []
tournaments.map(t => t.getRanking().get()).filter(r => r.tac && r.ids.length === 8).map(({ ids, tac }) => ids.forEach((id, index) => { tacByTeamID[id] = tac[index] }))

tournaments.get(tournaments.length - 1).ranking.length = tournaments.get(tournaments.length - 1).teams.length

tournaments.get(tournaments.length - 1).recalculateRanking()
tournaments.get(tournaments.length - 1).teams.map(id => tacByTeamID[id]).map((tac, index) => (tournaments.get(tournaments.length - 1).ranking.tac.set(index, tac)))
tournaments.get(tournaments.length - 1).ranking.invalidate()
tournaments.get(tournaments.length - 1).getRanking().get()
