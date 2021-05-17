import client from '../../../utils/plaid'
import { query } from '../../../utils/db'

export default async function handler(req, res) {
  const { publicToken, user_id } = req.body;
  var response = await client
    .exchangePublicToken(publicToken)
    .catch((err) => {
      if (!publicToken) {
        return "no public token";
      }
      console.log(err)
    });
  const { access_token, item_id: plaid_item_id } = response

  response = await client
    .getItem(access_token)
    .catch((err) => {
      if (!access_token) {
        return "no access token";
      }
      console.log(err)
    });
  const { item } = response

  response = await client
    .getInstitutionById(item.institution_id, ["US"])
    .catch((err) => {
      if (!item) {
        return "no item found";
      }
      console.log(err)
    });
  const { institution } = response

  response = await query(
    `
    INSERT INTO items_table (plaid_item_id, access_token, user_id, institution_name)
    VALUES (?, ?, ?, ?);
    `,
    [plaid_item_id, access_token, user_id, institution.name]
  )

  const { insertId: item_id } = response

  response = await client
    .getAccounts(access_token)
    .catch((err) => {
      console.log(err)
    });

  const { accounts } = response
  if (accounts && accounts.length && accounts.length > 0) {
    const pendingQueries = accounts.map(async a => {
      const {
        account_id: plaid_account_id,
        name,
        official_name,
        subtype,
        type
      } = a;
      try {
        const results = await query(
          `
          INSERT INTO accounts_table
            (
              plaid_account_id,
              user_id,
              item_id,
              name,
              official_name,
              type,
              subtype
            )
          VALUES
            (?, ?, ?, ?, ?, ?, ?);
          `,
          [
            plaid_account_id,
            user_id,
            item_id,
            name,
            official_name,
            type,
            subtype
          ]
        );
      } catch (err) {
        console.log(`Error insert following account: ${plaid_account_id}`);
        console.log(`error obj ${err}`);
      }
    });
    await Promise.all(pendingQueries);
  }

  return res.send({ access_token: access_token });
}