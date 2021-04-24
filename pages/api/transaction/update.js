import { query } from '../../../lib/db'

export default async function handler(req, res) {
  const { id, name, area_id, amount, date, description } = req.body
  try {
    if (!id || !name || !amount || !date ) {
      return res
        .status(400)
        .json({ message: '`name`, `amount`, and `date` are required' })
    }

    const results = await query(
      `
      UPDATE transactions_table
      SET name = ?, area_id = ?, amount = ?, date = ?, description = ?
      WHERE id = ?
      `,
      [name, area_id, amount, date, description, id]
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}