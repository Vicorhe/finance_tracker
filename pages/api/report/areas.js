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
    const areas_aggregate = await query(
      `
      SELECT A.id label, A.name id, A.color color, SUM(T.amount) value, COUNT(T.id) count, A.description, A.input 
      FROM transactions_table T
        INNER JOIN areas_table A ON T.area_id = A.id 
      WHERE user_id = ? AND date >= '`+ start_date + `' AND date <= '` + end_date + `' 
        AND hidden = false AND (split = false OR (split = true AND parent_id IS NOT NULL))
      GROUP BY A.id
      ORDER BY ABS(SUM(T.amount)) desc
      `,
      user_id)
    return res.json(areas_aggregate)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}