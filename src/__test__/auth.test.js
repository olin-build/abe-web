import {
  canSignOut,
  initializeAccessToken,
  clearAccessToken,
  removeOauthFragments,
} from '../data/auth';

describe('access tokens', () => {
  test('sequence', () => {
    localStorage.abeAccessToken = 'token';
    initializeAccessToken();
    expect(canSignOut()).toEqual(true);
    clearAccessToken();
    expect(canSignOut()).toEqual(true);
  });
});

/* eslint-disable max-len */
describe('removeOauthFragments', () => {
  test('removes parameters', () => {
    expect(removeOauthFragments('http://localhost/path')).toEqual('http://localhost/path');
    expect(removeOauthFragments('http://localhost/path#access_token=value')).toEqual('http://localhost/path');
    expect(removeOauthFragments('http://localhost/path#expires_in=value')).toEqual('http://localhost/path');
    expect(removeOauthFragments('http://localhost/path#state=value')).toEqual('http://localhost/path');
    expect(removeOauthFragments('http://localhost/path#token_type=value')).toEqual('http://localhost/path');
    expect(removeOauthFragments('http://localhost/path#other_param=value')).toEqual('http://localhost/path#other_param=value');
    expect(removeOauthFragments('http://localhost/path#access_token=value&state=1')).toEqual('http://localhost/path');
    expect(removeOauthFragments('http://localhost/path#access_token=value&token_type=value')).toEqual('http://localhost/path');
    expect(removeOauthFragments('http://localhost/path#access_token=value&other_param=1&token_type=value')).toEqual('http://localhost/path#other_param=1');
    expect(removeOauthFragments('http://localhost/path#access_token=value&other_param=1')).toEqual('http://localhost/path#other_param=1');
    expect(removeOauthFragments('http://localhost/path#other_param=1&access_token=value')).toEqual('http://localhost/path#other_param=1');
    expect(removeOauthFragments('http://localhost/path#access_token=value&other_param=1&state=2')).toEqual('http://localhost/path#other_param=1');
    expect(removeOauthFragments('http://localhost/path#access_token=value&state=2&other_param=1')).toEqual('http://localhost/path#other_param=1');
  });
});
