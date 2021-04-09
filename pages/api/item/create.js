import client from '../../../lib/plaid'
import { query } from '../../../lib/db'

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
  const { access_token, item_id } = response

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

  const results = await query(
    `
    INSERT INTO items_table (plaid_item_id, access_token, user_id, institution_name)
    VALUES (?, ?, ?, ?)
    `,
    [item_id, access_token, user_id, institution.name]
  )
  return res.send({ access_token: response.access_token });
}