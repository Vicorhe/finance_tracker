import { useState } from 'react'
import { mutate } from 'swr'
import { formatMySQLDate } from '../../../utils/date-formatter'
import RenderSplitTransactions from './RenderSplitTransactions'
import { validForm } from '../../../utils/split-utils'
const NEXT_PUBLIC_USER_ID = process.env.NEXT_PUBLIC_USER_ID;

export default function AddSplitTransactions({
  parent,
  splits,
  setSplits,
  isOpen,
  onClose
}) {
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const validationMessage = validForm(parent, splits)
    if (!!validationMessage) {
      setErrorMessage(validationMessage)
      return
    }
    try {
      const res = await fetch('/api/split/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: NEXT_PUBLIC_USER_ID,
          parent_id: parent.id,
          date: formatMySQLDate(parent.date),
          splits
        }),
      })
      onClose()
      mutate(`/api/transaction/get-all?user_id=${NEXT_PUBLIC_USER_ID}`)
      const json = await res.json()
      if (!res.ok) throw Error(json.message)
    } catch (e) {
      throw Error(e.message)
    }
  }

  return (
    <RenderSplitTransactions
      submitButtonLabel='Create Splits'
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      parent={parent}
      splits={splits}
      setSplits={setSplits}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
    />
  )
}