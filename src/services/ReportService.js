class ReportService {
    static printMatchReports(games) {
        games.forEach((game, index) => {
            console.log(`\nGame ${index + 1}:`);
            console.log(`Total Kills: ${game.totalKills}`);
            console.log('Players: ', game.players.join(', '));
            console.log('Kills:');
            Object.entries(game.kills).forEach(([player, kills]) => {
                console.log(`  ${player}: ${kills}`);
            });
        });
    }

    static printPlayerRanking(games) {
        let globalKills = {};

        games.forEach(game => {
            game.players.forEach(player => {
                if (!globalKills[player]) {
                    globalKills[player] = 0;
                }
                globalKills[player] += game.kills[player] || 0;
            });
        });

        const sortedPlayers = Object.entries(globalKills).sort((a, b) => b[1] - a[1]);

        console.log('\nPlayer Ranking:');
        sortedPlayers.forEach(([player, kills], index) => {
            console.log(`${index + 1}. ${player}: ${kills} kills`);
        });
    }
}

module.exports = ReportService;