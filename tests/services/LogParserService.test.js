const LogParserService = require('../../src/services/LogParserService');

jest.mock('fs');
jest.mock('readline', () => ({
  createInterface: jest.fn().mockReturnValue({
    on: jest.fn((event, callback) => {
      if (event === 'line') {
        // Simulate readline line event with mock data
        const sampleLines = [
          '20:34 ClientConnect: 2',
          '20:37 ClientUserinfoChanged: 2 n\\Isgalamido\\t...',
          '20:40 Kill: 2 3 7: Isgalamido killed Dono da bola by MOD_ROCKET',
          '21:15 ShutdownGame:',
        ];
        sampleLines.forEach((line) => callback(line));
        callback(null); 
      }
      if (event === 'close') {
        setImmediate(callback);
      }
    }),
    close: jest.fn(),
  })
}));

describe('LogParserService', () => {
  let logParserService;
  const fakeLogFilePath = 'path/to/quake/game.log';

  beforeEach(() => {
    logParserService = new LogParserService(fakeLogFilePath);
  });

  it('parses log lines and structures game data correctly', async () => {
    const gamesData = await logParserService.parseLogFile();

    expect(gamesData.length).toBeGreaterThan(0); 

    const gameSession = gamesData[0];
    expect(gameSession.totalKills).toBeDefined();
    expect(gameSession.players).toContain('Isgalamido');
  });

});
