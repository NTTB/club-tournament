import { customPlayerService, CustomPlayerStorageTable } from "./custom-player/custom-player.service";
import { importPools, PoolStorageTable } from "./pool-functions";
import { importTournaments, TournamentStorageTable } from "./tournament";
import { importTournamentPlayers, TournamentPlayerStorageTable } from "./tournament-player-functions";

const data: {
  customPlayers: CustomPlayerStorageTable,
  tournament: TournamentStorageTable,
  tournamentplayers: TournamentPlayerStorageTable,
  poules: PoolStorageTable,

} = {
  "customPlayers": {
    "nextId": 7,
    "items": [
      {
        "class": "",
        "club": "",
        "id": 1,
        "name": "A",
        "rating": 300,
        "type": "custom",
        "img": ""
      },
      {
        "class": "",
        "club": "",
        "id": 2,
        "name": "B",
        "rating": 300,
        "type": "custom",
        "img": ""
      },
      {
        "class": "",
        "club": "",
        "id": 3,
        "name": "C",
        "rating": 300,
        "type": "custom",
        "img": ""
      },
      {
        "class": "",
        "club": "",
        "id": 4,
        "name": "D",
        "rating": 300,
        "type": "custom",
        "img": ""
      },
      {
        "class": "",
        "club": "",
        "id": 5,
        "name": "E",
        "rating": 300,
        "type": "custom",
        "img": ""
      },
      {
        "class": "",
        "club": "",
        "id": 6,
        "name": "F",
        "rating": 300,
        "type": "custom",
        "img": ""
      }
    ]
  },
  "tournament": {
    "nextId": 2,
    "items": [
      {
        "id": 1,
        "availableTables": 1,
        "name": "Demo",
        "started": true,
        "defaultPoolSettings": {
          "matchRules": {
            "victoryPoints": 1,
            "defeatPoints": 0
          },
          "setRules": {
            "bestOf": 5,
            "gameRules": {
              "scoreDistance": 2,
              "scoreMinimum": 11
            }
          }
        }
      }
    ]
  },
  "tournamentplayers": {
    "nextId": 7,
    "items": [
      {
        "id": 1,
        "tournamentId": 1,
        "info": {
          "class": "",
          "club": "",
          "id": 1,
          "name": "A",
          "rating": 300,
          "type": "custom",
          "img": ""
        }
      },
      {
        "id": 2,
        "tournamentId": 1,
        "info": {
          "class": "",
          "club": "",
          "id": 2,
          "name": "B",
          "rating": 300,
          "type": "custom",
          "img": ""
        }
      },
      {
        "id": 3,
        "tournamentId": 1,
        "info": {
          "class": "",
          "club": "",
          "id": 3,
          "name": "C",
          "rating": 300,
          "type": "custom",
          "img": ""
        }
      },
      {
        "id": 4,
        "tournamentId": 1,
        "info": {
          "class": "",
          "club": "",
          "id": 4,
          "name": "D",
          "rating": 300,
          "type": "custom",
          "img": ""
        }
      },
      {
        "id": 5,
        "tournamentId": 1,
        "info": {
          "class": "",
          "club": "",
          "id": 5,
          "name": "E",
          "rating": 300,
          "type": "custom",
          "img": ""
        }
      },
      {
        "id": 6,
        "tournamentId": 1,
        "info": {
          "class": "",
          "club": "",
          "id": 6,
          "name": "F",
          "rating": 300,
          "type": "custom",
          "img": ""
        }
      }
    ]
  },
  "poules": {
    "nextId": 2,
    "items": [
      {
        "id": 1,
        "tournamentId": 1,
        "index": 1,
        "name": "A",
        "players": [
          {
            "playerTournamentId": 1,
            "info": {
              "class": "",
              "club": "",
              "id": 1,
              "name": "A",
              "rating": 300,
              "type": "custom",
              "img": ""
            },
            "sameRankOrder": 0
          },
          {
            "playerTournamentId": 2,
            "info": {
              "class": "",
              "club": "",
              "id": 2,
              "name": "B",
              "rating": 300,
              "type": "custom",
              "img": ""
            },
            "sameRankOrder": 0
          },
          {
            "playerTournamentId": 3,
            "info": {
              "class": "",
              "club": "",
              "id": 3,
              "name": "C",
              "rating": 300,
              "type": "custom",
              "img": ""
            },
            "sameRankOrder": 0
          },
          {
            "playerTournamentId": 4,
            "info": {
              "class": "",
              "club": "",
              "id": 4,
              "name": "D",
              "rating": 300,
              "type": "custom",
              "img": ""
            },
            "sameRankOrder": 0
          },
          {
            "playerTournamentId": 5,
            "info": {
              "class": "",
              "club": "",
              "id": 5,
              "name": "E",
              "rating": 300,
              "type": "custom",
              "img": ""
            },
            "sameRankOrder": 0
          },
          {
            "playerTournamentId": 6,
            "info": {
              "class": "",
              "club": "",
              "id": 6,
              "name": "F",
              "rating": 300,
              "type": "custom",
              "img": ""
            },
            "sameRankOrder": 0
          }
        ],
        "sets": [
          {
            "homeTournamentId": 1,
            "awayTournamentId": 6,
            "roundId": 0,
            "games": [
              {
                "homeScore": 11,
                "awayScore": 5
              },
              {
                "homeScore": 7,
                "awayScore": 11
              },
              {
                "homeScore": 4,
                "awayScore": 11
              },
              {
                "homeScore": 11,
                "awayScore": 9
              },
              {
                "homeScore": 11,
                "awayScore": 6
              }
            ],
            "orderId": 1
          },
          {
            "homeTournamentId": 2,
            "awayTournamentId": 5,
            "roundId": 0,
            "games": [
              {
                "homeScore": 11,
                "awayScore": 8
              },
              {
                "homeScore": 13,
                "awayScore": 11
              },
              {
                "homeScore": 11,
                "awayScore": 9
              },
              {
                "homeScore": 0,
                "awayScore": 0
              },
              {
                "homeScore": 0,
                "awayScore": 0
              }
            ],
            "orderId": 2
          },
          {
            "homeTournamentId": 3,
            "awayTournamentId": 4,
            "roundId": 0,
            "games": [
              {
                "homeScore": 11,
                "awayScore": 8
              },
              {
                "homeScore": 11,
                "awayScore": 9
              },
              {
                "homeScore": 11,
                "awayScore": 13
              },
              {
                "homeScore": 11,
                "awayScore": 5
              },
              {
                "homeScore": 0,
                "awayScore": 0
              }
            ],
            "orderId": 3
          },
          {
            "homeTournamentId": 1,
            "awayTournamentId": 5,
            "roundId": 1,
            "games": [
              {
                "homeScore": 11,
                "awayScore": 7
              },
              {
                "homeScore": 15,
                "awayScore": 13
              },
              {
                "homeScore": 11,
                "awayScore": 6
              },
              {
                "homeScore": 0,
                "awayScore": 0
              },
              {
                "homeScore": 0,
                "awayScore": 0
              }
            ],
            "orderId": 4
          },
          {
            "homeTournamentId": 2,
            "awayTournamentId": 4,
            "roundId": 1,
            "games": [
              {
                "homeScore": 11,
                "awayScore": 7
              },
              {
                "homeScore": 11,
                "awayScore": 9
              },
              {
                "homeScore": 6,
                "awayScore": 11
              },
              {
                "homeScore": 9,
                "awayScore": 11
              },
              {
                "homeScore": 13,
                "awayScore": 11
              }
            ],
            "orderId": 5
          },
          {
            "homeTournamentId": 3,
            "awayTournamentId": 6,
            "roundId": 1,
            "games": [
              {
                "homeScore": 11,
                "awayScore": 7
              },
              {
                "homeScore": 5,
                "awayScore": 11
              },
              {
                "homeScore": 11,
                "awayScore": 9
              },
              {
                "homeScore": 11,
                "awayScore": 8
              },
              {
                "homeScore": 0,
                "awayScore": 0
              }
            ],
            "orderId": 6
          },
          {
            "homeTournamentId": 1,
            "awayTournamentId": 4,
            "roundId": 2,
            "games": [
              {
                "homeScore": 11,
                "awayScore": 6
              },
              {
                "homeScore": 11,
                "awayScore": 9
              },
              {
                "homeScore": 11,
                "awayScore": 8
              },
              {
                "homeScore": 0,
                "awayScore": 0
              },
              {
                "homeScore": 0,
                "awayScore": 0
              }
            ],
            "orderId": 7
          },
          {
            "homeTournamentId": 2,
            "awayTournamentId": 3,
            "roundId": 2,
            "games": [
              {
                "homeScore": 7,
                "awayScore": 11
              },
              {
                "homeScore": 14,
                "awayScore": 12
              },
              {
                "homeScore": 11,
                "awayScore": 5
              },
              {
                "homeScore": 10,
                "awayScore": 12
              },
              {
                "homeScore": 11,
                "awayScore": 7
              }
            ],
            "orderId": 8
          },
          {
            "homeTournamentId": 5,
            "awayTournamentId": 6,
            "roundId": 2,
            "games": [
              {
                "homeScore": 7,
                "awayScore": 11
              },
              {
                "homeScore": 10,
                "awayScore": 12
              },
              {
                "homeScore": 6,
                "awayScore": 11
              },
              {
                "homeScore": 0,
                "awayScore": 0
              },
              {
                "homeScore": 0,
                "awayScore": 0
              }
            ],
            "orderId": 9
          },
          {
            "homeTournamentId": 1,
            "awayTournamentId": 3,
            "roundId": 3,
            "games": [
              {
                "homeScore": 11,
                "awayScore": 8
              },
              {
                "homeScore": 13,
                "awayScore": 11
              },
              {
                "homeScore": 15,
                "awayScore": 17
              },
              {
                "homeScore": 4,
                "awayScore": 11
              },
              {
                "homeScore": 10,
                "awayScore": 12
              }
            ],
            "orderId": 10
          },
          {
            "homeTournamentId": 2,
            "awayTournamentId": 6,
            "roundId": 3,
            "games": [
              {
                "homeScore": 13,
                "awayScore": 11
              },
              {
                "homeScore": 11,
                "awayScore": 7
              },
              {
                "homeScore": 11,
                "awayScore": 2
              },
              {
                "homeScore": 0,
                "awayScore": 0
              },
              {
                "homeScore": 0,
                "awayScore": 0
              }
            ],
            "orderId": 11
          },
          {
            "homeTournamentId": 4,
            "awayTournamentId": 5,
            "roundId": 3,
            "games": [
              {
                "homeScore": 4,
                "awayScore": 11
              },
              {
                "homeScore": 7,
                "awayScore": 11
              },
              {
                "homeScore": 8,
                "awayScore": 11
              },
              {
                "homeScore": 0,
                "awayScore": 0
              },
              {
                "homeScore": 0,
                "awayScore": 0
              }
            ],
            "orderId": 12
          },
          {
            "homeTournamentId": 1,
            "awayTournamentId": 2,
            "roundId": 4,
            "games": [
              {
                "homeScore": 9,
                "awayScore": 11
              },
              {
                "homeScore": 14,
                "awayScore": 12
              },
              {
                "homeScore": 9,
                "awayScore": 11
              },
              {
                "homeScore": 11,
                "awayScore": 5
              },
              {
                "homeScore": 13,
                "awayScore": 11
              }
            ],
            "orderId": 13
          },
          {
            "homeTournamentId": 3,
            "awayTournamentId": 5,
            "roundId": 4,
            "games": [
              {
                "homeScore": 11,
                "awayScore": 4
              },
              {
                "homeScore": 11,
                "awayScore": 9
              },
              {
                "homeScore": 13,
                "awayScore": 11
              },
              {
                "homeScore": 0,
                "awayScore": 0
              },
              {
                "homeScore": 0,
                "awayScore": 0
              }
            ],
            "orderId": 14
          },
          {
            "homeTournamentId": 4,
            "awayTournamentId": 6,
            "roundId": 4,
            "games": [
              {
                "homeScore": 7,
                "awayScore": 11
              },
              {
                "homeScore": 12,
                "awayScore": 10
              },
              {
                "homeScore": 6,
                "awayScore": 11
              },
              {
                "homeScore": 11,
                "awayScore": 13
              },
              {
                "homeScore": 0,
                "awayScore": 0
              }
            ],
            "orderId": 15
          }
        ]
      }
    ]
  }
};


export function ImportDemoData() {
  customPlayerService.importPlayers(data.customPlayers);
  importTournaments(data.tournament);
  importTournamentPlayers(data.tournamentplayers);
  importPools(data.poules);
}