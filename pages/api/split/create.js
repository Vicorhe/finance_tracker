import { query } from '../../../lib/db'

async function createChildSplit(user_id, parent_id, date, split) {
  const { name, amount, area_id, memo } = split
  const area = area_id ? area_id : null
  const results = await query(
    `
    INSERT INTO transactions_table (user_id, area_id, parent_id, name, amount, date, source, type, memo, pending, hidden, cash, split)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [user_id, area, parent_id, name, amount, date, 'user splitted', 'split', memo, false, false, false, true]
  )
}

async function deleteSplits(parent_id) {
  await query(
    `
    DELETE FROM transactions_table
    WHERE parent_id = ?
    `,
    parent_id
  )
}

async function updateParentSplitStatus(id) {
  await query(
    `
    UPDATE transactions_table
    SET split = ?
    WHERE id = ?
    `,
    [true, id]
  )
}

async function resetParent(id) {
  await query(
    `
    UPDATE transactions_table
    SET split = ?
    WHERE id = ?
    `,
    [false, id]
  )
}

export default async function handler(req, res) {
  const { user_id, parent_id, date, splits } = req.body
  try {
    if (!user_id || !parent_id || !date || !splits) {
      return res
        .status(400)
        .json({ message: '`user_id`, `parent_id`, `date`, and `splits` are all required' })
    }
    const pendingQueries = splits.map(async split => {
      await createChildSplit(user_id, parent_id, date, split)
    })

    await Promise.all(pendingQueries)
    updateParentSplitStatus(parent_id)

    res.status(200).json("good split")
  } catch (e) {
    deleteSplits(parent_id)
    resetParent(parent_id)
    
    res.status(500).json({ message: `error in creating split: ${e.message}` })
  }
}