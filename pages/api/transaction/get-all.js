import { query } from '../../../utils/db'

export default async function handler(req, res) {
  const { user_id } = req.query
  try {
    if (!user_id) {
      return res
        .status(400)
        .json({ message: '`user_id` is required' })
    }
    const results = await query(
      `
      SELECT * FROM transactions_table 
      WHERE user_id = ? AND pending = FALSE
      ORDER BY date DESC
      `,
      user_id)
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}