import { useContext, useState } from 'react'
import { UserContext } from '../../../context'
import { mutate } from 'swr'
import { formatMySQLDate } from '../../../utils/date-formatter'
import RenderSplitTransactions from './RenderSplitTransactions'
import { validForm } from '../../../utils/split-utils'

export default function EditSplitTransactions({
  parent,
  splits,
  setSplits,
  isOpen,
  onClose
}) {
  const { user } = useContext(UserContext)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleDelete(e) {
    e.preventDefault()
    try {
      const res = await fetch(`/api/split/delete?parent_id=${parent.id}`, {
        method: 'POST'
      })
      onClose()
      mutate(`/api/transaction/get-all?user_id=${user.id}`)
      const json = await res.json()
      if (!res.ok) throw Error(json.message)
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
      let res = await fetch(`/api/split/delete?parent_id=${parent.id}`, {
        method: 'POST'
      })
      let json = await res.json()
      if (!res.ok) throw Error(json.message)
      res = await fetch('/api/split/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          parent_id: parent.id,
          date: formatMySQLDate(parent.date),
          splits
        }),
      })
      onClose()
      mutate(`/api/transaction/get-all?user_id=${user.id}`)
      json = await res.json()
      if (!res.ok) throw Error(json.message)
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