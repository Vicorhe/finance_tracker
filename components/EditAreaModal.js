import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
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
  Spacer
} from "@chakra-ui/react"
import { EditIcon } from '@chakra-ui/icons'
import { mutate } from 'swr'
import { SliderPicker } from 'react-color';

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

  async function submitHandler(e) {
    setSubmitting(true)
    e.preventDefault()
    try {
      const res = await fetch('/api/area/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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

  function handleChangeComplete(color) {
    setColor(color.hex);
  };

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
            <ModalHeader>Edit Area {area.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl mb="1.5rem">
                <FormLabel>Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl mb="1.25rem">
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Color</FormLabel>
                <Input
                  mb="1rem"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <SliderPicker
                  color={color}
                  onChangeComplete={handleChangeComplete} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button disabled={submitting} colorScheme="red" mr={3} onClick={onClose}>Delete</Button>
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