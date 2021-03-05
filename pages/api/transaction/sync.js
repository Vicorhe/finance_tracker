import { query } from '../../../lib/db'
import client, { resetLogin } from '../../../lib/plaid'
const moment = require('moment');

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

async function getTransactionsByItemId(item_id) {
  try {
    const results = await query(
      `
    SELECT * FROM transactions_table
    WHERE item_id = ?
    `,
      item_id)
    return results
  } catch (e) {
    console.log(e)
    return []
  }
}

async function getItemsByUserId(user_id) {
  try {
    const results = await query(
      `
    SELECT id, access_token FROM items_table
    WHERE user_id = ?
    `,
      user_id)
    return results
  } catch (e) {
    console.log(e)
    return []
  }
}

async function createTransactions(transactionsToStore, user_id, item_id) {
  const pendingQueries = transactionsToStore.map(async transaction => {
    const {
      transaction_id: plaid_transaction_id,
      transaction_type,
      name,
      amount,
      date,
      pending,
    } = transaction;

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
          transaction_type,
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
  const pendingQueries = transactionsToRemove.map(async transactionId => {
    const results = await query(
      `
      DELETE FROM transactions_table WHERE plaid_transaction_id = ?
      `,
      transactionId,
    );
  });
  await Promise.all(pendingQueries); 
}

async function handleTransactionsUpdate(item, user_id) {
  const { id: item_id, access_token } = item
  const startDate = moment()
    .subtract(2, 'years')
    .format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  // Fetch new transactions from plaid api.
  const {
    transactions: incomingTransactions,
    accounts,
  } = await fetchTransactions(access_token, startDate, endDate);

  // Retrieve existing transactions from our db.
  const existingTransactions = await getTransactionsByItemId(item_id);

  // Compare to find new transactions.
  const existingTransactionIds = existingTransactions.reduce(
    (idMap, { plaid_transaction_id: transactionId }) => ({
      ...idMap,
      [transactionId]: transactionId,
    }),
    {}
  );
  const transactionsToStore = incomingTransactions.filter(
    ({ transaction_id: transactionId }) => {
      const isExisting = existingTransactionIds[transactionId];
      return !isExisting;
    }
  );

  // Compare to find removed transactions (pending transactions that have posted or cancelled).
  const incomingTransactionIds = incomingTransactions.reduce(
    (idMap, { transaction_id: transactionId }) => ({
      ...idMap,
      [transactionId]: transactionId,
    }),
    {}
  );
  const transactionsToRemove = existingTransactions.filter(
    ({ plaid_transaction_id: transactionId }) => {
      const isIncoming = incomingTransactionIds[transactionId];
      return !isIncoming;
    }
  );

  // Update the DB.
  await createTransactions(transactionsToStore, user_id, item_id);
  await deleteTransactions(transactionsToRemove);
};

export default async function handler(req, res) {
  const { user_id } = req.body
  if (!user_id ) {
    return res
      .status(400)
      .json({ message: '`user_id`is required' })
  }
  const items = await getItemsByUserId(user_id)
  const pendingUpdates = items.map(async item => {
    await handleTransactionsUpdate(item, user_id)
  })
  await Promise.all(pendingUpdates);
  res.status(500).json("re")
}


