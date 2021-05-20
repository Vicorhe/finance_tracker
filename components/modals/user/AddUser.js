import { useState } from 'react'
import {
  useDisclosure,
  Button
} from "@chakra-ui/react"
import { mutate } from 'swr'
import RenderUser from './RenderUser'

export default function AddUser() {
  const { isOpen, onOpen, onClose } = useDisclosure(
    {
      onClose: () => {
        setName('')
      }
    }
  )
  const [name, setName] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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

  return (
    <>
      <Button
        onClick={onOpen}
        size="lg"
      >
        Add
      </Button>

      <RenderUser
        header={'Create your account'}
        submitButtonLabel={'Create'}
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        name={name}
        handleNameChange={(e) => setName(e.target.value)}
      />
    </>
  )
}