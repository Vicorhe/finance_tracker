import { query } from '../../../utils/db'

export default async function handler(req, res) {
  const { name } = req.body
  try {
    if (!name) {
      return res
        .status(400)
        .json({ message: '`name` is required' })
    }

    const results = await query(
      `
      INSERT INTO users_table (name)
      VALUES (?)
      `,
      name
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}