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

  describe('privateApi.logLevels', () => {
    it('is an object where the key is the log level and the value if the method used for that level when logging', () => {
      expect(privateApi.logLevels).toEqual(
        {
          debug: 'debug',
          error: 'error',
          info: 'info',
          log: 'log',
          warn: 'warn',
        }
      );
    });
  });

  describe('privateApi.supportedLogLevels', () => {
    it('is an array with strings that represent log levels', () => {
      expect(privateApi.supportedLogLevels).toEqual(
        [
          privateApi.logLevels.debug,
          privateApi.logLevels.error,
          privateApi.logLevels.info,
          privateApi.logLevels.log,
          privateApi.logLevels.warn,
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
      jest.spyOn(privateApi, 'getLogLevelData').mockReturnValue({
        logLevelData: 'logLevelData',
      });
    });
    beforeEach(() => {
      testSpecificMocks.loggingLevels = {
        log: {
          methodName: 'myLog',
        },
      };
    });
    afterEach(() => {
      privateApi.getLogLevelData.mockClear();
    });
    afterAll(() => {
      privateApi.getLogLevelData.mockRestore();
    });

    it('when plugin was provided with settings for every log level => retrieves settings for every supported log level using provided settings by calling `privateApi.getLogLevelData`', () => {
      privateApi.getLoggingLevels(testSpecificMocks.loggingLevels);

      expect(privateApi.getLogLevelData.mock.calls).toMatchSnapshot();
    });

    it('when plugin was not provided with settings for every log level => retrieves settings for every supported log level using default settings by calling `privateApi.getLogLevelData`', () => {
      testSpecificMocks.loggingLevels = {};
      privateApi.getLoggingLevels(testSpecificMocks.loggingLevels);

      expect(privateApi.getLogLevelData.mock.calls).toMatchSnapshot();
    });

    it('returns options for logging, taking in consideration every level', () => {
      expect(privateApi.getLoggingLevels(testSpecificMocks.loggingLevels)).toMatchSnapshot();
    });
  });

  describe('privateApi.getLogLevelForCatch', () => {
    it('when log level provided is not supported => returns error log level', () => {
      expect(privateApi.getLogLevelForCatch('not-supported-level')).toBe(
        privateApi.logLevels.error
      );
    });

    it('when log level provided is supported => returns provided log level', () => {
      expect(privateApi.getLogLevelForCatch(privateApi.logLevels.info)).toBe(
        privateApi.logLevels.info
      );
    });
  });

  describe('getOptions', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getLoggingLevels').mockReturnValue({
        loggingLevels: 'loggingLevels',
      });
      jest.spyOn(privateApi, 'getLogLevelForCatch').mockReturnValue('levelForCatch');
    });
    beforeEach(() => {
      testSpecificMocks.loggingData = {
        levelForMemberExpressionCatch: 'levelForMemberExpressionCatch',
        levelForTryCatch: 'levelForTryCatch',
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
      privateApi.getLogLevelForCatch.mockClear();
      privateApi.getLoggingLevels.mockClear();
    });
    afterAll(() => {
      privateApi.getLogLevelForCatch.mockRestore();
      privateApi.getLoggingLevels.mockRestore();
    });

    it('retrieves log level options by calling `privateApi.getLoggingLevels`', () => {
      loggingData.getOptions(testSpecificMocks.loggingData);

      expect(privateApi.getLoggingLevels).toHaveBeenCalledWith(
        testSpecificMocks.loggingData.levels
      );
    });

    it('when plugin was provided with settings => returns options based on provided settings', () => {
      expect(loggingData.getOptions(testSpecificMocks.loggingData)).toMatchSnapshot();
    });

    it('when plugin was not provided with settings => returns options based on defaults', () => {
      testSpecificMocks.loggingData = undefined;
      expect(loggingData.getOptions(testSpecificMocks.loggingData)).toMatchSnapshot();
    });

    it('when plugin was not provided with logging source and the name is not the default => returns options where source is an empty string', () => {
      testSpecificMocks.loggingData.source = undefined;

      expect(loggingData.getOptions(testSpecificMocks.loggingData)).toMatchSnapshot();
    });

    it('when plugin was provided with logging source and with default name => returns options based on defaults, ignoring source', () => {
      testSpecificMocks.loggingData.name = consts.LOGGER_API;
      expect(loggingData.getOptions(testSpecificMocks.loggingData)).toMatchSnapshot();
    });

    it('validates value for `levelForMemberExpressionCatch` and `levelForTryCatch` by calling `privateApi.getLogLevelForCatch`', () => {
      loggingData.getOptions(testSpecificMocks.loggingData);

      expect(privateApi.getLogLevelForCatch.mock.calls).toEqual(
        [
          [
            testSpecificMocks.loggingData.levelForMemberExpressionCatch,
          ],
          [
            testSpecificMocks.loggingData.levelForTryCatch,
          ],
        ]
      );
    });

    it('for `levelForMemberExpressionCatch` and `levelForTryCatch` will set value as it is returned by `privateApi.getLogLevelForCatch`', () => {
      privateApi.getLogLevelForCatch
        .mockReturnValueOnce('levelForMemberExpressionCatch')
        .mockReturnValueOnce('levelForTryCatch');

      expect(loggingData.getOptions(testSpecificMocks.loggingData)).toMatchSnapshot();
    });
  });

});
