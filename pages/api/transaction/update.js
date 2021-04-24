import { query } from '../../../lib/db'

export default async function handler(req, res) {
  const { id, name, area_id, amount, date, memo } = req.body
  try {
    if (!id || !name || !amount || !date) {
      return res
        .status(400)
        .json({ message: '`name`, `amount`, and `date` are required' })
    }
    let results;
    if (area_id) {
      results = await query(
        `
        UPDATE transactions_table
        SET name = ?, area_id = ?, amount = ?, date = ?, memo = ?
        WHERE id = ?
        `,
        [name, area_id, amount, date, memo, id]
      )
    }
    else {
      results = await query(
        `
          UPDATE transactions_table
          SET name = ?, area_id = ?, amount = ?, date = ?, memo = ?
          WHERE id = ?
          `,
        [name, null, amount, date, memo, id]
      )
    }
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}