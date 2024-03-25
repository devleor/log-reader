class Player {
    constructor(name) {
        this.name = name;
        this.kills = 0; 
    }

    addKill() {
        this.kills++;
    }

    subtractKill() {
        this.kills--;
    }

    getKillCount() {
        return this.kills;
    }

    printPlayerStats() {
        console.log(`${this.name} - Kills: ${this.kills}`);
    }
}

module.exports = Player;
