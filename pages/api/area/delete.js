import { query } from '../../../utils/db'

export default async function handler(req, res) {
  const { id } = req.query
  try {
    if (!id) {
      return res.status(400).json({ message: '`id` required' })
    }

    const results = await query(
      `
      DELETE FROM areas_table
      WHERE id = ?
      `,
      id
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}