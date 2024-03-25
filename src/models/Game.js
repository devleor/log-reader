class Game {
    constructor() {
      this.totalKills = 0;
      this.players = [];
      this.kills = {};
    }
  
    addPlayer(playerName) {
      if (!this.players.includes(playerName)) {
        this.players.push(playerName);
        this.kills[playerName] = 0;
      }
    }
  
    recordKill(killer, killed) {
      this.totalKills++;
  
      if (killer === "<world>") {
        if (this.kills.hasOwnProperty(killed)) {
          this.kills[killed]--;
        }
      } else {
        if (this.kills.hasOwnProperty(killer)) {
          this.kills[killer]++;
        }
      }
    }
  }
  
  module.exports = Game;
  