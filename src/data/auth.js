import axios from 'axios';

const ACCESS_TOKEN_KEY = 'abeAccessToken';

// axios.interceptors.request.use((config) => {
//   if (accessToken) {
//     // eslint-disable-next-line no-param-reassign
//     config.headers.common.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// }, Promise.reject);

export function setAccessToken(accessToken) {
  localStorage[ACCESS_TOKEN_KEY] = accessToken;
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  axios.defaults.headers.common.Authorization = null;
}

export function removeOauthParams(url) {
  return url
    .replace(/([?&])(access_token|expires_in|state|token_type)=[^&]*/g, '$1')
    .replace(/([?&])&+/, '$1')
    .replace(/[?&]$/, '');
}

export function initializeAccessToken() {
  const token = localStorage[ACCESS_TOKEN_KEY];
  const match = document.location.search.match(/[&?]access_token=([^&]+)/);
  if (match) {
    setAccessToken(decodeURIComponent(match[1]));
    window.history.replaceState({}, document.title, removeOauthParams(window.location.href));
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
