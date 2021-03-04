import { query } from '../../../lib/db'

export default async function handler(req, res) {
  const { name, description, color } = req.body
  try {
    if (!name || !description || !color) {
      return res
        .status(400)
        .json({ message: '`name`, `description`, and `color` are all required' })
    }

    const results = await query(
      `
      INSERT INTO areas_table (name, description, color)
      VALUES (?, ?, ?)
      `,
      [name, description, color]
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}