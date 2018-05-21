// ACME (Let's Encrypt) requires HTTP access to paths with this prefix.
const ACME_CHALLENGE_PATH = '/.well-known/acme-challenge/';

// skip rewriting this request?
const skip = req => req.secure || req.path.startsWith(ACME_CHALLENGE_PATH);

// rewrite this request's URL as HTTPS
const rewrite = req => `https://${req.get('Host')}${req.url}`;

// ExpressJS middleware
const sslify = (req, res, next) => (skip(req) ? next() : res.redirect(rewrite(req)));

module.exports = sslify;
