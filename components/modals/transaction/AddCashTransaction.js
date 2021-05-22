import { useContext, useState } from 'react'
import useAreas from '../../../hooks/areas'
import { UserContext } from '../../../context'
import DatePicker from "../../DatePicker";
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
import { formatMySQLDate } from '../../../utils/date-formatter'

export default function AddCashTransaction() {
  const { user } = useContext(UserContext)
  const { isOpen, onOpen, onClose } = useDisclosure(
    {
      onClose: () => {
        setName('')
        setAmount(null)
        setArea('')
        setDate(new Date())
        setMemo('')
      }
    }
  )
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [area, setArea] = useState('')
  const [date, setDate] = useState(new Date())
  const [memo, setMemo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { areas, isAreasError } = useAreas();

  async function handleSubmit(e) {
    setSubmitting(true)
    e.preventDefault()
    try {
      const res = await fetch('/api/cash/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          name,
          area_id: area,
          amount,
          date: formatMySQLDate(date),
          memo
        }),
      })
      setSubmitting(false)
      onClose()
      mutate(`/api/transaction/get-all?user_id=${user.id}`)
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
          <form onSubmit={handleSubmit}>
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
                    placeholder='Unassigned'
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  >
                    {
                      areas.map((a) =>
                        <option key={a.id}
                          value={a.id}>{a.name}
                        </option>
                      )
                    }
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