import { useState } from 'react'
import {
  useDisclosure,
  Button
} from "@chakra-ui/react"
import { mutate } from 'swr'
import RenderArea from './RenderArea'

export default function AddArea() {
  const { isOpen, onOpen, onClose } = useDisclosure(
    {
      onClose: () => {
        setName('')
        setDescription('')
        setColor('')
        setInput(false)
      }
    })
  const [name, setName] = useState('')
  const [input, setInput] = useState(false)
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('')

  async function handleSubmit(e) {
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
      <Button
        onClick={onOpen}
        size="lg"
      >
        Add
      </Button>
      <RenderArea
        header={'Create a new Area'}
        submitButtonLabel={'Create'}
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        name={name}
        handleNameChange={(e) => setName(e.target.value)}
        input={input}
        handleInputChange={() => setInput(!input)}
        description={description}
        handleDescriptionChange={(e) => setDescription(e.target.value)}
        color={color}
        handleColorChange={setColor}
      />
    </>
  )
}