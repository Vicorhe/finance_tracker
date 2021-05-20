import { useState } from 'react'
import {
  useDisclosure,
  IconButton,
} from "@chakra-ui/react"
import { EditIcon } from '@chakra-ui/icons'
import { mutate } from 'swr'
import RenderArea from './RenderArea'

export default function EditArea({ area }) {
  const { isOpen, onOpen, onClose } = useDisclosure(
    {
      onOpen: () => {
        setName(area.name)
        setDescription(area.description)
        setColor(!!area.color ? area.color : '#ffffff')
        setInput(!!area.input)
      }
    })
  const [name, setName] = useState('')
  const [input, setInput] = useState(false)
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('')

  async function handleSubmit(e) {
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

  async function handleDelete(e) {
    e.preventDefault()
    try {
      const res = await fetch(`/api/area/delete?id=${area.id}`, {
        method: 'POST'
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
      <IconButton
        icon={<EditIcon />}
        size="sm"
        variant="outline"
        onClick={onOpen}
      />

      <RenderArea
        submitButtonLabel={'Save'}
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
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