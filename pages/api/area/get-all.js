import { query } from '../../../utils/db'

export default async function handler(req, res) {
  try {
    const results = await query(
      `
      SELECT * FROM areas_table
      `
      )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}