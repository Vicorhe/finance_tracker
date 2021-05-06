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
  Switch,
  Textarea,
  Center
} from "@chakra-ui/react"
import { mutate } from 'swr'
import { SwatchesPicker } from 'react-color';

export default function AddAreaModal() {
  const { isOpen, onOpen, onClose } = useDisclosure(
    {
      onClose: () => {
        setName('')
        setDescription('')
        setColor('')
      }
    })
  const [name, setName] = useState('')
  const [input, setInput] = useState(false)
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
          color,
          input
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

  const initialRef = React.useRef()

  function handleChangeComplete(color) {
    setColor(color.hex);
  };

  return (
    <>
      <Button onClick={onOpen} size="lg">Add</Button>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={submitHandler}>
            <ModalHeader>Define an area</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl mb="1.5rem">
                <FormLabel>Name</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Electronics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl mb="1.5rem">
                <FormLabel>Input {input}</FormLabel>
                <Switch
                  value={input}
                  onChange={(e) => setInput(!input)}
                />
              </FormControl>
              <FormControl mb="1.25rem">
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Devices, waranties, insurance.."
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
              <Button disabled={submitting} colorScheme="blue" mr={3} type="submit">
                {submitting ? 'Creating ...' : 'Create'}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}