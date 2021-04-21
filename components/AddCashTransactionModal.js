import { useState } from 'react'
import { useAreas } from '../lib/swr-hooks'
import DatePicker from "../components/DatePicker";
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
  NumberInput,
  NumberInputField,
  Textarea,
  Select
} from "@chakra-ui/react"
import { mutate } from 'swr'

export default function AddCashTransactionModal() {
  const { isOpen, onOpen, onClose } = useDisclosure(
    {
      onClose: () => {
        setName('')
        setAmount(null)
        setArea(null)
        setDate(new Date())
        setMemo('')
      }
    }
  )
  const [name, setName] = useState('')
  const [amount, setAmount] = useState(null)
  const [area, setArea] = useState(null)
  const [date, setDate] = useState(new Date())
  const [memo, setMemo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { areas, isAreasError } = useAreas();

  async function submitHandler(e) {
    setSubmitting(true)
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
      setSubmitting(false)
      onClose()
      mutate('/api/user/get-all')
      const json = await res.json()
      if (!res.ok) throw Error(json.message)
    } catch (e) {
      throw Error(e.message)
    }
  }

  const initialRef = React.useRef()

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
            <ModalHeader>Add Cash Transaction</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl mb="4">
                <FormLabel>Name</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Paradise Zoanthids"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Amount</FormLabel>
                <NumberInput precision={2}>
                  <NumberInputField
                    placeholder="6.17"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </NumberInput>
              </FormControl>
              {
                !!areas &&
                <FormControl mb="4">
                  <FormLabel>Area</FormLabel>
                  <Select
                    placeholder="Reef"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  >
                    {areas.map(a => (
                      <option key={a.id}
                        value={a.id}>{a.name}</option>
                    ))}
                  </Select>
                </FormControl>

              }

              <FormControl mb="4">
                <FormLabel htmlFor="date">Date</FormLabel>
                <DatePicker
                  id="date"
                  selectedDate={date}
                  onChange={d => setDate(d)}
                  showPopperArrow={true}
                />
              </FormControl>

              <FormControl mb="4">
                <FormLabel>Memo</FormLabel>
                <Textarea
                  placeholder="Rewarding myself"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
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