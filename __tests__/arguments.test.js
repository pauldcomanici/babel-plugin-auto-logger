// testing file
import loggingArguments, {privateApi} from './../src/arguments';

// dependencies
import * as types from '@babel/types';
// constants
import consts from './../src/constants';

// mocks
jest.mock('@babel/types');

describe('arguments.js', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.getDefault', () => {
    beforeAll(() => {
      jest.spyOn(types, 'stringLiteral');
    });
    beforeEach(() => {
      types.stringLiteral
        .mockReturnValueOnce('firstArg')
        .mockReturnValueOnce('name')
        .mockReturnValue('stringLiteral');

      testSpecificMocks.state = {
        file: {
          opts: {
            parserOpts: {
              sourceFileName: '/parsed/path/to/file/file-name.js',
              sourceMapTarget: 'parsed-file-name.js',
            },
            sourceFileName: '/path/to/file/file-name.js',
            sourceMapTarget: 'file-name.js',
          },
        },
      };
      testSpecificMocks.knownData = {
        column: 11,
        line: 22,
        name: 'functionName',
      };
    });
    afterEach(() => {
      types.stringLiteral.mockClear();
    });
    afterAll(() => {
      types.stringLiteral.mockRestore();
    });

    it('when `sourceMapTarget` has falsy value will use `sourceFileName` for file name', () => {
      testSpecificMocks.state.file.opts.sourceMapTarget = undefined;
      privateApi.getDefault(testSpecificMocks.state, testSpecificMocks.knownData);

      expect(types.stringLiteral.mock.calls[0]).toEqual(
        [
          '[/path/to/file/file-name.js:22:11]',
        ]
      );
    });

    it('when `sourceMapTarget` and `sourceFileName` has falsy value will use `parserOpts.sourceMapTarget` for file name', () => {
      testSpecificMocks.state.file.opts.sourceFileName = undefined;
      testSpecificMocks.state.file.opts.sourceMapTarget = undefined;
      privateApi.getDefault(testSpecificMocks.state, testSpecificMocks.knownData);

      expect(types.stringLiteral.mock.calls[0]).toEqual(
        [
          '[parsed-file-name.js:22:11]',
        ]
      );
    });

    it('when `sourceMapTarget`, `sourceFileName` and `parserOpts.sourceMapTarget` has falsy value will use `parserOpts.sourceFileName` for file name', () => {
      testSpecificMocks.state.file.opts.sourceFileName = undefined;
      testSpecificMocks.state.file.opts.sourceMapTarget = undefined;
      testSpecificMocks.state.file.opts.parserOpts.sourceMapTarget = undefined;
      privateApi.getDefault(testSpecificMocks.state, testSpecificMocks.knownData);

      expect(types.stringLiteral.mock.calls[0]).toEqual(
        [
          '[/parsed/path/to/file/file-name.js:22:11]',
        ]
      );
    });

    it('does not update source file name by removing root part when it has falsy value', () => {
      testSpecificMocks.state.file.opts.sourceFileName = undefined;
      testSpecificMocks.state.file.opts.sourceMapTarget = undefined;
      testSpecificMocks.state.file.opts.parserOpts = undefined;
      testSpecificMocks.state.file.opts.root = '/path/to/file';
      privateApi.getDefault(testSpecificMocks.state, testSpecificMocks.knownData);

      expect(types.stringLiteral.mock.calls[0]).toEqual(
        [
          '[undefined:22:11]',
        ]
      );
    });

    it('prepares source file path by extracting root path from it when root and source file name has truthy value', () => {
      testSpecificMocks.state.file.opts.sourceMapTarget = undefined;
      testSpecificMocks.state.file.opts.root = '/path/to/file';
      privateApi.getDefault(testSpecificMocks.state, testSpecificMocks.knownData);

      expect(types.stringLiteral.mock.calls[0]).toEqual(
        [
          '[/file-name.js:22:11]',
        ]
      );
    });

    it('prepares string literals that will be used as arguments for the logger method by`calling `types.stringLiteral` (for the first logger argument -> file name with line and column; and a second time for the second argument -> method name)', () => {
      privateApi.getDefault(testSpecificMocks.state, testSpecificMocks.knownData);

      expect(types.stringLiteral.mock.calls).toEqual(
        [
          [
            '[file-name.js:22:11]',
          ],
          [
            testSpecificMocks.knownData.name,
          ]
        ]
      );
    });

    it('returns an array with 2 items ([file:line:column], functionName)', () => {
      expect(privateApi.getDefault(
        testSpecificMocks.state,
        testSpecificMocks.knownData
      )).toEqual(
        [
          'firstArg',
          'name',
        ]
      );
    });
  });

  describe('privateApi.getFunctionArguments', () => {
    beforeAll(() => {
      jest.spyOn(types, 'isIdentifier').mockReturnValue(false);
      jest.spyOn(types, 'identifier').mockReturnValue('identifier');
    });
    beforeEach(() => {

      testSpecificMocks.path = {
        node: {
          params: [
            {
              name: 'identifier1',
            },
            {
              name: 'identifier2',
            },
            {
              name: 'identifier3',
            },
          ],
        },
      };

    });
    afterEach(() => {
      types.isIdentifier.mockClear();
      types.identifier.mockClear();
    });
    afterAll(() => {
      types.isIdentifier.mockRestore();
      types.identifier.mockRestore();
    });

    it('when the node does not have params => returns an empty array', () => {
      testSpecificMocks.path.node = {};

      expect(privateApi.getFunctionArguments(testSpecificMocks.path)).toEqual([]);
    });

    it('when the path does not have node => returns an empty array', () => {
      testSpecificMocks.path = {};

      expect(privateApi.getFunctionArguments(testSpecificMocks.path)).toEqual([]);
    });

    it('when the node has params => returns an array with every argument that is an identifier', () => {
      types.isIdentifier
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);
      types.identifier
        .mockReturnValueOnce('identifier1')
        .mockReturnValueOnce('identifier3');

      expect(privateApi.getFunctionArguments(testSpecificMocks.path)).toEqual(
        [
          'identifier1',
          'identifier3',
        ]
      );
    });

  });

  describe('privateApi.getOtherArguments', () => {
    beforeAll(() => {
      jest.spyOn(types, 'isCatchClause').mockReturnValue(false);
      jest.spyOn(types, 'identifier').mockReturnValue('identifier');
      jest.spyOn(privateApi, 'getFunctionArguments').mockReturnValue([
        'reason',
        'secondArg',
      ]);
    });
    beforeEach(() => {
      testSpecificMocks.path = {
        node: {
          param: {
            name: 'ex',
          },
        },
      };
      testSpecificMocks.knownData = {
        column: 11,
        line: 22,
        name: consts.MEMBER_EXPRESSION_CATCH,
      };
    });
    afterEach(() => {
      types.isCatchClause.mockClear();
      types.identifier.mockClear();
      privateApi.getFunctionArguments.mockClear();
    });
    afterAll(() => {
      types.isCatchClause.mockRestore();
      types.identifier.mockRestore();
      privateApi.getFunctionArguments.mockRestore();
    });

    it('determines if the path is from catch clause by calling `types.isCatchClause`', () => {
      privateApi.getOtherArguments(testSpecificMocks.path, testSpecificMocks.knownData);

      expect(types.isCatchClause).toHaveBeenCalledWith(
        testSpecificMocks.path
      );
    });

    it('if the path is from a catch clause => adds exception as argument for logger by calling `types.identifier` with identifier name', () => {
      types.isCatchClause.mockReturnValueOnce(true);

      privateApi.getOtherArguments(testSpecificMocks.path, testSpecificMocks.knownData);

      expect(types.identifier).toHaveBeenCalledWith(
        testSpecificMocks.path.node.param.name
      );
    });

    it('if the path is from a catch clause => returns an array with the exception as identifier', () => {
      types.isCatchClause.mockReturnValueOnce(true);

      expect(privateApi.getOtherArguments(testSpecificMocks.path, testSpecificMocks.knownData)).toEqual(
        [
          'identifier',
        ]
      );
    });

    it('if the path is not from a catch clause and name from knownData does not represent catch member expression => it will not determine function arguments (does not call `privateApi.getFunctionArguments`)', () => {
      testSpecificMocks.knownData = 'NOT_CATCH_MEMBER_EXPRESSION';

      privateApi.getOtherArguments(testSpecificMocks.path, testSpecificMocks.knownData);

      expect(privateApi.getFunctionArguments).not.toBeCalled();
    });

    it('if the path is not from a catch clause and name from knownData does not represent catch member expression => returns empty array', () => {
      testSpecificMocks.knownData = 'NOT_CATCH_MEMBER_EXPRESSION';

      expect(privateApi.getOtherArguments(testSpecificMocks.path, testSpecificMocks.knownData)).toEqual([]);
    });

    it('if the path is not from a catch clause and name from knownData represents catch member expression => determines function arguments by calling `privateApi.getFunctionArguments`', () => {
      privateApi.getOtherArguments(testSpecificMocks.path, testSpecificMocks.knownData);

      expect(privateApi.getFunctionArguments).toHaveBeenCalledWith(
        testSpecificMocks.path
      );
    });

    it('if the path is not from a catch clause and name from knownData represents catch member expression => prepares logging arguments by calling `types.identifier` for every argument of the function', () => {
      privateApi.getOtherArguments(testSpecificMocks.path, testSpecificMocks.knownData);

      expect(types.identifier.mock.calls).toEqual(
        [
          [
            'reason',
          ],
          [
            'secondArg',
          ]
        ]
      );
    });

    it('if the path is not from a catch clause and name from knownData represents catch member expression => returns an array with identifiers for every argument of the function', () => {
      expect(privateApi.getOtherArguments(testSpecificMocks.path, testSpecificMocks.knownData)).toEqual(
        [
          'identifier',
          'identifier',
        ]
      );
    });

  });

  describe('get', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getDefault').mockReturnValue(['default']);
      jest.spyOn(privateApi, 'getOtherArguments').mockReturnValue(['other']);
    });
    beforeEach(() => {
      testSpecificMocks.path = {
        node: {},
      };
      testSpecificMocks.state = {
        file: {},
      };
      testSpecificMocks.knownData = {
        column: 11,
        line: 22,
        name: 'functionName',
      };

    });
    afterEach(() => {
      privateApi.getDefault.mockClear();
      privateApi.getOtherArguments.mockClear();
    });
    afterAll(() => {
      privateApi.getDefault.mockRestore();
      privateApi.getOtherArguments.mockRestore();
    });

    it('prepares default arguments for logger member expression by calling `privateApi.getDefault`', () => {
      loggingArguments.get(testSpecificMocks.path, testSpecificMocks.state, testSpecificMocks.knownData);

      expect(privateApi.getDefault).toHaveBeenCalledWith(
        testSpecificMocks.state,
        testSpecificMocks.knownData
      );
    });

    it('prepares other arguments for logger member expression by calling `privateApi.getOtherArguments`', () => {
      loggingArguments.get(testSpecificMocks.path, testSpecificMocks.state, testSpecificMocks.knownData);

      expect(privateApi.getOtherArguments).toHaveBeenCalledWith(
        testSpecificMocks.path,
        testSpecificMocks.knownData
      );
    });

    it('returns an array with default arguments and other arguments', () => {
      expect(loggingArguments.get(testSpecificMocks.path, testSpecificMocks.state, testSpecificMocks.knownData))
        .toEqual(
          [
            'default',
            'other',
          ]
        );
    });

  });

});
