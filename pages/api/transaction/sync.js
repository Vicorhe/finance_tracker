import { query } from '../../../lib/db'
import client from '../../../lib/plaid'
const moment = require('moment');

// fetch from plaid
async function fetchTransactions(accessToken, startDate, endDate) {
  try {
    let offset = 0;
    let transactionsToFetch = true;
    let resultData = { transactions: [], accounts: [] };
    const batchSize = 100;
    while (transactionsToFetch) {
      const options = {
        count: batchSize,
        offset,
      };
      const { transactions, accounts } = await client.getTransactions(
        accessToken,
        startDate,
        endDate,
        options
      );

      resultData = {
        transactions: [...resultData.transactions, ...transactions],
        accounts,
      };

      if (transactions.length === batchSize) {
        offset += batchSize;
      } else {
        transactionsToFetch = false;
      }
    }
    return resultData;
  } catch (err) {
    console.error(`Error fetching transactions: ${err.message}`);
    return { transactions: [], accounts: [] };
  }
};

// db code
// TODO move these to separate query files
async function getItemsByUserId(user_id) {
  try {
    const results = await query(
      `
    SELECT id, user_id, access_token FROM items_table
    WHERE user_id = ?
    `,
      user_id)
    return results
  } catch (e) {
    console.log(e)
    return []
  }
}
async function getTransactionsInDateRange(item_id, startDate, endDate) {
  try {
    const results = await query(
      `
    SELECT * FROM transactions_table
    WHERE item_id = ? AND date >= '`+ startDate + `' AND date <= '` + endDate + `' 
    `,
      item_id, startDate, endDate)
    return results
  } catch (e) {
    console.log(e)
    return []
  }
}
async function createTransactions(transactionsToStore, accounts, user_id, item_id) {
  const pendingQueries = transactionsToStore.map(async transaction => {
    const {
      transaction_id: plaid_transaction_id,
      payment_channel,
      name,
      amount,
      date,
      pending,
      account_id
    } = transaction;

    // TODO may have to invert amount for certain transactions depending on the type of account

    try {
      const results = await query(
        `
        INSERT INTO transactions_table
          (
            plaid_transaction_id,
            user_id,
            item_id,
            name,
            amount,
            date,
            source,
            type,
            pending,
            hidden,
            cash,
            split
          )
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `,
        [
          plaid_transaction_id,
          user_id,
          item_id,
          name,
          amount,
          date,
          'plaid',
          payment_channel,
          pending,
          false,
          false,
          false,
        ]
      );
    } catch (err) {
      console.log(`Skipping duplicate transaction ${plaid_transaction_id}`);
    }
  });
  await Promise.all(pendingQueries);
}
async function deleteTransactions(transactionsToRemove) {
  const pendingQueries = transactionsToRemove.map(async transaction => {
    const { plaid_transaction_id } = transaction
    const results = await query(
      `
      DELETE FROM transactions_table WHERE plaid_transaction_id = ?
      `,
      plaid_transaction_id,
    );
  });
  await Promise.all(pendingQueries);
}

async function handleTransactionsUpdate(item) {
  const { id: item_id, user_id, access_token } = item
  const startDate = moment()
    .subtract(2, 'years')
    .format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');

  // Fetch new transactions from plaid api.
  const {
    transactions: plaidTransactions,
    accounts,
  } = await fetchTransactions(access_token, startDate, endDate);

  // Retrieve existing transactions from our db.
  const dbTransactions = await getTransactionsInDateRange(item_id, startDate, endDate);
  // Compare to find new transactions.
  const existingTransactionIds = dbTransactions.reduce(
    (idMap, { plaid_transaction_id: transactionId }) => ({
      ...idMap,
      [transactionId]: transactionId,
    }),
    {}
  );
  const transactionsToStore = plaidTransactions.filter(
    ({ transaction_id: transactionId }) => {
      const isExisting = existingTransactionIds[transactionId];
      return !isExisting;
    }
  );

  // Compare to find removed transactions (pending transactions that have posted or cancelled).
  const incomingTransactionIds = plaidTransactions.reduce(
    (idMap, { transaction_id: transactionId }) => ({
      ...idMap,
      [transactionId]: transactionId,
    }),
    {}
  );
  const transactionsToRemove = dbTransactions.filter(
    ({ plaid_transaction_id: transactionId }) => {
      const isIncoming = incomingTransactionIds[transactionId];
      return !isIncoming;
    }
  );

  // Update the DB.
  await createTransactions(transactionsToStore, accounts, user_id, item_id);
  await deleteTransactions(transactionsToRemove);
};

export default async function handler(req, res) {
  const { user_id } = req.body
  if (!user_id) {
    return res
      .status(400)
      .json({ message: '`user_id` is required' })
  }
  const items = await getItemsByUserId(user_id)
  const pendingUpdates = items.map(async item => {
    await handleTransactionsUpdate(item)
  })
  await Promise.all(pendingUpdates);
  res.status(200).json({ message: "good stuff" })
}


