// testing file
import loggingData, {privateApi} from './../src/logging';

// dependencies
// constants
import consts from './../src/constants';

describe('logging.js', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.getSupportedLogLevels', () => {
    it('returns an array with strings that represent log levels', () => {
      expect(privateApi.getSupportedLogLevels()).toEqual(
        [
          'debug',
          'error',
          'info',
          'log',
          'warn',
        ]
      );
    });
  });

  describe('privateApi.getLogLevelData', () => {
    beforeEach(() => {
      testSpecificMocks.logLevel = 'warn';
      testSpecificMocks.logLevelData = {
        methodName: 'warnMethod',
      };
    });

    it('when `methodName` has truthy value => returns object with the provided method name', () => {
      expect(privateApi.getLogLevelData(testSpecificMocks.logLevel, testSpecificMocks.logLevelData)).toEqual(
        {
          methodName: testSpecificMocks.logLevelData.methodName,
        }
      );
    });

    it('when `methodName` has falsy value => returns object with the log level as method name', () => {
      testSpecificMocks.logLevelData.methodName = false;
      expect(privateApi.getLogLevelData(testSpecificMocks.logLevel, testSpecificMocks.logLevelData)).toEqual(
        {
          methodName: testSpecificMocks.logLevel,
        }
      );
    });
  });

  describe('privateApi.getLoggingLevels', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getSupportedLogLevels').mockReturnValue(['logLevel']);
      jest.spyOn(privateApi, 'getLogLevelData').mockReturnValue({
        logLevelData: 'logLevelData',
      });
    });
    beforeEach(() => {
      testSpecificMocks.loggingLevels = {
        logLevel: {
          methodName: 'log',
        },
      };
    });
    afterEach(() => {
      privateApi.getSupportedLogLevels.mockClear();
      privateApi.getLogLevelData.mockClear();
    });
    afterAll(() => {
      privateApi.getSupportedLogLevels.mockRestore();
      privateApi.getLogLevelData.mockRestore();
    });

    it('retrieves supported log levels by calling `privateApi.getSupportedLogLevels`', () => {
      privateApi.getLoggingLevels(testSpecificMocks.loggingLevels);

      expect(privateApi.getSupportedLogLevels).toHaveBeenCalledWith();
    });

    it('when plugin was provided with settings for every log level => retrieves settings for every supported log level using provided settings by calling `privateApi.getLogLevelData`', () => {
      privateApi.getLoggingLevels(testSpecificMocks.loggingLevels);

      expect(privateApi.getLogLevelData.mock.calls[0]).toEqual(
        [
          'logLevel',
          {
            methodName: 'log',
          },
        ]
      );
    });

    it('when plugin was not provided with settings for every log level => retrieves settings for every supported log level using default settings by calling `privateApi.getLogLevelData`', () => {
      testSpecificMocks.loggingLevels = {};
      privateApi.getLoggingLevels(testSpecificMocks.loggingLevels);

      expect(privateApi.getLogLevelData.mock.calls[0]).toEqual(
        [
          'logLevel',
          {
          },
        ]
      );
    });

    it('returns options for logging, taking in consideration every level', () => {
      privateApi.getSupportedLogLevels.mockReturnValueOnce(['logLevel', 'debug']);

      expect(privateApi.getLoggingLevels(testSpecificMocks.loggingLevels)).toEqual(
        {
          debug: {
            logLevelData: 'logLevelData',
          },
          logLevel: {
            logLevelData: 'logLevelData',
          },
        }
      );
    });
  });

  describe('getOptions', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getLoggingLevels').mockReturnValue({
        loggingLevels: 'loggingLevels',
      });
    });
    beforeEach(() => {
      testSpecificMocks.loggingData = {
        levels: {
          log: {
            methodName: 'log',
          },
        },
        name: 'myLogger',
        source: 'source',
      };
    });
    afterEach(() => {
      privateApi.getLoggingLevels.mockClear();
    });
    afterAll(() => {
      privateApi.getLoggingLevels.mockRestore();
    });

    it('retrieves log level options by calling `privateApi.getLoggingLevels`', () => {
      loggingData.getOptions(testSpecificMocks.loggingData);

      expect(privateApi.getLoggingLevels).toHaveBeenCalledWith(
        testSpecificMocks.loggingData.levels
      );
    });

    it('when plugin was provided with settings => returns options based on provided settings', () => {
      expect(loggingData.getOptions(testSpecificMocks.loggingData)).toEqual(
        {
          levels: {
            loggingLevels: 'loggingLevels',
          },
          name: testSpecificMocks.loggingData.name,
          source: testSpecificMocks.loggingData.source,
        }
      );
    });

    it('when plugin was not provided with settings => returns options based on defaults', () => {
      testSpecificMocks.loggingData = undefined;
      expect(loggingData.getOptions(testSpecificMocks.loggingData)).toEqual(
        {
          levels: {
            loggingLevels: 'loggingLevels',
          },
          name: consts.LOGGER_API,
          source: '',
        }
      );
    });

    it('when plugin was not provided with logging source and the name is not the default => returns options where source is an empty string', () => {
      testSpecificMocks.loggingData.source = undefined;

      expect(loggingData.getOptions(testSpecificMocks.loggingData)).toEqual(
        {
          levels: {
            loggingLevels: 'loggingLevels',
          },
          name: testSpecificMocks.loggingData.name,
          source: '',
        }
      );
    });

    it('when plugin was provided with logging source and with default name => returns options based on defaults, ignoring source', () => {
      testSpecificMocks.loggingData.name = consts.LOGGER_API;
      expect(loggingData.getOptions(testSpecificMocks.loggingData)).toEqual(
        {
          levels: {
            loggingLevels: 'loggingLevels',
          },
          name: consts.LOGGER_API,
          source: '',
        }
      );
    });
  });

});
