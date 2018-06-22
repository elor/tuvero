define({
  MATCHES: {
    acbd: {
      default: [
        [0, 3],
        [1, 2],
        [{
            from: 0,
            who: "winner"
          },
          {
            from: 1,
            who: "winner"
          }
        ],
        [{
            from: 0,
            who: "loser"
          },
          {
            from: 1,
            who: "loser"
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
            who: "winner"
          }
        ],
        [{
          from: 1,
          who: "loser"
        }]
      ],
      lastteams: [
        [0, 1],
        [2],
        [{
            from: 0,
            who: "winner"
          },
          2
        ],
        [{
          from: 0,
          who: "loser"
        }]
      ]
    }
  },
  RANKING: {
    acbd: [{
      from: 2,
      who: "winner"
    }, {
      from: 2,
      who: "loser"
    }, {
      from: 3,
      who: "winner"
    }, {
      from: 3,
      who: "loser"
    }]
  }
});