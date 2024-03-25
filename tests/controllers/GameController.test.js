const GameController = require('../../src/controllers/GameController');
const LogParserService = require('../../src/services/LogParserService');
const ReportService = require('../../src/services/ReportService');

jest.mock('../../src/services/LogParserService', () => {
  return jest.fn().mockImplementation(() => {
    return { parseLogFile: jest.fn().mockResolvedValue([{ /* mocked game data */ }]) };
  });
});

jest.mock('../../src/services/ReportService', () => ({
  printMatchReports: jest.fn(),
  printPlayerRanking: jest.fn()
}));

describe('GameController', () => {
  let gameController;
  const fakeLogFilePath = 'path/to/quake/game.log'; // A path for our fake log file

  beforeEach(() => {
    LogParserService.mockClear();
    ReportService.printMatchReports.mockClear();
    ReportService.printPlayerRanking.mockClear();

    gameController = new GameController(fakeLogFilePath);
  });

  it('should initialize LogParserService with the log file path', async () => {
    await gameController.run();
    expect(LogParserService).toHaveBeenCalledWith(fakeLogFilePath);
  });

  it('should call printMatchReports on ReportService with parsed data', async () => {
    await gameController.run();
    expect(ReportService.printMatchReports).toHaveBeenCalledWith([{ /* mocked game data */ }]);
  });

  it('should call printPlayerRanking on ReportService with parsed data', async () => {
    await gameController.run();
    expect(ReportService.printPlayerRanking).toHaveBeenCalledWith([{ /* mocked game data */ }]);
  });
});
