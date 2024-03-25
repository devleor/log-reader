const LogParserService = require('../services/LogParserService');
const ReportService = require('../services/ReportService');

class GameController {
    constructor(logFilePath) {
        this.logFilePath = logFilePath;
    }

    async run() {
        try {
            const parser = new LogParserService(this.logFilePath);
            const games = await parser.parseLogFile();
                        
            ReportService.printMatchReports(games);
            
            ReportService.printPlayerRanking(games);
        } catch (error) {
            console.error('Error processing game logs:', error);
        }
    }
}

module.exports = GameController;
