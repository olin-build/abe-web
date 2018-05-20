import axios from 'axios';

const ACCESS_TOKEN_KEY = 'abeAccessToken';

export function authorizationUrl(redirectUri) {
  const oauthBaseUrl = `${window.abe_url}/oauth/authorize`;
  const clientId = process.env.ABE_CLIENT_ID;
  let url = `${oauthBaseUrl}?redirect_uri=${encodeURIComponent(redirectUri)}`;
  url += '&response_type=token';
  if (clientId) {
    url += `&client_id=${clientId}`;
  }
  return url;
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  axios.defaults.headers.common.Authorization = null;
}

export function setAccessToken(accessToken) {
  localStorage[ACCESS_TOKEN_KEY] = accessToken;
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

export function canSignOut() {
  return Boolean(localStorage[ACCESS_TOKEN_KEY]);
}

export function removeOauthFragments(url) {
  return url
    .replace(/([#&])(access_token|expires_in|state|token_type)=[^&]*/g, '$1')
    .replace(/([#&])&+/, '$1')
    .replace(/[#&]$/, '');
}

export function initializeAccessToken() {
  const token = localStorage[ACCESS_TOKEN_KEY];
  const match = document.location.hash.match(/[#&]access_token=([^&]*)/);
  if (match) {
    setAccessToken(decodeURIComponent(match[1]));
    window.history.replaceState({}, document.title, removeOauthFragments(window.location.href));
  } else if (token) {
    setAccessToken(token);
  }
}

export function setAccessTokenFromResponse(response) {
  const token = response.headers['access-token'];
  if (token) {
    setAccessToken(token);
  }
  return response;
}
