import { query } from '../../../utils/db'

export default async function handler(req, res) {
  const { id, name } = req.body
  try {
    if (!id || !name) {
      return res
        .status(400)
        .json({ message: '`id` and `name` are required' })
    }

    const results = await query(
      `
      UPDATE users_table
      SET name = ?
      WHERE id = ?
      `,
      [name, id]
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}