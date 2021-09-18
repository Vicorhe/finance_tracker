import { useState } from 'react'
import { mutate } from 'swr'
import { formatMySQLDate } from '../../../utils/date-formatter'
import RenderSplitTransactions from './RenderSplitTransactions'
import { validForm } from '../../../utils/split-utils'
import axios from 'axios'
const NEXT_PUBLIC_USER_ID = process.env.NEXT_PUBLIC_USER_ID;

export default function EditSplitTransactions({
  parent,
  splits,
  setSplits,
  isOpen,
  onClose,
  refresh
}) {
  const [errorMessage, setErrorMessage] = useState('')

  async function handleDelete(e) {
    e.preventDefault()
    try {
      const res = await axios.post(`/api/split/delete?parent_id=${parent.id}`, {})
      onClose()
      mutate(`/api/transaction/get-all?user_id=${NEXT_PUBLIC_USER_ID}`)
      refresh()
    } catch (e) {
      throw Error(e.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationMessage = validForm(parent, splits)
    if (!!validationMessage) {
      setErrorMessage(validationMessage)
      return
    }
    try {
      let res = await axios.post(`/api/split/delete?parent_id=${parent.id}`, {})
      res = await axios.post('/api/split/create', {
        user_id: NEXT_PUBLIC_USER_ID,
        parent_id: parent.id,
        date: formatMySQLDate(parent.date),
        splits
      })
      onClose()
      mutate(`/api/transaction/get-all?user_id=${NEXT_PUBLIC_USER_ID}`)
      refresh()
    } catch (e) {
      throw Error(e.message)
    }
  }

  return (
    <RenderSplitTransactions
      submitButtonLabel="Save"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      parent={parent}
      splits={splits}
      setSplits={setSplits}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
    />
  )
}