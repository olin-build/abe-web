export const API_SERVER_URL = process.env.ABE_URL.replace(/\/$/, '');
export const OAUTH_AUTH_ENDPOINT =
  process.env.OAUTH_AUTH_ENDPOINT || `${API_SERVER_URL}/oauth/authorize`;
// export const TOKEN_INFO_ENDPOINT = process.env.TOKEN_INFO_ENDPOINT || `${API_SERVER_URL}/user/`;
export const TOKEN_INFO_ENDPOINT = `${API_SERVER_URL}/oauth/introspect`;
export const CLIENT_ID = process.env.CLIENT_ID || '0';

export const debug = process.env.DEBUG || false;
export const googleAnalyticsId = process.env.GA_ID;

// TODO: Replace these with some user-configurable option
export const dayEndHour = process.env.DAY_END_HOUR || 24;
export const dayStartHour = process.env.DAY_START_HOUR || 8;
