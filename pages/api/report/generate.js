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
    const areas_aggregate = await query(
      `
      SELECT A.id id, A.name label, SUM(T.amount) value, COUNT(T.id) count, A.description, A.income 
      FROM transactions_table T
        INNER JOIN areas_table A ON T.area_id = A.id 
      WHERE user_id = ? AND date >= '`+ start_date + `' AND date <= '` + end_date + `' 
        AND hidden = false AND (split = false OR (split = true AND parent_id IS NOT NULL))
      GROUP BY A.id
      `,
      user_id)
    return res.json({ transactions, areas_aggregate })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}