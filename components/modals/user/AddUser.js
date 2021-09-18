import { useState } from 'react'
import {
  useDisclosure,
  Button
} from "@chakra-ui/react"
import { mutate } from 'swr'
import RenderUser from './RenderUser'
import axios from 'axios'

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
      const res = await axios.post('/api/user/create', { name })
      onClose()
      mutate('/api/user/get-all')
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