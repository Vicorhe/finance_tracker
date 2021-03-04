import { query } from '../../../lib/db'

export default async function handler(req, res) {
  const { id, name, description, color } = req.body
  try {
    if (!id || !name || !description || !color) {
      return res
        .status(400)
        .json({ message: '`id`, `name`, `description`, and `color` are required' })
    }

    const results = await query(
      `
      UPDATE areas_table
      SET name = ?, description = ?, color = ?
      WHERE id = ?
      `,
      [name, description, color, id]
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}