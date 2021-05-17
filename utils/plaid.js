const plaid = require('plaid');

const {
  PLAID_CLIENT_ID,
  PLAID_ENV,
  PLAID_SECRET_DEVELOPMENT,
  PLAID_SECRET_SANDBOX,
} = process.env;

const PLAID_SECRET = PLAID_ENV === 'development' ? PLAID_SECRET_DEVELOPMENT : PLAID_SECRET_SANDBOX;

const OPTIONS = { clientApp: 'finance_tracker' };

const client = new plaid.Client({
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET,
  env: plaid.environments[PLAID_ENV],
  options: OPTIONS,
});

module.exports = client;