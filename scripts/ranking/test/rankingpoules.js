import { test, expect } from 'vitest'
import RankingModel from '../rankingmodel.js'
test('Poules Ranking', () => {
    const ranking = new RankingModel(['pouleid', 'wins', 'saldo', 'points'], 5)
  const ref = {
    components: ['pouleid', 'wins', 'saldo', 'points'],
    ids: [0, 1, 2, 3, 4],
    ranks: [0, 0, 0, 0, 0],
    wins: [0, 0, 0, 0, 0],
    points: [0, 0, 0, 0, 0],
    saldo: [0, 0, 0, 0, 0],
    displayOrder: [0, 1, 2, 3, 4],
    pouleid: [1, 1, 1, 1, 1]
  }
  const ret = ranking.get()
  expect(ret, 'empty ranking: correct H2H-score').toEqual(ref)
})
