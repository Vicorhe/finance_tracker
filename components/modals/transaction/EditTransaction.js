import { useEffect, useState, useRef } from 'react'
import DatePicker from "../../DatePicker";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
  Spacer,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react"
import useAreas from '../../../hooks/areas'
import { mutate } from 'swr'
import { formatMySQLDate } from '../../../utils/date-formatter'
import axios from 'axios';
const NEXT_PUBLIC_USER_ID = process.env.NEXT_PUBLIC_USER_ID;

export default function EditTransaction({
  transaction,
  isModalOpen,
  onModalClose,
  handleSplit,
  refresh
}) {
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose
  } = useDisclosure()
  const [isHidden, setIsHidden] = useState(false)
  const [isNotManual, setIsNotManual] = useState(false)
  const [isSplitParent, setIsSplitParent] = useState(false)
  const [isSplitChild, setIsSplitChild] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [area, setArea] = useState('')
  const [date, setDate] = useState(new Date())
  const [memo, setMemo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { areas } = useAreas();
  const cancelRef = useRef()
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setIsHidden(!!transaction.hidden)
    setIsNotManual(!transaction.manual)
    setIsSplitParent(!!transaction.split && !transaction.parent_id)
    setIsSplitChild(!!transaction.split && !!transaction.parent_id)
    setName(transaction.name)
    setAmount(transaction.amount)
    const assignedArea = transaction.area_id ? transaction.area_id : ''
    setArea(assignedArea)
    setDate(new Date(transaction.date))
    setMemo(transaction.memo ? transaction.memo : '')
  }, [transaction])

  async function handleSubmit(e) {
    setSubmitting(true)
    e.preventDefault()
    try {
      const res = await axios.post('/api/transaction/update', {
        id: transaction.id,
        name,
        area_id: area,
        amount,
        date: formatMySQLDate(date),
        memo
      })
      setSubmitting(false)
      onModalClose()
      mutate(`/api/transaction/get-all?user_id=${NEXT_PUBLIC_USER_ID}`)
      refresh()
    } catch (e) {
      throw Error(e.message)
    }
  }

  async function handleDelete(e) {
    setDeleting(true)
    e.preventDefault()
    try {
      const res = await axios.post(`/api/transaction/delete?id=${transaction.id}`, {})
      setDeleting(false)
      onAlertClose()
      onModalClose()
      mutate(`/api/transaction/get-all?user_id=${NEXT_PUBLIC_USER_ID}`)
      refresh()
    } catch (e) {
      throw Error(e.message)
    }
  }

  async function handleToggleVisibility(e) {
    e.preventDefault()
    try {
      const res = await axios.post(`/api/transaction/toggle-visibility?id=${transaction.id}`, {})
      mutate(`/api/transaction/get-all?user_id=${NEXT_PUBLIC_USER_ID}`)
      setIsHidden(!isHidden)
      refresh()
    } catch (e) {
      throw Error(e.message)
    }
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={onModalClose}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalCloseButton />
            <ModalBody py={6}>
              <FormControl mb="4">
                <FormLabel>Name</FormLabel>
                <Input
                  isDisabled={isNotManual && !isSplitChild}
                  placeholder="Paradise Zoanthids"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Amount</FormLabel>
                <NumberInput
                  isDisabled={isNotManual && !isSplitChild}
                  precision={2}
                  defaultValue={amount}>
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
                  disabled={isNotManual}
                />
              </FormControl>

              <FormControl mb="4">
                <FormLabel>Memo</FormLabel>
                <Textarea
                  placeholder="Click to enter memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
              </FormControl>

              {
                isHidden &&
                <FormLabel>Status: Hidden</FormLabel>
              }
            </ModalBody>

            <ModalFooter>
              {
                (!isNotManual || isSplitChild) &&
                <Button disabled={submitting || deleting}
                  colorScheme="red"
                  mr={3}
                  onClick={onAlertOpen}>
                  Delete
                </Button>
              }
              {
                (isNotManual && !isSplitParent && !isSplitChild) &&
                <Button disabled={submitting || deleting}
                  colorScheme="purple"
                  mr={3}
                  onClick={handleSplit}>
                  Split
                </Button>
              }
              {
                (!isHidden && isNotManual && !isSplitParent && !isSplitChild) &&
                <Button disabled={submitting || deleting}
                  colorScheme="yellow"
                  mr={3}
                  onClick={handleToggleVisibility}>
                  Hide
                </Button>
              }
              {
                isHidden &&
                <Button disabled={submitting || deleting}
                  colorScheme="yellow"
                  mr={3}
                  onClick={handleToggleVisibility}>
                  Show
                </Button>
              }
              {
                (isSplitParent || isSplitChild) &&
                <Button disabled={submitting || deleting}
                  colorScheme="purple"
                  mr={3}
                >
                  Undo Split
                </Button>
              }
              <Spacer />
              <Button disabled={submitting} colorScheme="blue" mr={3} type="submit">
                {submitting ? 'Saving ...' : 'Save'}
              </Button>
              <Button onClick={onModalClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
        size="sm"
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Transaction
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}