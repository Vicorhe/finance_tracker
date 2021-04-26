import { query } from '../../../lib/db'

export default async function handler(req, res) {
  const { parent_id } = req.query
  try {
    if (!parent_id) {
      return res.status(400).json({ message: '`parent_id` required' })
    }

    let results = await query(
      `
      DELETE FROM transactions_table
      WHERE parent_id = ?
      `,
      parent_id
    )
    results = await query(
      `
      UPDATE transactions_table
      SET split = ?
      WHERE id = ?
      `,
      [false, parent_id]
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}