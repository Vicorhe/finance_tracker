import { useState, useContext } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spacer
} from "@chakra-ui/react"
import { mutate } from 'swr'
import { UserContext } from '../context'

export default function EditUserModal() {
  const { user } = useContext(UserContext)

  const { isOpen, onOpen, onClose } = useDisclosure(
    {
      onOpen: () => {
        setName(user.name)
      }
    })
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function submitHandler(e) {
    setSubmitting(true)
    e.preventDefault()
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name
        }),
      })
      setSubmitting(false)
      onClose()
      mutate('/api/user/get-all')
      const json = await res.json()
      if (!res.ok) throw Error(json.message)
    } catch (e) {
      throw Error(e.message)
    }
  }

  async function handleDelete(e) {
    setDeleting(true)
    e.preventDefault()
    try {
      const res = await fetch(`/api/user/delete?id=${user.id}`, {
        method: 'POST'
      })
      setDeleting(false)
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
      <Button onClick={onOpen} size="lg">Edit</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={submitHandler}>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>User name</FormLabel>
                <Input
                  placeholder="User name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button disabled={submitting || deleting} colorScheme="red" mr={3} onClick={handleDelete}>Delete</Button>
              <Spacer />
              <Button disabled={submitting} colorScheme="blue" mr={3} type="submit">
                {submitting ? 'Saving ...' : 'Save'}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}