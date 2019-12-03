// testing file
import sourceFile from '../src/source-file';


describe('source-file.js', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('get', () => {
    beforeEach(() => {
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
    });

    it('returns `state.sourceMapTarget` when it has truthy value', () => {
      expect(sourceFile.get(testSpecificMocks.state)).toBe(
        'file-name.js',
      );
    });

    it('returns `state.sourceFileName` when it has truthy value and `state.sourceMapTarget` has falsy value', () => {
      testSpecificMocks.state.file.opts.sourceMapTarget = undefined;

      expect(sourceFile.get(testSpecificMocks.state)).toBe(
        '/path/to/file/file-name.js',
      );
    });

    it('returns `state.parserOpts.sourceMapTarget` when it has truthy value, `state.sourceMapTarget` has falsy value and `state.sourceFileName` has falsy value', () => {
      testSpecificMocks.state.file.opts.sourceFileName = undefined;
      testSpecificMocks.state.file.opts.sourceMapTarget = undefined;

      expect(sourceFile.get(testSpecificMocks.state)).toBe(
        'parsed-file-name.js',
      );
    });

    it('returns `state.parserOpts.sourceFileName` when it has truthy value, `state.parserOpts.sourceMapTarget` has falsy value, `state.sourceMapTarget` has falsy value and `state.sourceFileName` has falsy value', () => {
      testSpecificMocks.state.file.opts.sourceFileName = undefined;
      testSpecificMocks.state.file.opts.sourceMapTarget = undefined;
      testSpecificMocks.state.file.opts.parserOpts.sourceMapTarget = undefined;

      expect(sourceFile.get(testSpecificMocks.state)).toBe(
        '/parsed/path/to/file/file-name.js',
      );
    });

    it('returns empty string when all possible properties that may contain file name have falsy value', () => {
      testSpecificMocks.state.file.opts.sourceFileName = undefined;
      testSpecificMocks.state.file.opts.sourceMapTarget = undefined;
      testSpecificMocks.state.file.opts.parserOpts = undefined;

      expect(sourceFile.get(testSpecificMocks.state)).toBe(
        '',
      );
    });

    it('returns string that contain the path to file without root path when `state.root` has truthy value and his value is included in source file', () => {
      testSpecificMocks.state.file.opts.sourceMapTarget = undefined;
      testSpecificMocks.state.file.opts.root = '/path/to/file';

      expect(sourceFile.get(testSpecificMocks.state)).toBe(
        '/file-name.js',
      );
    });

  });
});
