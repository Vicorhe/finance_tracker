import { useState } from 'react'
import { mutate } from 'swr'
import { formatMySQLDate } from '../../../utils/date-formatter'
import RenderSplitTransactions from './RenderSplitTransactions'
import { validForm } from '../../../utils/split-utils'
import axios from 'axios'
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
      const res = await axios.post('/api/split/create', {
        user_id: NEXT_PUBLIC_USER_ID,
        parent_id: parent.id,
        date: formatMySQLDate(parent.date),
        splits
      })
      onClose()
      mutate(`/api/transaction/get-all?user_id=${NEXT_PUBLIC_USER_ID}`)
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