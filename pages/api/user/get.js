import { query } from '../../../lib/db'

export default async function handler(req, res) {
  const { name } = req.query
  try {
    if (!name) {
      return res
        .status(400)
        .json({ message: '`name` is required' })
    }
    const results = await query(
      `
      SELECT * FROM users_table
      WHERE name = ?
      `,
      name)
    return res.json(results[0])
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}