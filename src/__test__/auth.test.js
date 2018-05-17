import { removeOauthParams } from '../data/auth';

/* eslint-disable max-len */
describe('removeOauthParams', () => {
  test('removes parameters', () => {
    expect(removeOauthParams('http://localhost/path')).toEqual('http://localhost/path');
    expect(removeOauthParams('http://localhost/path?access_token=value')).toEqual('http://localhost/path');
    expect(removeOauthParams('http://localhost/path?expires_in=value')).toEqual('http://localhost/path');
    expect(removeOauthParams('http://localhost/path?state=value')).toEqual('http://localhost/path');
    expect(removeOauthParams('http://localhost/path?token_type=value')).toEqual('http://localhost/path');
    expect(removeOauthParams('http://localhost/path?other_param=value')).toEqual('http://localhost/path?other_param=value');
    expect(removeOauthParams('http://localhost/path?access_token=value&state=1')).toEqual('http://localhost/path');
    expect(removeOauthParams('http://localhost/path?access_token=value&token_type=value')).toEqual('http://localhost/path');
    expect(removeOauthParams('http://localhost/path?access_token=value&other_param=1&token_type=value')).toEqual('http://localhost/path?other_param=1');
    expect(removeOauthParams('http://localhost/path?access_token=value&other_param=1')).toEqual('http://localhost/path?other_param=1');
    expect(removeOauthParams('http://localhost/path?other_param=1&access_token=value')).toEqual('http://localhost/path?other_param=1');
    expect(removeOauthParams('http://localhost/path?access_token=value&other_param=1&state=2')).toEqual('http://localhost/path?other_param=1');
    expect(removeOauthParams('http://localhost/path?access_token=value&state=2&other_param=1')).toEqual('http://localhost/path?other_param=1');
  });
});
