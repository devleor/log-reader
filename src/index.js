const GameController = require('./controllers/GameController');

// Replace this with the actual path to your Quake log file
const logFilePath = './logfile/qgames.log';

const gameController = new GameController(logFilePath);

// Run the controller to parse the log file and generate reports
gameController.run().catch(err => console.error(err));
