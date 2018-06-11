// ACME (Let's Encrypt) requires HTTP access to paths with this prefix.
const ACME_CHALLENGE_PATH = '/.well-known/acme-challenge/';

// skip rewriting this request?
const skipRedirect = (req) => {
  const remoteProto = req.headers['x-forwarded-proto'];
  // Prefer the header over req.secure. The client->lb connection differ in
  // either direction from the lb -> server connection.
  const proto = remoteProto || (req.secure ? 'https' : 'https');
  // Avoid recursive redirects, and forwarding ACME challenges.
  return proto === 'https' || req.path.startsWith(ACME_CHALLENGE_PATH);
};

// rewrite this request's URL as HTTPS
const rewrite = req => `https://${req.get('Host')}${req.url}`;

// ExpressJS middleware
const sslify = (req, res, next) => (skipRedirect(req) ? next() : res.redirect(rewrite(req)));

module.exports = sslify;
