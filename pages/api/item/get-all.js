import { query } from '../../../lib/db'

export default async function handler(req, res) {
  const { user_id } = req.query
  try {
    if (!user_id) {
      return res.status(400).json({ message: '`user_id` required' })
    }
    const results = await query(
      `
      SELECT * FROM items_table
      WHERE user_id = ?
      `,
      user_id
      )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}