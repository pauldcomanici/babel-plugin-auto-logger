// testing file
import options, {privateApi} from './../src/options';

// dependencies
// constants
import consts from './../src/constants';

describe('options.js', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.getMatcher', () => {
    beforeEach(() => {
      testSpecificMocks.matcher = undefined;
      testSpecificMocks.matcherName = 'matcherName';
      testSpecificMocks.defaultMatcher = [
        'defaultMatcher',
        'anotherDefaultMatcher',
      ];
    });

    it('when matcher is an array with no item match => returns regular expression that will match everything', () => {
      testSpecificMocks.matcher = [];

      expect(privateApi.getMatcher(
        testSpecificMocks.matcher,
        testSpecificMocks.matcherName,
        testSpecificMocks.defaultMatcher
      )).toEqual(/(?:)/);
    });

    it('when matcher is an array with only one item => returns regular expression based on that item', () => {
      testSpecificMocks.matcher = [
        '.*.js$',
      ];

      expect(privateApi.getMatcher(
        testSpecificMocks.matcher,
        testSpecificMocks.matcherName,
        testSpecificMocks.defaultMatcher
      )).toEqual(/(.*.js$)/);
    });

    it('when matcher is an array with multiple items => returns regular expression based on every item, ignored falsy items', () => {
      testSpecificMocks.matcher = [
        '.*.js$',
        '.*.jsx$',
        '',
        '/src/js/',
        false,
      ];

      expect(privateApi.getMatcher(
        testSpecificMocks.matcher,
        testSpecificMocks.matcherName,
        testSpecificMocks.defaultMatcher
      )).toEqual(/(.*.js$)|(.*.jsx$)|(\/src\/js\/)/);
    });

    it('when matcher is a string with value => returns regular expression based on that string', () => {
      testSpecificMocks.matcher = '.js';

      expect(privateApi.getMatcher(
        testSpecificMocks.matcher,
        testSpecificMocks.matcherName,
        testSpecificMocks.defaultMatcher
      )).toEqual(/.js/);
    });

    it('when matcher has falsy value (empty string) => returns regular expression based on defaults', () => {
      testSpecificMocks.matcher = '';

      expect(privateApi.getMatcher(
        testSpecificMocks.matcher,
        testSpecificMocks.matcherName,
        testSpecificMocks.defaultMatcher
      )).toEqual(/(defaultMatcher)|(anotherDefaultMatcher)/);
    });

    it('when matcher has falsy value (empty string) => returns regular expression based on defaults (empty array if is not sent)', () => {
      testSpecificMocks.matcher = '';
      testSpecificMocks.defaultMatcher = undefined;

      expect(privateApi.getMatcher(
        testSpecificMocks.matcher,
        testSpecificMocks.matcherName,
        testSpecificMocks.defaultMatcher
      )).toEqual(/(?:)/);
    });

    it('when matcher has value that is not a string or array => throws error', () => {
      testSpecificMocks.matcher = {};

      expect(
        () => {
          privateApi.getMatcher(
            testSpecificMocks.matcher,
            testSpecificMocks.matcherName,
            testSpecificMocks.defaultMatcher
          );
        }
      ).toThrow('[babel-auto-logger-plugin] \'matcherName\' can be string or array with strings');
    });
  });

  describe('privateApi.getSourceMatcher', () => {
    it('returns an array with default source matcher (anything that ends with js or jsx)', () => {
      expect(privateApi.getSourceMatcher()).toEqual(
        [
          '.*js(x)?$',
        ]
      );
    });
  });

  describe('privateApi.getSourceExcludeMatcher', () => {
    it('returns an array with default source exclude matcher (anything that contains __mocks__, __tests__, __snapshots__, node_modules)', () => {
      expect(privateApi.getSourceExcludeMatcher()).toEqual(
        [
          '__fixtures__',
          '__mocks__',
          '__tests__',
          '__snapshots__',
          'node_modules',
        ]
      );
    });
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

  describe('privateApi.getLoggingData', () => {
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
      privateApi.getLoggingData(testSpecificMocks.loggingData);

      expect(privateApi.getLoggingLevels).toHaveBeenCalledWith(
        testSpecificMocks.loggingData.levels
      );
    });

    it('when plugin was provided with settings => returns options based on provided settings', () => {
      expect(privateApi.getLoggingData(testSpecificMocks.loggingData)).toEqual(
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
      expect(privateApi.getLoggingData(testSpecificMocks.loggingData)).toEqual(
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

      expect(privateApi.getLoggingData(testSpecificMocks.loggingData)).toEqual(
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
      expect(privateApi.getLoggingData(testSpecificMocks.loggingData)).toEqual(
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

  describe('prepare', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getMatcher').mockReturnValue('getMatcher');
      jest.spyOn(privateApi, 'getSourceMatcher').mockReturnValue('getSourceMatcher');
      jest.spyOn(privateApi, 'getSourceExcludeMatcher').mockReturnValue('getSourceExcludeMatcher');
      jest.spyOn(privateApi, 'getLoggingData').mockReturnValue('getLoggingData');
    });
    beforeEach(() => {
      testSpecificMocks.receivedOptions = {
        loggingData: {
          source: '',
        },
        sourceExcludeMatcher: 'sourceExcludeMatcher',
        sourceMatcher: 'sourceMatcher',
      };
    });
    afterEach(() => {
      privateApi.getMatcher.mockClear();
      privateApi.getSourceMatcher.mockClear();
      privateApi.getSourceExcludeMatcher.mockClear();
      privateApi.getLoggingData.mockClear();
    });
    afterAll(() => {
      privateApi.getMatcher.mockRestore();
      privateApi.getSourceMatcher.mockRestore();
      privateApi.getSourceExcludeMatcher.mockRestore();
      privateApi.getLoggingData.mockRestore();
    });

    it('retrieves default value for `sourceMatcher` option by calling `privateApi.getSourceMatcher`', () => {
      options.prepare(testSpecificMocks.receivedOptions);

      expect(privateApi.getSourceMatcher).toHaveBeenCalledWith();
    });

    it('prepares `sourceMatcher` option by calling `privateApi.getMatcher`', () => {
      options.prepare(testSpecificMocks.receivedOptions);

      expect(privateApi.getMatcher.mock.calls[0]).toEqual(
        [
          testSpecificMocks.receivedOptions.sourceMatcher,
          'sourceMatcher',
          privateApi.getSourceMatcher(),
        ]
      );
    });

    it('retrieves default value for `sourceExcludeMatcher` option by calling `privateApi.getSourceExcludeMatcher`', () => {
      options.prepare(testSpecificMocks.receivedOptions);

      expect(privateApi.getSourceExcludeMatcher).toHaveBeenCalledWith();
    });

    it('prepares `sourceExcludeMatcher` option by calling `privateApi.getMatcher`', () => {
      options.prepare(testSpecificMocks.receivedOptions);

      expect(privateApi.getMatcher.mock.calls[1]).toEqual(
        [
          testSpecificMocks.receivedOptions.sourceExcludeMatcher,
          'sourceExcludeMatcher',
          privateApi.getSourceExcludeMatcher(),
        ]
      );
    });

    it('prepares `loggingData` option by calling `privateApi.getLoggingData`', () => {
      options.prepare(testSpecificMocks.receivedOptions);

      expect(privateApi.getLoggingData).toHaveBeenCalledWith(
        testSpecificMocks.receivedOptions.loggingData
      );
    });

  });

});
