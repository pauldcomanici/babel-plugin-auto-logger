// testing file
import setup from '../src/setup';

// dependencies
// services
import options from '../src/options';

describe('setup.js', () => {

  describe('pre', () => {
    beforeAll(() => {
      jest.spyOn(options, 'prepare').mockReturnValue({
        setting: 'setting',
      });
    });
    beforeEach(() => {
      // options are available on the instance (this.opts)
      setup.opts = {
        opts: {
          sourceMatcher: 'sourceMatcher',
        },
      };
    });
    afterEach(() => {
      options.prepare.mockClear();

      setup.opts = undefined;
    });
    afterAll(() => {
      options.prepare.mockRestore();
    });

    it('merges provided settings with default options by calling `options.prepare`', () => {
      setup.pre();

      expect(options.prepare).toHaveBeenCalledWith(
        setup.opts
      );
    });

    it('will set `babelPluginLoggerSettings` on the instance with value from prepared options', () => {
      setup.pre();

      expect(setup.babelPluginLoggerSettings).toEqual(
        {
          setting: 'setting',
        }
      );
    });

  });

  describe('post', () => {
    beforeEach(() => {
      setup.babelPluginLoggerSettings = {
        setting: 'setting',
      };
    });
    afterEach(() => {
      setup.babelPluginLoggerSettings = undefined;
    });

    it('will clear `babelPluginLoggerSettings` on the instance (set to undefined)', () => {
      setup.post();

      expect(setup.babelPluginLoggerSettings).toBeUndefined();
    });

  });

});
