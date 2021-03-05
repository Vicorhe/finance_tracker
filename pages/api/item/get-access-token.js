import client from '../../../lib/plaid'
import { query } from '../../../lib/db'

export default async function handler(req, res) {
  const { publicToken, user_id } = req.body;
  const response = await client
    .exchangePublicToken(publicToken)
    .catch((err) => {
      if (!publicToken) {
        return "no public token";
      }
      console.log(err)
    });
  console.log(response)
  const { access_token, item_id } = response
  const results = await query(
    `
    INSERT INTO items_table (plaid_item_id, access_token, user_id)
    VALUES (?, ?, ?)
    `,
    [item_id, access_token, user_id]
  )
  return res.send({access_token: response.access_token});
}