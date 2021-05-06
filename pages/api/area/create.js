import { query } from '../../../lib/db'

export default async function handler(req, res) {
  const { name, description, color, input } = req.body
  try {
    if (!name || !description || !color || !input) {
      return res
        .status(400)
        .json({ message: '`name`, `description`, `color`, and `input` are all required' })
    }

    const results = await query(
      `
      INSERT INTO areas_table (name, description, color, input)
      VALUES (?, ?, ?, ?)
      `,
      [name, description, color, input]
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}