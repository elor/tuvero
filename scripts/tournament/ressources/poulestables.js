define(function () {
  var roundrobin_byes, acbd_ranking, winner, loser;

  winner = "winner";
  loser = "loser";

  roundrobin_byes = [
    [0, 2],
    [1, 2],
    [0, 1]
  ];

  acbd_ranking = [{
      winner: 0,
      loser: 2
    },
    {
      winner: 0,
      loser: 2
    },
    {
      winner: 0,
      loser: 1,
    },
    {
      winner: 2,
      loser: 3
    }
  ];

  return {
    MATCHES: {
      acbd: {
        default: [
          [0, 3],
          [1, 2],
          [{
              from: 0,
              who: winner
            },
            {
              from: 1,
              who: winner
            }
          ],
          [{
              from: 0,
              who: loser
            },
            {
              from: 1,
              who: loser
            }
          ]
        ],
        favorites: [
          [0],
          [1, 2],
          [
            0,
            {
              from: 1,
              who: winner
            }
          ],
          [{
            from: 1,
            who: loser
          }]
        ],
        lastteams: [
          [0, 1],
          [2],
          [{
              from: 0,
              who: winner
            },
            2
          ],
          [{
            from: 0,
            who: loser
          }]
        ]
      },
      barrage: {
        default: [
          [0, 3],
          [1, 2],
          [{
            from: 0,
            who: winner
          }, {
            from: 1,
            who: winner
          }],
          [{
            from: 0,
            who: loser
          }, {
            from: 1,
            who: loser
          }],
          [{
            from: 2,
            who: loser
          }, {
            from: 3,
            who: winner
          }]
        ],
        favorites: roundrobin_byes,
        lastteams: roundrobin_byes
      },
      roundrobin: {
        default: [
          [0, 3],
          [1, 2],
          [0, 2],
          [1, 3],
          [0, 1],
          [2, 3]
        ],
        favorites: roundrobin_byes,
        lastteams: roundrobin_byes
      }
    },
    RANKING: {
      acbd: {
        default: acbd_ranking,
        favorites: acbd_ranking,
        lastteams: acbd_ranking
      },
      barrage: {
        default: [{
            winner: 0,
            loser: 1
          },
          {
            winner: 0,
            loser: 1
          },
          {
            winner: 0,
            loser: 1
          },
          {
            winner: 1,
            loser: 3
          },
          {
            winner: 1,
            loser: 2
          }
        ],
        favorites: undefined,
        lastteams: undefined
      },
      roundrobin: {
        default: undefined,
        favorites: undefined,
        lastteams: undefined
      }
    }
  };
});