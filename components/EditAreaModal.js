import { useState } from 'react'
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
  Textarea,
  IconButton,
  Spacer,
  Center
} from "@chakra-ui/react"
import { EditIcon } from '@chakra-ui/icons'
import { mutate } from 'swr'
import { SwatchesPicker } from 'react-color';

export default function EditAreaModal({ area }) {
  const { isOpen, onOpen, onClose } = useDisclosure(
    {
      onOpen: () => {
        setName(area.name)
        setDescription(area.description)
        setColor(!!area.color ? area.color : '#ffffff')
      }
    })
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function handleChangeComplete(color) {
    setColor(color.hex);
  };

  async function submitHandler(e) {
    setSubmitting(true)
    e.preventDefault()
    try {
      const res = await fetch('/api/area/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: area.id,
          name,
          description,
          color
        }),
      })
      setSubmitting(false)
      onClose()
      mutate('/api/area/get-all')
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
      const res = await fetch(`/api/area/delete?id=${area.id}`, {
        method: 'POST'
      })
      setDeleting(false)
      onClose()
      mutate('/api/area/get-all')
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
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={submitHandler}>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl my="1.15rem">
                <FormLabel>Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl mb="1.15rem">
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Color</FormLabel>
                <Center>
                <SwatchesPicker
                  width="422px"
                  height="200px"
                  color={color}
                  onChangeComplete={handleChangeComplete} />
                </Center>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button disabled={submitting || deleting} colorScheme="red" mr={3} onClick={handleDelete}>Delete</Button>
              <Spacer />
              <Button disabled={submitting || deleting} colorScheme="blue" mr={3} type="submit">
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