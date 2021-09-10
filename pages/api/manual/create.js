import { query } from '../../../utils/db'

export default async function handler(req, res) {
  const { user_id, name, area_id, amount, date, memo } = req.body
  const area = area_id ? area_id : null
  try {
    if (!user_id || !name || !amount || !date) {
      return res
        .status(400)
        .json({ message: '`user_id`, `name`, `amount`, and `date` are all required' })
    }

    const results = await query(
      `
      INSERT INTO transactions_table 
      (user_id, area_id, name, amount, date, source, type, memo, pending, hidden, manual, split)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [user_id, area, name, amount, date, 'user inputted', 'manual', memo, false, false, true, false]
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}