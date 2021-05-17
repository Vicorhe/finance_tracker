import { query } from '../../../utils/db'

export default async function handler(req, res) {
  const { id } = req.query
  try {
    if (!id) {
      return res
        .status(400)
        .json({ message: '`id` is required' })
    }
    const results = await query(
      `
      SELECT * FROM transactions_table 
      WHERE id = ?
      `,
      id)
    return res.json(results[0])
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}