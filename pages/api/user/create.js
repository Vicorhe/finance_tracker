import { query } from '../../../utils/db'
import {onlyLowerCaseAlphaNumeric } from '../../../utils/regular-expressions'

export default async function handler(req, res) {
  const { name } = req.body
  try {
    if (!name) {
      return res
        .status(400)
        .json({ message: '`name` is required' })
    }
    
    if (!onlyLowerCaseAlphaNumeric(name)){
      return res
        .status(400)
        .json({message: '`name` must be 2 - 17 characters, lowercase alphanumeric'})
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