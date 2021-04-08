import { useState } from 'react'
import { EditIcon } from '@chakra-ui/icons'
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
  IconButton,
  Spacer
} from "@chakra-ui/react"
import { mutate } from 'swr'

export default function EditUserModal({user}) {
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
          id: user.id,
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
      <IconButton
        icon={<EditIcon />}
        size="sm"
        variant="outline"
        onClick={onOpen}
      />
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