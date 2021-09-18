import axios from 'axios'
import { useEffect, useState } from 'react'
import { mutate } from 'swr'
import RenderUser from './RenderUser'

export default function EditUser({ user, isOpen, onClose }) {

  const [name, setName] = useState('')

  useEffect(() => {
    setName(user.name)
  }, [isOpen])

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await axios.post('/api/user/update', {
        id: user.id,
        name
      })
      onClose()
      mutate('/api/user/get-all')
    } catch (e) {
      throw Error(e.message)
    }
  }

  async function handleDelete(e) {
    e.preventDefault()
    try {
      const res = await axios.post(`/api/user/delete?id=${user.id}`, {})
      onClose()
      mutate('/api/user/get-all')
    } catch (e) {
      throw Error(e.message)
    }
  }

  return (
    <RenderUser
      submitButtonLabel={'Save'}
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      name={name}
      handleNameChange={(e) => setName(e.target.value)}
    />
  )
}