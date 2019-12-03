// testing file
import pluginConstants from '../src/constants';

describe('constants.js', () => {
  it('is an object with plugin constants', () => {
    expect(pluginConstants).toMatchSnapshot();
  });
});
