import { useState } from 'react'
import { EditIcon } from '@chakra-ui/icons'
import {
  useDisclosure,
  IconButton
} from "@chakra-ui/react"
import { mutate } from 'swr'
import RenderUser from './RenderUser'

export default function EditUser({ user }) {
  const { isOpen, onOpen, onClose } = useDisclosure(
    {
      onOpen: () => {
        setName(user.name)
      }
    })
  const [name, setName] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          name
        }),
      })
      onClose()
      mutate('/api/user/get-all')
      const json = await res.json()
      if (!res.ok) throw Error(json.message)
    } catch (e) {
      throw Error(e.message)
    }
  }

  async function handleDelete(e) {
    e.preventDefault()
    try {
      const res = await fetch(`/api/user/delete?id=${user.id}`, {
        method: 'POST'
      })
      onClose()
      mutate('/api/user/get-all')
      const json = await res.json()
      if (!res.ok) throw Error(json.message)
    } catch (e) {
      throw Error(e.message)
    }
  }

  return (
    <>
      <IconButton
        icon={<EditIcon />}
        size="sm"
        variant="outline"
        onClick={onOpen}
      />

      <RenderUser
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        name={name}
        handleNameChange={(e) => setName(e.target.value)}
      />
    </>
  )
}