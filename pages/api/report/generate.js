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
    const results = await query(
      `
      SELECT * FROM transactions_table
      WHERE user_id = ? AND date >= '`+ start_date + `' AND date <= '` + end_date + `' 
      `,
      user_id)
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}