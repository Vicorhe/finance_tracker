import { query } from '../../../lib/db'

export default async function handler(req, res) {
  const {
    user_id,
    start_date,
    end_date
  } = req.body
  try {
    if (!user_id || !start_date || !end_date) {
      return res
        .status(400)
        .json({ message: '`user_id`, `start_date`, and `end_date` are required' })
    }
    const transactions = await query(
      `
      SELECT * FROM transactions_table
      WHERE user_id = ? AND date >= '`+ start_date + `' AND date <= '` + end_date + `' 
        AND hidden = false AND area_id IS NOT NULL 
        AND (split = false OR (split = true AND parent_id IS NOT NULL))
      `,
      user_id)
    return res.json(transactions)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}