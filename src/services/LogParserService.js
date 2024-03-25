const fs = require('fs');
const readline = require('readline');

class LogParserService {
    constructor(filePath) {
        this.filePath = filePath;
        this.games = [];
        this.currentGameIndex = -1;
        this.playerNames = {};
    }

    async parseLogFile() {
        const rl = readline.createInterface({
            input: fs.createReadStream(this.filePath),
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            if (line.includes('InitGame:')) {
                this.startNewGame();
            } else if (line.includes('ShutdownGame:')) {
                this.endCurrentGame();
            } else if (line.includes('ClientConnect:')) {
                this.trackPlayerConnect(line);
            } else if (line.includes('ClientUserinfoChanged:')) {
                this.updatePlayerInfo(line);
            } else if (line.includes('Kill:')) {
                this.parseKill(line);
            }
        }

        return this.games;
    }

    startNewGame() {
        this.currentGameIndex++;
        this.games.push({
            totalKills: 0,
            players: [],
            kills: {}
        });
    }

    endCurrentGame() {
        if (this.currentGame) {
            this.finalizePlayerStats();
            console.log(`Game ended with ${this.currentGame.totalKills} total kills.`);
            this.currentGame = null;
        }
    }

    finalizePlayerStats() {
        if (!this.currentGame) return; 

        this.currentGame.players.forEach(player => {
            // Calculate kill/death ratio; avoid division by zero
            player.kdRatio = player.deaths > 0 ? player.kills / player.deaths : player.kills;

            // Example adjustment, add a bonus for players with more than 10 kills
            if (player.kills > 10) {
                player.score += 5; // Assuming each player object has a 'score' property
            }
        });

        // Sort players by score within the currentGame for ranking purposes
        this.currentGame.players.sort((a, b) => b.score - a.score);
    }

    trackPlayerConnect(line) {
        const clientId = line.split(' ')[1];
        if (!this.playerNames[clientId]) {
            this.playerNames[clientId] = '';
        }
    }

    updatePlayerInfo(line) {
        const parts = line.split(' ');
        const clientId = parts[1];
        const playerName = parts.slice(3).join(' ').match(/n\\([^\\]+)/)[1];

        this.playerNames[clientId] = playerName;

        if (this.games[this.currentGameIndex] && !this.games[this.currentGameIndex].players.includes(playerName)) {
            this.games[this.currentGameIndex].players.push(playerName);
            this.games[this.currentGameIndex].kills[playerName] = 0;
        }
    }

    parseKill(line) {
        const parts = line.split(' ');
        const killerId = parts[1];
        const victimId = parts[2];
        const killerName = this.playerNames[killerId] || '<world>';
        const victimName = this.playerNames[victimId];
        const currentGame = this.games[this.currentGameIndex];

        currentGame.totalKills++;

        if (killerName === '<world>') {
            if (currentGame.kills[victimName] !== undefined) {
                currentGame.kills[victimName]--;
            }
        } else {
            if (currentGame.kills[killerName] !== undefined) {
                currentGame.kills[killerName]++;
            }
        }
    }
}

module.exports = LogParserService;
