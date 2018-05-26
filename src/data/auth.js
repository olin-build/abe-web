import axios from 'axios';
import { CLIENT_ID, OAUTH_AUTH_ENDPOINT } from './settings';

// localStorage key
const ACCESS_TOKEN_KEY = 'abeAccessToken';

export const Scopes = new Set([
  'create:events',
  'create:ics',
  'create:protected_events',
  'delete:events',
  'delete:protected_events',
  'edit:events',
  'edit:protected_events',
  'read:all_events',
  'read:labels',
]);

export function authorizationUrl(redirectUri) {
  const url = [
    OAUTH_AUTH_ENDPOINT,
    `?client_id=${CLIENT_ID}`,
    `&redirect_uri=${encodeURIComponent(redirectUri)}`,
    '&response_type=token',
    `&scope=${encodeURIComponent([...Scopes].join(' '))}`,
  ].join('');
  return url;
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  axios.defaults.headers.common.Authorization = null;
}

export function getAccessToken() {
  return localStorage[ACCESS_TOKEN_KEY];
}

// Remember the access token into localStorage (where it's available the next
// time the page is visited), and also present it in subsequent API requests.
export function setAccessToken(accessToken) {
  localStorage[ACCESS_TOKEN_KEY] = accessToken;
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

// Returns true if the user can sign out.
export function canSignOut() {
  return Boolean(getAccessToken());
}

// Remove the OAuth flow parameters from the URL fragment
export function removeOauthFragments(url) {
  return url
    .replace(/([#&])(access_token|expires_in|nonce|state|token_type)=[^&]*/g, '$1')
    .replace(/([#&])&+/, '$1')
    .replace(/[#&]$/, '');
}

// Called on startup. Reads the access token from localStorage or from the URL
// fragment (for an OAuth implicit grant callback), and sanitizes the URL in
// the latter case.
export function initializeAccessToken() {
  let token = localStorage[ACCESS_TOKEN_KEY];
  const match = document.location.hash.match(/[#&]access_token=([^&]*)/);
  // If there's a token in the URL, this replaces any locally-stored token.
  if (match) {
    token = decodeURIComponent(match[1]);
    window.history.replaceState({}, document.title, removeOauthFragments(window.location.href));
  }
  if (token) {
    setAccessToken(token);
  }
}

// Set the token from the 'Access-Token' HTTP response header.
//
// TODO: I think this is obsolete — ows 2018-05-26
export function setAccessTokenFromResponse(response) {
  const token = response.headers['access-token'];
  if (token) {
    setAccessToken(token);
  }
  return response;
}
