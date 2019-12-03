import * as types from '@babel/types';

// testing file
import visitors from '../src/visitors';

// dependencies
jest.mock('@babel/types');
// services
import utils from '../src/utils';
// constants
import consts from '../src/constants';


describe('visitors.js', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('program', () => {
    beforeAll(() => {
      jest.spyOn(types, 'identifier').mockReturnValue('identifier');
      jest.spyOn(types, 'importDeclaration').mockReturnValue('importDeclaration');
      jest.spyOn(types, 'importDefaultSpecifier').mockReturnValue('importDefaultSpecifier');
      jest.spyOn(types, 'stringLiteral').mockReturnValue('stringLiteral');

      jest.spyOn(utils, 'isValidPathAndState').mockReturnValue(true);
      jest.spyOn(utils, 'getLoggerName').mockReturnValue('myCustomLoggerThatIsNotTheDefault1234567890');
      jest.spyOn(utils, 'getLoggerSource').mockReturnValue('logger');
    });

    beforeEach(() => {
      testSpecificMocks.path = {
        scope: {
          bindings: {},
        },
        unshiftContainer: jest.fn(),
      };
      testSpecificMocks.state = {
        babelPluginLoggerSettings: {},
      };
    });
    afterEach(() => {
      types.identifier.mockClear();
      types.importDeclaration.mockClear();
      types.importDefaultSpecifier.mockClear();
      types.stringLiteral.mockClear();

      utils.isValidPathAndState.mockClear();
      utils.getLoggerName.mockClear();
      utils.getLoggerSource.mockClear();

      testSpecificMocks.path.unshiftContainer.mockClear();
    });
    afterAll(() => {
      types.identifier.mockRestore();
      types.importDeclaration.mockRestore();
      types.importDefaultSpecifier.mockRestore();
      types.stringLiteral.mockRestore();

      utils.isValidPathAndState.mockRestore();
      utils.getLoggerName.mockRestore();
      utils.getLoggerSource.mockRestore();
    });

    it('determines if path is valid by calling `utils.isValidPathAndState`', () => {
      visitors.program(testSpecificMocks.path, testSpecificMocks.state);

      expect(utils.isValidPathAndState).toHaveBeenCalledWith(
        testSpecificMocks.path,
        testSpecificMocks.state
      );
    });

    it('when path is valid (result from `utils.isValidPathAndState`) => retrieves the name under which logger package will be imported by calling `utils.getLoggerName`', () => {
      visitors.program(testSpecificMocks.path, testSpecificMocks.state);

      expect(utils.getLoggerName).toHaveBeenCalledWith(
        testSpecificMocks.state
      );
    });

    it('when path is valid, will test if logger package was already imported under that name and if it was not or is not the default logger => will add to the top of the body import declaration for logger', () => {
      visitors.program(testSpecificMocks.path, testSpecificMocks.state);

      expect(testSpecificMocks.path.unshiftContainer).toHaveBeenCalledWith(
        'body',
        types.importDeclaration(),
      );
    });

    it('when path is valid and logger was not already imported or is not the default logger => will prepare identifier for default import specifier by calling `types.identifier`', () => {
      visitors.program(testSpecificMocks.path, testSpecificMocks.state);

      expect(types.identifier).toHaveBeenCalledWith(
        utils.getLoggerName()
      );
    });

    it('when path is valid and logger was not already imported or is not the default logger => will prepare default import specifier by calling `types.importDefaultSpecifier`', () => {
      visitors.program(testSpecificMocks.path, testSpecificMocks.state);

      expect(types.importDefaultSpecifier).toHaveBeenCalledWith(
        types.identifier()
      );
    });

    it('when path is valid and logger was not already imported or is not the default logger => will prepare logger source path by calling `utils.getLoggerSource`', () => {
      visitors.program(testSpecificMocks.path, testSpecificMocks.state);

      expect(utils.getLoggerSource).toHaveBeenCalledWith(
        testSpecificMocks.state
      );
    });

    it('when path is valid and logger was not already imported or is not the default logger => will prepare string literal value for the second argument of import declaration by calling `types.stringLiteral`', () => {
      visitors.program(testSpecificMocks.path, testSpecificMocks.state);

      expect(types.stringLiteral).toHaveBeenCalledWith(
        utils.getLoggerSource()
      );
    });

    it('when path is valid and logger was not already imported or is not the default logger => will prepare import declaration by calling `types.importDeclaration`', () => {
      visitors.program(testSpecificMocks.path, testSpecificMocks.state);

      expect(types.importDeclaration).toHaveBeenCalledWith(
        [
          types.importDefaultSpecifier(),
        ],
        types.stringLiteral()
      );
    });

    it('when path is not valid => nothing will happen', () => {
      utils.isValidPathAndState.mockReturnValueOnce(false);

      visitors.program(testSpecificMocks.path, testSpecificMocks.state);

      expect(utils.getLoggerName).not.toHaveBeenCalled();
    });

    it('when path is valid and logger name matches default logger => nothing will happen', () => {
      utils.getLoggerName.mockReturnValueOnce(consts.LOGGER_API);

      visitors.program(testSpecificMocks.path, testSpecificMocks.state);

      expect(testSpecificMocks.path.unshiftContainer).not.toHaveBeenCalled();
    });

    it('when path is valid and logger name was already imported in file => nothing will happen', () => {
      testSpecificMocks.path.scope.bindings.myCustomLoggerThatIsNotTheDefault1234567890 = {};

      visitors.program(testSpecificMocks.path, testSpecificMocks.state);

      expect(testSpecificMocks.path.unshiftContainer).not.toHaveBeenCalled();
    });

  });

  describe('insertExpressionStatement', () => {
    beforeAll(() => {
      jest.spyOn(utils, 'isValidPathAndState').mockReturnValue(false);
      jest.spyOn(utils, 'addLogger').mockReturnValue(undefined);
    });
    beforeEach(() => {
      testSpecificMocks.path = {
        node: {},
      };
      testSpecificMocks.state = {
        babelPluginLoggerSettings: {},
      };
    });
    afterEach(() => {
      utils.isValidPathAndState.mockClear();
      utils.addLogger.mockClear();
    });
    afterAll(() => {
      utils.isValidPathAndState.mockRestore();
      utils.addLogger.mockRestore();
    });

    it('determines if path is valid by calling `utils.isValidPathAndState`', () => {
      visitors.insertExpressionStatement(testSpecificMocks.path, testSpecificMocks.state);

      expect(utils.isValidPathAndState).toHaveBeenCalledWith(
        testSpecificMocks.path,
        testSpecificMocks.state
      );
    });

    it('when path is valid (result from `utils.isValidPathAndState`) => adds logger to source code by calling `utils.addLogger`', () => {
      utils.isValidPathAndState.mockReturnValueOnce(true);

      visitors.insertExpressionStatement(testSpecificMocks.path, testSpecificMocks.state);

      expect(utils.addLogger).toHaveBeenCalledWith(
        testSpecificMocks.path,
        testSpecificMocks.state
      );
    });

    it('when path is not valid (result from `utils.isValidPathAndState`) => nothing will happen', () => {
      visitors.insertExpressionStatement(testSpecificMocks.path, testSpecificMocks.state);

      expect(utils.addLogger).not.toHaveBeenCalled();
    });

  });
});
