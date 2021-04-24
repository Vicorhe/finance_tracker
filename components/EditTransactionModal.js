import { useContext, useEffect, useState, useRef } from 'react'
import { UserContext } from '../context'
import DatePicker from "../components/DatePicker";
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
import { useAreas } from '../lib/swr-hooks'
import { mutate } from 'swr'

export default function EditTransactionModal({ transaction, isModalOpen, onModalClose }) {
  const { user } = useContext(UserContext)
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose
  } = useDisclosure()
  const [isHidden, setIsHidden] = useState(false)
  const [isNotCash, setIsNotCash] = useState(false)
  const [isSplitParent, setIsSplitParent] = useState(false)
  const [isSplitChild, setIsSplitChild] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [area, setArea] = useState('')
  const [date, setDate] = useState(new Date())
  const [memo, setMemo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { areas, isAreasError } = useAreas();
  const cancelRef = useRef()
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setIsHidden(!!transaction.hidden)
    setIsNotCash(!transaction.cash)
    setIsSplitParent(!!transaction.split && !transaction.parent_id)
    setIsSplitChild(!!transaction.split && !!transaction.parent_id)
    setName(transaction.name)
    setAmount(transaction.amount)
    const assignedArea = transaction.area_id ? transaction.area_id : ''
    setArea(assignedArea)
    setDate(new Date(transaction.date))
    setMemo(transaction.memo ? transaction.memo : '')
  }, [transaction])

  async function submitHandler(e) {
    setSubmitting(true)
    e.preventDefault()
    try {
      // const res = await fetch('/api/user/update', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     id: user.id,
      //     name
      //   }),
      // })
      setSubmitting(false)
      onModalClose()
      // mutate(`/api/transaction/get-all?user_id=${user.id}`)
      // const json = await res.json()
      // if (!res.ok) throw Error(json.message)
    } catch (e) {
      throw Error(e.message)
    }
  }

  async function handleDelete(e) {
    setDeleting(true)
    e.preventDefault()
    try {
      const res = await fetch(`/api/transaction/delete?id=${transaction.id}`, {
        method: 'POST'
      })
      setDeleting(false)
      onAlertClose()
      onModalClose()
      mutate(`/api/transaction/get-all?user_id=${user.id}`)
      const json = await res.json()
      if (!res.ok) throw Error(json.message)
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
          <form onSubmit={submitHandler}>
            <ModalCloseButton />
            <ModalBody py={6}>
              <FormControl mb="4">
                <FormLabel>Name</FormLabel>
                <Input
                  isDisabled={isNotCash && !isSplitChild}
                  placeholder="Paradise Zoanthids"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Amount</FormLabel>
                <NumberInput
                  isDisabled={isNotCash && !isSplitChild}
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
                  disabled={isNotCash}
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
            </ModalBody>

            <ModalFooter>
              {
                (!isNotCash || isSplitChild) &&
                <Button disabled={submitting || deleting}
                  colorScheme="red" 
                  mr={3}
                  onClick={onAlertOpen}>
                  Delete
                </Button>
              }
              {
                (isNotCash && !isSplitParent && !isSplitChild) &&
                <Button disabled={submitting || deleting}
                  colorScheme="purple"
                  mr={3}
                >
                  Split
                </Button>
              }
              {
                (!isHidden && isNotCash && !isSplitParent && !isSplitChild) && 
                <Button disabled={submitting || deleting}
                  colorScheme="yellow"
                  mr={3}
                >
                  Hide
                </Button>
              }
              {
                isHidden && 
                <Button disabled={submitting || deleting}
                  colorScheme="yellow"
                  mr={3}
                >
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