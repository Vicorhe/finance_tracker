import { useEffect, useState } from 'react'
import { mutate } from 'swr'
import RenderArea from './RenderArea'

export default function EditArea({ area, isOpen, onClose }) {

  const [name, setName] = useState('')
  const [input, setInput] = useState(false)
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('')

  useEffect(() => {
    setName(area.name)
    setDescription(area.description)
    setColor(!!area.color ? area.color : '#ffffff')
    setInput(!!area.input)
  }, [isOpen])

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
  )
}