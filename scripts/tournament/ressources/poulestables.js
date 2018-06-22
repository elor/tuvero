define(function () {
  var roundrobin_byes, winner, loser;

  winner = "winner";
  loser = "loser";
  roundrobin_byes = [
    [0, 2],
    [1, 2],
    [0, 1]
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
      acbd: [{
          from: 2,
          who: winner
        },
        {
          from: 2,
          who: loser
        },
        {
          from: 3,
          who: winner
        },
        {
          from: 3,
          who: loser
        }
      ],
      barrage: [{
          from: 2,
          who: winner
        },
        {
          from: 4,
          who: winner
        },
        {
          from: 4,
          who: loser
        },
        {
          from: 3,
          who: loser
        }
      ]
    }
  };
});