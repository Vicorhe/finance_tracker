import { useContext, useEffect, useRef, useState } from 'react'
import useAreas from '../hooks/areas'
import { UserContext } from '../context'
import {
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
  Textarea,
  Select,
  Text,
  Heading, Box, Flex,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  IconButton,
  Spacer,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure
} from "@chakra-ui/react"
import { AddIcon } from '@chakra-ui/icons'
import { mutate } from 'swr'
import { formatMySQLDate } from '../utils/date-formatter'

export default function EditSplitTransactionsModal({ parent, activeSplits, isModalOpen, onModalClose }) {
  const { user } = useContext(UserContext)
  const [errMessage, setErrMessage] = useState('')
  const [parentAmount, setParentAmount] = useState(0)
  const [tabIndex, setTabIndex] = useState(1)
  const [splits, setSplits] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const { areas, isAreasError } = useAreas();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose
  } = useDisclosure()
  const cancelRef = useRef()
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setErrMessage('')
    setSplits(activeSplits)
    setTabIndex(0)
  }, [parent, activeSplits, isModalOpen])

  useEffect(() => {
    if (parent.amount !== null && parent.amount !== undefined)
      setParentAmount(parent.amount)
  }, [parent])

  function getBlankSplit() {
    return {
      name: '',
      amount: '',
      area_id: '',
      memo: ''
    }
  }

  function remainingAmount() {
    var rem = parentAmount
    for (var i = 0; i < splits.length; i++) {
      let parsed = parseFloat(splits[i].amount)
      if (!isNaN(parsed))
        rem -= parsed
    }
    return Math.abs(rem).toFixed(2)
  }

  const handleTabsChange = (index) => {
    setErrMessage('')
    setTabIndex(index)
  }

  function addSplit() {
    setErrMessage('')
    setSplits(splits.concat([
      getBlankSplit()
    ]))
    setTabIndex(splits.length)
  }

  function removeSplit(index) {
    setErrMessage('')
    setSplits(splits.filter((_, idx) => index !== idx))
    if (index >= splits.length - 1)
      setTabIndex(index - 1)
  }

  const updateFieldChanged = index => e => {
    setErrMessage('')
    const newSplits = splits.map((split, idx) => {
      if (idx !== index) return split;
      return { ...split, [e.target.name]: e.target.value };
    });

    setSplits(newSplits);
  }

  function validForm() {
    setErrMessage('')
    if (remainingAmount() !== '0.00') {
      setErrMessage('Please make sure all the parent transaction amount is accounted for in splits.')
      return false
    }
    for (var i = 0; i < splits.length; i++) {
      let s = splits[i]
      if (!s.amount) {
        setErrMessage('Please make sure all splits have an `amount` set.')
        return false
      }
      if (!s.name) {
        setErrMessage('Please make sure all splits have a `name` set.')
        return false
      }
    }
    return true
  }

  async function handleDeleteSplits(e) {
    setDeleting(true)
    e.preventDefault()
    try {
      const res = await fetch(`/api/split/delete?parent_id=${parent.id}`, {
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

  async function handleSave(e) {
    e.preventDefault()
    if (!validForm())
      return
    setSubmitting(true)
    try {
      let res = await fetch(`/api/split/delete?parent_id=${parent.id}`, {
        method: 'POST'
      })
      let json = await res.json()
      if (!res.ok) throw Error(json.message)
      res = await fetch('/api/split/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          parent_id: parent.id,
          date: formatMySQLDate(parent.date),
          splits
        }),
      })
      setSubmitting(false)
      onModalClose()
      mutate(`/api/transaction/get-all?user_id=${user.id}`)
      json = await res.json()
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
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={handleSave}
          >
            <ModalCloseButton />
            <ModalBody pt={6}>
              <Tabs
                index={tabIndex}
                onChange={handleTabsChange}
              >
                <Box>
                  <Heading fontSize="2xl">{parent.name}</Heading>
                  <Flex alignItems="center" m={1}>
                    <Text fontWeight="semibold">REMAINING: </Text>
                    <Heading
                      fontSize="2xl"
                      color={remainingAmount() === '0.00' ? "black" : "red"}
                      pl={1}>
                      ${remainingAmount()}
                    </Heading>
                  </Flex>
                  {
                    !!errMessage &&
                    <Box p="3" mb="2" border="2px red solid">
                      <Text color="red">{errMessage}</Text>
                    </Box>
                  }

                </Box>
                <TabList alignItems="center">
                  {
                    splits.map((s, i) => (
                      <Tab key={i}>Split #{i + 1}</Tab>
                    ))
                  }
                  <IconButton
                    ml={3}
                    icon={<AddIcon />}
                    size="xs"
                    variant="ghost"
                    onClick={addSplit} />
                </TabList>

                <TabPanels>
                  {
                    splits.map((s, idx) => (
                      <TabPanel key={idx} pb="0">
                        <FormControl mb="4">
                          <FormLabel>Name</FormLabel>
                          <Input
                            placeholder={`Split #${idx + 1} Name`}
                            value={s.name}
                            name="name"
                            onChange={updateFieldChanged(idx)}
                          />
                        </FormControl>
                        <FormControl mb="4">
                          <FormLabel>Amount</FormLabel>
                          <Input
                            placeholder={`Split #${idx + 1} Amount`}
                            value={s.amount}
                            type="number"
                            name="amount"
                            onChange={updateFieldChanged(idx)}
                          />
                        </FormControl>
                        {
                          !!areas &&
                          <FormControl mb="4">
                            <FormLabel>Area</FormLabel>
                            <Select
                              placeholder={`Split #${idx + 1} Area`}
                              value={!!s.area_id ? s.area_id : ''}
                              name="area_id"
                              onChange={updateFieldChanged(idx)}
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
                          <FormLabel>Memo</FormLabel>
                          <Textarea
                            placeholder={`Split #${idx + 1} Memo`}
                            value={s.memo}
                            name="memo"
                            onChange={updateFieldChanged(idx)}
                          />
                        </FormControl>
                        <Button
                          isDisabled={splits.length < 2}
                          colorScheme="red"
                          onClick={() => removeSplit(idx)}
                        >
                          Remove Split
                          </Button>
                      </TabPanel>
                    ))
                  }
                </TabPanels>
              </Tabs>

            </ModalBody>

            <ModalFooter>
              <Button disabled={submitting || deleting}
                colorScheme="red"
                mr={3}
                onClick={onAlertOpen}>
                Delete Split
              </Button>
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
              Undo Split Transaction
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteSplits} ml={3}>
                Delete All Splits
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}