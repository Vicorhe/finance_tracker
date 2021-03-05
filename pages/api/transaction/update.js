import { query } from '../../../lib/db'

export default async function handler(req, res) {
  const { id, area_id, description } = req.body
  try {
    if (!id) {
      return res
        .status(400)
        .json({ message: '`id` is required' })
    }

    const results = await query(
      `
      UPDATE transactions_table
      SET area_id = ?, description = ?
      WHERE id = ?
      `,
      [area_id, description, id]
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}