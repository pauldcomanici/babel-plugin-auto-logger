// testing file
import {babelPluginAutoLogger} from '../src/index';

// dependencies
// services
import setup from '../src/setup';
jest.mock('../src/setup');
import visitors from '../src/visitors';
jest.mock('../src/visitors');


describe('index.js', () => {
  const mocks = {};

  beforeAll(() => {
    mocks.api = {
      assertVersion: jest.fn().mockReturnValue(true),
    };
  });
  afterEach(() => {
    setup.post.mockClear();
    setup.pre.mockClear();
    visitors.program.mockClear();
    visitors.insertExpressionStatement.mockClear();

    mocks.api.assertVersion.mockClear();
  });

  it('assert babel version by calling `api.assertVersion` with 7 as being expected babel version', () => {
    babelPluginAutoLogger(mocks.api);

    expect(mocks.api.assertVersion).toHaveBeenCalledWith(7);
  });

  it('returns an object with plugin data', () => {
    expect(babelPluginAutoLogger(mocks.api)).toEqual({
      name: 'babel-plugin-auto-logger',
      post: setup.post,
      pre: setup.pre,
      visitor: {
        'Function|CatchClause': visitors.insertExpressionStatement,
        Program: visitors.program,
      },
    });
  });

});
