import { query } from '../../../utils/db'

export default async function handler(req, res) {
  const {
    user_id,
    period_one_start_date,
    period_one_end_date,
    period_two_start_date,
    period_two_end_date
  } = req.body
  try {
    if (!user_id || !period_one_start_date || !period_one_end_date || !period_two_start_date || !period_two_end_date) {
      return res
        .status(400)
        .json({
          message: '`user_id`, `period_one_start_date`, `period_one_end_date`, `period_two_start_date`, and `period_two_end_date` are required'
        })
    }
    const comparison = await query(
      `
      SELECT P1.id, P1.name area, IFNULL(ABS(P1.amount), 0) period_one, IFNULL(ABS(P2.amount), 0) period_two, P1.input 
        FROM
        (
          SELECT A1.id, A1.name, T1.amount, A1.input 
            FROM areas_table A1 LEFT JOIN
              (
                SELECT A.id, SUM(T.amount) amount
                  FROM transactions_table T
                    INNER JOIN areas_table A ON T.area_id = A.id 
                  WHERE 
                    user_id = ? 
                    AND date >= ? 
                    AND date <= ?
                    AND hidden = FALSE AND pending = FALSE
                    AND (split = FALSE OR (split = TRUE AND parent_id IS NOT NULL))
                  GROUP BY A.id
              ) T1 ON T1.id = A1.id
        ) P1 INNER JOIN 
        (
          SELECT A1.id, T1.amount
            FROM areas_table A1 LEFT JOIN 
              (
                SELECT A.id, SUM(T.amount) amount
                  FROM transactions_table T
                    INNER JOIN areas_table A ON T.area_id = A.id 
                  WHERE 
                    user_id = ? 
                    AND date >= ? 
                    AND date <= ? 
                    AND hidden = FALSE AND pending = FALSE
                    AND (split = FALSE OR (split = TRUE AND parent_id IS NOT NULL))
                  GROUP BY A.id
              ) T1 ON T1.id = A1.id
        ) P2 ON P1.id = P2.id 
        WHERE P1.amount IS NOT NULL OR P2.amount IS NOT NULL     
      `,
      [user_id, period_one_start_date, period_one_end_date, user_id, period_two_start_date, period_two_end_date])
    return res.json(comparison)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}