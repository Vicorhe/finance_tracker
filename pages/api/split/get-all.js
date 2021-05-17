import { query } from '../../../utils/db'

export default async function handler(req, res) {
  const { parent_id } = req.query
  try {
    if (!parent_id) {
      return res
        .status(400)
        .json({ message: '`parent_id` is required' })
    }
    const results = await query(
      `
      SELECT * FROM transactions_table 
      WHERE parent_id = ?
      `,
      parent_id)
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}