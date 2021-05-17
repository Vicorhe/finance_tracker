import { query } from '../../../utils/db'

export default async function handler(req, res) {
  const { id, name, description, color, input } = req.body
  try {
    if (!id || !name || !description || !color || input === undefined) {
      return res
        .status(400)
        .json({ message: '`id`, `name`, `description`, `color`, and `input` are required' })
    }

    const results = await query(
      `
      UPDATE areas_table
      SET name = ?, description = ?, color = ?, input = ?
      WHERE id = ?
      `,
      [name, description, color, input, id]
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}