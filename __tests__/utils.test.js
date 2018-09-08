// testing file
import utils, {privateApi} from './../src/utils';

// dependencies
import * as types from '@babel/types';
// services
import loggingArguments from './../src/arguments';
// constants
import consts from './../src/constants';

// mocks
jest.mock('@babel/types');

describe('utils.js', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.hasLogging', () => {
    beforeAll(() => {
      // args & mocks are set to return true
      jest.spyOn(types, 'isExpressionStatement').mockReturnValue(true);
      jest.spyOn(types, 'isCallExpression').mockReturnValue(true);
      jest.spyOn(types, 'isMemberExpression').mockReturnValue(true);
      jest.spyOn(types, 'isIdentifier').mockReturnValue(true);
      jest.spyOn(utils, 'getLoggerName').mockReturnValue('myNamedLogger');
    });
    beforeEach(() => {
      testSpecificMocks.bodyNode = {
        expression: {
          callee: {
            object: {
              name: 'myNamedLogger',
            },
          },
        },
        type: 'ExpressionStatement',
      };
      testSpecificMocks.state = {
        babelPluginLoggerSettings: {},
      };
    });
    afterEach(() => {
      types.isExpressionStatement.mockClear();
      types.isCallExpression.mockClear();
      types.isMemberExpression.mockClear();
      types.isIdentifier.mockClear();
      utils.getLoggerName.mockClear();
    });
    afterAll(() => {
      types.isExpressionStatement.mockRestore();
      types.isCallExpression.mockRestore();
      types.isMemberExpression.mockRestore();
      types.isIdentifier.mockRestore();
      utils.getLoggerName.mockRestore();
    });

    it('determines if the node is an expression statement by calling `types.isExpressionStatement`', () => {
      types.isExpressionStatement.mockReturnValueOnce(false);

      privateApi.hasLogging(testSpecificMocks.bodyNode, testSpecificMocks.state);

      expect(types.isExpressionStatement).toHaveBeenCalledWith(testSpecificMocks.bodyNode);
    });

    it('if node is not an expression statement => returns false', () => {
      types.isExpressionStatement.mockReturnValueOnce(false);

      expect(privateApi.hasLogging(testSpecificMocks.bodyNode, testSpecificMocks.state)).toEqual(false);
    });

    it('if node is an expression statement => determines if the expression is a call expression by calling `types.isCallExpression`', () => {
      types.isCallExpression.mockReturnValueOnce(false);

      privateApi.hasLogging(testSpecificMocks.bodyNode, testSpecificMocks.state);

      expect(types.isCallExpression).toHaveBeenCalledWith(testSpecificMocks.bodyNode.expression);
    });

    it('if node is an expression statement and that expression is not a call expression => returns false', () => {
      types.isCallExpression.mockReturnValueOnce(false);

      expect(privateApi.hasLogging(testSpecificMocks.bodyNode, testSpecificMocks.state)).toEqual(false);
    });

    it('if node is an expression statement and that expression is a call expression => determines if expression has members by calling `types.isMemberExpression`', () => {
      types.isMemberExpression.mockReturnValueOnce(false);

      privateApi.hasLogging(testSpecificMocks.bodyNode, testSpecificMocks.state);

      expect(types.isMemberExpression).toHaveBeenCalledWith(testSpecificMocks.bodyNode.expression.callee);
    });

    it('if node is an expression statement, that expression is a call expression and callee is not a member expression => returns false', () => {
      types.isMemberExpression.mockReturnValueOnce(false);

      expect(privateApi.hasLogging(testSpecificMocks.bodyNode, testSpecificMocks.state)).toEqual(false);
    });

    it('if node is an expression statement, that expression is a call expression and callee is a member expression => determines if member represents an identifier by calling `types.isIdentifier`', () => {
      types.isIdentifier.mockReturnValueOnce(false);

      privateApi.hasLogging(testSpecificMocks.bodyNode, testSpecificMocks.state);

      expect(types.isIdentifier).toHaveBeenCalledWith(testSpecificMocks.bodyNode.expression.callee.object);
    });

    it('if node is an expression statement, that expression is a call expression and callee is a member expression and member does not represent an identifier => returns false', () => {
      types.isIdentifier.mockReturnValueOnce(false);

      expect(privateApi.hasLogging(testSpecificMocks.bodyNode, testSpecificMocks.state)).toEqual(false);
    });

    it('if node is an expression statement, that expression is a call expression, callee is a member expression and member represents an identifier => retrieves logger name by calling `getLoggerName`', () => {
      utils.getLoggerName.mockReturnValueOnce('otherLogger');

      privateApi.hasLogging(testSpecificMocks.bodyNode, testSpecificMocks.state);

      expect(utils.getLoggerName).toHaveBeenCalledWith(testSpecificMocks.state);
    });

    it('if node is an expression statement, that expression is a call expression, callee is a member expression, member represents an identifier and logger name is not equal with callee name => returns false', () => {
      utils.getLoggerName.mockReturnValueOnce('otherLogger');

      expect(privateApi.hasLogging(testSpecificMocks.bodyNode, testSpecificMocks.state)).toEqual(false);
    });

    it('if node is an expression statement, that expression is a call expression, callee is a member expression, member represents an identifier and logger name is equal with callee name => returns true', () => {
      expect(privateApi.hasLogging(testSpecificMocks.bodyNode, testSpecificMocks.state)).toEqual(true);
    });
  });

  describe('privateApi.canBeAdded', () => {
    beforeAll(() => {
      jest.spyOn(types, 'isBlockStatement').mockReturnValue(true);
      jest.spyOn(privateApi, 'hasLogging').mockReturnValue(false);
    });
    beforeEach(() => {
      testSpecificMocks.path = {
        node: {
          body: [
            {
              type: 'ExpressionStatement',
            },
          ],
        },
        type: 'BlockStatement',
      };
      testSpecificMocks.state = {
        babelPluginLoggerSettings: {},
      };
    });
    afterEach(() => {
      types.isBlockStatement.mockClear();
      privateApi.hasLogging.mockClear();
    });
    afterAll(() => {
      types.isBlockStatement.mockRestore();
      privateApi.hasLogging.mockRestore();
    });

    it('determines if the path is a block statement by calling `types.isBlockStatement`', () => {
      types.isBlockStatement.mockReturnValueOnce(false);

      privateApi.canBeAdded(testSpecificMocks.path, testSpecificMocks.state);

      expect(types.isBlockStatement).toHaveBeenCalledWith(testSpecificMocks.path);
    });

    it('if the path is not a block statement => returns false', () => {
      types.isBlockStatement.mockReturnValueOnce(false);

      expect(privateApi.canBeAdded(testSpecificMocks.path, testSpecificMocks.state)).toEqual(false);
    });

    it('if the path is a block statement will iterate over every block item to find if logger was already added by calling `privateApi.hasLogging`', () => {
      privateApi.canBeAdded(testSpecificMocks.path, testSpecificMocks.state);

      expect(privateApi.hasLogging.mock.calls[0]).toEqual(
        [
          {
            type: 'ExpressionStatement',
          },
          testSpecificMocks.state,
        ]
      );
    });

    it('if the path is a block statement and logging was found (result from `privateApi.hasLogging`) => returns false', () => {
      privateApi.hasLogging.mockReturnValueOnce(true);

      expect(privateApi.canBeAdded(testSpecificMocks.path, testSpecificMocks.state)).toEqual(false);
    });

    it('if the path is a block statement and logging was not found (result from `privateApi.hasLogging`) => returns true', () => {
      expect(privateApi.canBeAdded(testSpecificMocks.path, testSpecificMocks.state)).toEqual(true);
    });
  });

  describe('privateApi.getPathForInsert', () => {
    beforeAll(() => {
      jest.spyOn(types, 'isBlockStatement').mockReturnValue(true);
      jest.spyOn(types, 'isArrowFunctionExpression').mockReturnValue(true);
    });
    beforeEach(() => {
      testSpecificMocks.insertPath = {
        body: {},
        type: 'BlockStatement',
      };
      testSpecificMocks.insertPathTemp = {
        get: jest.fn().mockReturnValue(
          testSpecificMocks.insertPath
        ),
      };
      testSpecificMocks.path = {
        get: jest.fn().mockReturnValue(
          testSpecificMocks.insertPathTemp
        ),
      };
    });
    afterEach(() => {
      types.isBlockStatement.mockClear();
      types.isArrowFunctionExpression.mockClear();

      testSpecificMocks.path.get.mockRestore();
    });
    afterAll(() => {
      types.isBlockStatement.mockRestore();
      types.isArrowFunctionExpression.mockRestore();
    });

    it('retrieves the node block by calling `path.get`', () => {
      privateApi.getPathForInsert(testSpecificMocks.path);

      expect(testSpecificMocks.path.get).toHaveBeenCalledWith('body');
    });

    it('determines if the path is a block statement by calling `types.isBlockStatement`', () => {
      privateApi.getPathForInsert(testSpecificMocks.path);

      expect(types.isBlockStatement).toHaveBeenCalledWith(testSpecificMocks.insertPathTemp);
    });

    it('if body from path is a block statement => will return the node body (result from `path.get`)', () => {
      expect(privateApi.getPathForInsert(testSpecificMocks.path)).toEqual(testSpecificMocks.insertPathTemp);
    });

    it('if body from path is not a block statement => determines if is an arrow function by calling `types.isArrowFunctionExpression`', () => {
      types.isBlockStatement.mockReturnValueOnce(false);
      types.isArrowFunctionExpression.mockReturnValueOnce(false);

      privateApi.getPathForInsert(testSpecificMocks.path);

      expect(types.isArrowFunctionExpression).toHaveBeenCalledWith(testSpecificMocks.insertPathTemp);
    });

    it('if body from path is not a block statement and is not an arrow function => returns undefined', () => {
      types.isBlockStatement.mockReturnValueOnce(false);
      types.isArrowFunctionExpression.mockReturnValueOnce(false);

      expect(privateApi.getPathForInsert(testSpecificMocks.path)).toBeUndefined();
    });

    it('if body from path is not a block statement and is an arrow function => re-checks path for insert by calling `privateApi.getPathForInsert`', () => {
      testSpecificMocks.spyGetPathForInsert = jest.spyOn(privateApi, 'getPathForInsert');
      // TODO: I shouldn't use this spy
      types.isBlockStatement.mockReturnValueOnce(false);

      privateApi.getPathForInsert(testSpecificMocks.path);

      expect(privateApi.getPathForInsert).toHaveBeenCalledWith(testSpecificMocks.insertPathTemp);
    });

    it('if body from path is not a block statement and is an arrow function => returns result from second call to `privateApi.getPathForInsert` where the new path is a block statement', () => {
      types.isBlockStatement.mockReturnValueOnce(false);

      expect(privateApi.getPathForInsert(testSpecificMocks.path)).toEqual(testSpecificMocks.insertPath);
    });

    it('if body from path is not a block statement and is an arrow function => returns result from second call to `privateApi.getPathForInsert` where the new path is not a block statement and also not an arrow function', () => {
      types.isBlockStatement
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false);
      types.isArrowFunctionExpression
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      expect(privateApi.getPathForInsert(testSpecificMocks.path)).toBeUndefined();
    });
  });

  describe('privateApi.getLocation', () => {
    beforeEach(() => {
      testSpecificMocks.path = {
        node: {
          loc: {
            start: {
              column: 11,
              line: 22,
            },
          },
        },
      };
    });

    it('returns start column and line when the node from path has expected model', () => {
      expect(privateApi.getLocation(testSpecificMocks.path)).toEqual(
        {
          column: 11,
          line: 22,
        }
      );
    });

    it('returns undefined values for start column and line when the node from path has node property as falsy value', () => {
      testSpecificMocks.path.node = undefined;

      expect(privateApi.getLocation(testSpecificMocks.path)).toEqual(
        {
          column: undefined,
          line: undefined,
        }
      );
    });

    it('returns undefined values for start column and line when the node from path has some missing parts from model', () => {
      testSpecificMocks.path.node = {};

      expect(privateApi.getLocation(testSpecificMocks.path)).toEqual(
        {
          column: undefined,
          line: undefined,
        }
      );
    });
  });

  describe('privateApi.getName', () => {
    beforeAll(() => {
      jest.spyOn(types, 'isCatchClause').mockReturnValue(false);
    });
    beforeEach(() => {
      testSpecificMocks.path = {};
    });
    afterEach(() => {
      types.isCatchClause.mockClear();
    });
    afterAll(() => {
      types.isCatchClause.mockRestore();
    });

    it('determines if the path is from a catch clause by calling `types.isCatchClause`', () => {
      privateApi.getName(testSpecificMocks.path);

      expect(types.isCatchClause).toHaveBeenCalledWith(
        testSpecificMocks.path
      );
    });

    it('if the path represents a catch clause => returns `catchClause` string', () => {
      types.isCatchClause.mockReturnValueOnce(true);

      expect(privateApi.getName(testSpecificMocks.path)).toEqual(
        'catchClause'
      );
    });

    it('if the path represents a function declaration => returns function name', () => {
      testSpecificMocks.path.node = {
        id: {
          name: 'myFunction',
        },
      };

      expect(privateApi.getName(testSpecificMocks.path)).toEqual(
        'myFunction'
      );
    });

    it('if the path represents a variable declaration where value is an anonymous function => returns variable name', () => {
      testSpecificMocks.path.container = {
        id: {
          name: 'myVar',
        },
      };

      expect(privateApi.getName(testSpecificMocks.path)).toEqual(
        'myVar'
      );
    });

    it('if the path represents an expression declaration, object property assignment, where value is an anonymous function => returns property name', () => {
      testSpecificMocks.path.parent = {
        left: {
          property: {
            name: 'objPropertyName',
          },
        },
      };

      expect(privateApi.getName(testSpecificMocks.path)).toEqual(
        'objPropertyName'
      );
    });

    it('if the path represents an expression declaration, property assignment, where value is an anonymous function => returns property name', () => {
      testSpecificMocks.path.parent = {
        left: {
          name: 'propertyName',
        },
      };

      expect(privateApi.getName(testSpecificMocks.path)).toEqual(
        'propertyName'
      );
    });

    it('if the path represents a method from object or class on the prototype => returns method name', () => {
      testSpecificMocks.path.node = {
        key: {
          name: 'prototypeMethodName',
        },
      };

      expect(privateApi.getName(testSpecificMocks.path)).toEqual(
        'prototypeMethodName'
      );
    });

    it('if the path represents a method from object or class on the instance (auto bind) => returns method name', () => {
      testSpecificMocks.path.parent = {
        key: {
          name: 'instanceMethodName',
        },
      };

      expect(privateApi.getName(testSpecificMocks.path)).toEqual(
        'instanceMethodName'
      );
    });

    it('if the path represents a function that is used as callback for a member expression that has name `catch` => returns constant value', () => {
      testSpecificMocks.path.parent = {
        callee: {
          property: {
            name: 'catch',
          },
        },
      };

      expect(privateApi.getName(testSpecificMocks.path)).toEqual(
        consts.MEMBER_EXPRESSION_CATCH
      );
    });

    it('if the path represents a list (Array) and the key of the item is a valid integer => returns string that contains array index and is prefixed with `array-item`', () => {
      testSpecificMocks.path = {
        inList: true,
        key: 2,
      };

      expect(privateApi.getName(testSpecificMocks.path)).toBe(
        'array-item-2'
      );
    });

    it('if it does not match any known case => returns `undefined`', () => {
      expect(privateApi.getName(testSpecificMocks.path)).toBeUndefined();
    });
  });

  describe('privateApi.getLogLevel', () => {
    // Note: this function will be updated to support different levels
    beforeAll(() => {
      jest.spyOn(types, 'isCatchClause').mockReturnValue(false);
    });
    beforeEach(() => {
      testSpecificMocks.path = {
        node: {},
      };
      testSpecificMocks.state = {
        babelPluginLoggerSettings: {
          loggingData: {
            levelForMemberExpressionCatch: 'debug',
            levelForTryCatch: 'info',
            levels: {
              debug: {
                methodName: 'debugMethod',
              },
              error: {
                methodName: 'errorMethod',
              },
              info: {
                methodName: 'infoMethod',
              },
              log: {
                methodName: 'logMethod',
              },
              warn: {
                methodName: 'warnMethod',
              },
            },
          },
        },
      };
      testSpecificMocks.knownData = {
        column: 11,
        line: 22,
        name: 'NOT_CATCH_MEMBER_EXPRESSION',
      };
    });
    afterEach(() => {
      types.isCatchClause.mockClear();
    });
    afterAll(() => {
      types.isCatchClause.mockRestore();
    });

    it('determines if the path is from a catch clause by calling `types.isCatchClause`', () => {
      privateApi.getLogLevel(testSpecificMocks.path, testSpecificMocks.state, testSpecificMocks.knownData);

      expect(types.isCatchClause).toHaveBeenCalledWith(
        testSpecificMocks.path
      );
    });

    it('if the path represents a catch clause => returns method name based on level from `levelForTryCatch`', () => {
      types.isCatchClause.mockReturnValueOnce(true);

      expect(privateApi.getLogLevel(
        testSpecificMocks.path,
        testSpecificMocks.state,
        testSpecificMocks.knownData
      )).toEqual(
        'infoMethod'
      );
    });

    it('if the path represents catch member expression => returns method name on level from `levelForMemberExpressionCatch`', () => {
      testSpecificMocks.knownData.name = consts.MEMBER_EXPRESSION_CATCH;

      expect(privateApi.getLogLevel(
        testSpecificMocks.path,
        testSpecificMocks.state,
        testSpecificMocks.knownData
      )).toEqual(
        'debugMethod'
      );
    });

    it('if the path does not represents a catch clause or catch member expression => returns method name for log level', () => {
      expect(privateApi.getLogLevel(
        testSpecificMocks.path,
        testSpecificMocks.state,
        testSpecificMocks.knownData
      )).toEqual(
        'logMethod'
      );
    });
  });

  describe('getLoggerName', () => {
    beforeEach(() => {
      testSpecificMocks.state = {
        babelPluginLoggerSettings: {
          loggingData: {
            name: 'logger',
          },
        },
      };
    });

    it('returns the name used for the logger', () => {
      expect(utils.getLoggerName(testSpecificMocks.state)).toEqual('logger');
    });
  });

  describe('getLoggerSource', () => {
    beforeEach(() => {
      testSpecificMocks.state = {
        babelPluginLoggerSettings: {
          loggingData: {
            source: '',
          },
        },
      };
    });

    it('returns the source for the logger (logger package name as was set in plugin settings)', () => {
      expect(utils.getLoggerSource(testSpecificMocks.state)).toEqual('');
    });
  });

  describe('isValidPathAndState', () => {
    beforeEach(() => {
      testSpecificMocks.path = {
        node: {
          _generated: false,
        },
      };
      testSpecificMocks.state = {
        file: {
          opts: {
            filename: '/Users/dec/src/modules/test/index.js',
          },
        },
        babelPluginLoggerSettings: {
          sourceMatcher: /.*/,
          sourceExcludeMatcher: /.*/,
        },
      };
    });

    it('if the node was generated (by other plugin) => returns false', () => {
      testSpecificMocks.path.node._generated = true;

      expect(utils.isValidPathAndState(testSpecificMocks.path, testSpecificMocks.state)).toEqual(false);
    });

    it('if file name is not matched by source matcher => returns false', () => {
      testSpecificMocks.state.babelPluginLoggerSettings.sourceMatcher = /source/;

      expect(utils.isValidPathAndState(testSpecificMocks.path, testSpecificMocks.state)).toEqual(false);
    });

    it('if file name is matched by source matcher and source exclude matcher => returns false', () => {
      expect(utils.isValidPathAndState(testSpecificMocks.path, testSpecificMocks.state)).toEqual(false);
    });

    it('if file name is matched by source matcher and is not matched by source exclude matcher => returns true', () => {
      testSpecificMocks.state.babelPluginLoggerSettings.sourceExcludeMatcher = /exclusion/;

      expect(utils.isValidPathAndState(testSpecificMocks.path, testSpecificMocks.state)).toEqual(true);
    });
  });

  describe('addLogger', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getName').mockReturnValue('functionName');
      jest.spyOn(privateApi, 'getPathForInsert');
      jest.spyOn(privateApi, 'getLocation').mockReturnValue({
        column: 12,
        line: 72,
      });
      jest.spyOn(privateApi, 'canBeAdded').mockReturnValue(true);
      jest.spyOn(privateApi, 'getLogLevel').mockReturnValue('debug');
      jest.spyOn(utils, 'getLoggerName').mockReturnValue('myAwesomeLogger');
      jest.spyOn(loggingArguments, 'get').mockReturnValue([
        'arg1',
        'arg2',
      ]);

      jest.spyOn(types, 'expressionStatement').mockReturnValue('expressionStatement');
      jest.spyOn(types, 'callExpression').mockReturnValue('callExpression');
      jest.spyOn(types, 'memberExpression').mockReturnValue('memberExpression');
      jest.spyOn(types, 'identifier')
        .mockReturnValueOnce('loggerName')
        .mockReturnValueOnce('loggerLevel');
    });
    beforeEach(() => {
      testSpecificMocks.insertPath = {
        node: {},
        unshiftContainer: jest.fn(),
      };
      privateApi.getPathForInsert.mockReturnValue(testSpecificMocks.insertPath);

      testSpecificMocks.path = {
        node: {},
      };
      testSpecificMocks.state = {
        babelPluginLoggerSettings: {},
      };
    });
    afterEach(() => {
      privateApi.getName.mockClear();
      privateApi.getPathForInsert.mockClear();
      privateApi.getLocation.mockClear();
      privateApi.canBeAdded.mockClear();
      privateApi.getLogLevel.mockClear();
      utils.getLoggerName.mockClear();
      loggingArguments.get.mockClear();

      types.expressionStatement.mockClear();
      types.callExpression.mockClear();
      types.memberExpression.mockClear();
      types.identifier.mockClear();
    });
    afterAll(() => {
      privateApi.getName.mockRestore();
      privateApi.getPathForInsert.mockRestore();
      privateApi.getLocation.mockRestore();
      privateApi.canBeAdded.mockRestore();
      privateApi.getLogLevel.mockRestore();
      utils.getLoggerName.mockRestore();
      loggingArguments.get.mockRestore();

      types.expressionStatement.mockRestore();
      types.callExpression.mockRestore();
      types.memberExpression.mockRestore();
      types.identifier.mockRestore();
    });

    it('retrieves the function name by calling `privateApi.getName`', () => {
      privateApi.getName.mockReturnValueOnce(undefined);

      utils.addLogger(testSpecificMocks.path, testSpecificMocks.state);

      expect(privateApi.getName).toHaveBeenCalledWith(
        testSpecificMocks.path
      );
    });

    it('if function name is not retrieved => returns false', () => {
      privateApi.getName.mockReturnValueOnce(undefined);

      expect(utils.addLogger(testSpecificMocks.path, testSpecificMocks.state)).toBe(false);
    });

    it('if function name is retrieved => retrieve path where logger should be added by calling `privateApi.getPathForInsert`', () => {
      privateApi.getPathForInsert.mockReturnValueOnce(undefined);

      utils.addLogger(testSpecificMocks.path, testSpecificMocks.state);

      expect(privateApi.getPathForInsert).toHaveBeenCalledWith(
        testSpecificMocks.path
      );
    });

    it('if path where logger should be added has falsy value => returns false', () => {
      privateApi.getPathForInsert.mockReturnValueOnce(undefined);

      expect(utils.addLogger(testSpecificMocks.path, testSpecificMocks.state)).toBe(false);
    });

    it('if path where logger should be added has truthy value => retrieves line and column for the code by calling `privateApi.getLocation`', () => {
      privateApi.getLocation.mockReturnValueOnce({});

      utils.addLogger(testSpecificMocks.path, testSpecificMocks.state);

      expect(privateApi.getLocation).toHaveBeenCalledWith(
        testSpecificMocks.insertPath
      );
    });

    it('if line or column have value as undefined => returns false', () => {
      privateApi.getLocation.mockReturnValueOnce({});

      expect(utils.addLogger(testSpecificMocks.path, testSpecificMocks.state)).toBe(false);
    });

    it('if line and column have value not as undefined => determines if logger can be added for specified path by calling `privateApi.canBeAdded`', () => {
      privateApi.canBeAdded.mockReturnValueOnce(false);

      utils.addLogger(testSpecificMocks.path, testSpecificMocks.state);

      expect(privateApi.canBeAdded).toHaveBeenCalledWith(
        testSpecificMocks.insertPath,
        testSpecificMocks.state
      );
    });

    it('if logger cannot be added for specified path => returns false', () => {
      privateApi.canBeAdded.mockReturnValueOnce(false);

      expect(utils.addLogger(testSpecificMocks.path, testSpecificMocks.state)).toBe(false);
    });

    it('if logger can be added for specified path => retrieves expression arguments by calling `loggingArguments.get` (result will be used by call expression)', () => {
      utils.addLogger(testSpecificMocks.path, testSpecificMocks.state);

      expect(loggingArguments.get).toHaveBeenCalledWith(
        testSpecificMocks.path,
        testSpecificMocks.state,
        {
          column: 12,
          line: 72,
          name: 'functionName',
        }
      );
    });

    it('if logger can be added for specified path => retrieves first identifier string for member expression property by calling `getLoggerName`', () => {
      utils.addLogger(testSpecificMocks.path, testSpecificMocks.state);

      expect(utils.getLoggerName).toHaveBeenCalledWith(
        testSpecificMocks.state,
      );
    });

    it('if logger can be added for specified path => retrieves second identifier string (method name) for member expression property by calling `privateApi.getLogLevel`', () => {
      utils.addLogger(testSpecificMocks.path, testSpecificMocks.state);

      expect(privateApi.getLogLevel).toHaveBeenCalledWith(
        testSpecificMocks.path,
        testSpecificMocks.state,
        {
          column: 12,
          line: 72,
          name: 'functionName',
        }
      );
    });

    it('if logger can be added for specified path => prepares identifiers for the member expression by calling `types.identifier` with logger name and logger method', () => {
      utils.addLogger(testSpecificMocks.path, testSpecificMocks.state);

      expect(types.identifier.mock.calls).toEqual(
        [
          [
            'myAwesomeLogger',
          ],
          [
            'debug',
          ],
        ]
      );
    });

    it('if logger can be added for specified path => prepares call expression with a member expression and arguments list by calling `types.callExpression`', () => {
      utils.addLogger(testSpecificMocks.path, testSpecificMocks.state);

      expect(types.callExpression).toHaveBeenCalledWith(
        'memberExpression',
        [
          'arg1',
          'arg2',
        ]
      );
    });

    it('if logger can be added for specified path => prepares expression statement, argument is the call expression by calling `types.expressionStatement`', () => {
      utils.addLogger(testSpecificMocks.path, testSpecificMocks.state);

      expect(types.expressionStatement).toHaveBeenCalledWith(
        'callExpression'
      );
    });

    it('if logger can be added for specified path => inserts expression statement to the body of the path by calling `insertPath.unshiftContainer`', () => {
      utils.addLogger(testSpecificMocks.path, testSpecificMocks.state);

      expect(testSpecificMocks.insertPath.unshiftContainer).toHaveBeenCalledWith(
        'body',
        'expressionStatement'
      );
    });

    it('if logger can be added for specified path => returns true', () => {
      expect(utils.addLogger(testSpecificMocks.path, testSpecificMocks.state)).toEqual(true);
    });
  });

});
