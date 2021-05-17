import { query } from '../../../utils/db'

export default async function handler(req, res) {
  const {
    user_name,
    start_date,
    end_date
  } = req.body
  try {
    if (!user_name || !start_date || !end_date) {
      return res
        .status(400)
        .json({ message: '`user_name`, `start_date`, and `end_date` are required' })
    }
    const transactions = await query(
      `
      SELECT t.* FROM transactions_table t INNER JOIN users_table u ON t.user_id = u.id
      WHERE u.name = ? AND t.date >= '`+ start_date + `' AND t.date <= '` + end_date + `' 
        AND t.hidden = FALSE AND t.area_id IS NOT NULL AND t.pending = FALSE
        AND (t.split = FALSE OR (t.split = TRUE AND t.parent_id IS NOT NULL))
      ORDER BY t.date DESC
      `,
      user_name)
    return res.json(transactions)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}