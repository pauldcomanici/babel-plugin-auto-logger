// testing file
import options, {privateApi} from '../src/options';

// dependencies
// services
import loggingData from '../src/logging';
jest.mock('../src/logging');


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

  describe('prepare', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getMatcher').mockReturnValue('getMatcher');
      jest.spyOn(privateApi, 'getSourceMatcher').mockReturnValue('getSourceMatcher');
      jest.spyOn(privateApi, 'getSourceExcludeMatcher').mockReturnValue('getSourceExcludeMatcher');
      jest.spyOn(loggingData, 'getOptions').mockReturnValue('loggingData::loggingData');
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
      loggingData.getOptions.mockClear();
    });
    afterAll(() => {
      privateApi.getMatcher.mockRestore();
      privateApi.getSourceMatcher.mockRestore();
      privateApi.getSourceExcludeMatcher.mockRestore();
      loggingData.getOptions.mockRestore();
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

    it('prepares `loggingData` option by calling `loggingData.getOptions`', () => {
      options.prepare(testSpecificMocks.receivedOptions);

      expect(loggingData.getOptions).toHaveBeenCalledWith(
        testSpecificMocks.receivedOptions.loggingData
      );
    });

  });

});
