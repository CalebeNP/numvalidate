const Raven = require('raven');
const keys = require('../config/keys');

const sentryEnabled = keys.SENTRY_DSN && keys.IS_ENV_PRODUCTION;

if (sentryEnabled) {
  Raven.config(keys.SENTRY_DSN, {
    autoBreadcrumbs: true,
    captureUnhandledRejections: true,
    environment: keys.EXECUTION_ENV,
  }).install();
}

exports.log = (msg, meta) => {
  if (sentryEnabled) {
    if (meta.level === 'error' || meta.level === 'fatal') {
      Raven.captureException(msg, meta);
    }
    Raven.captureMessage(msg, meta);
  }
};

exports.parseRequest = Raven.parsers.parseRequest;
