import { query } from '../../../lib/db'

export default async function handler(req, res) {
  const { plaid_item_id, access_token, institution_name, user_id } = req.body
  try {
    if (!plaid_item_id || !access_token || !institution_name || !user_id) {
      return res
        .status(400)
        .json({ message: '`plaid_item_id`, `access_token`, `institution_name`, and `user_id` are all required' })
    }

    const results = await query(
      `
      INSERT INTO items_table (plaid_item_id, access_token, institution_name, user_id)
      VALUES (?, ?, ?, ?)
      `,
      [plaid_item_id, access_token, institution_name, user_id]
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}