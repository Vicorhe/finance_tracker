import { useContext, useEffect, useState } from 'react'
import { useAreas } from '../lib/swr-hooks'
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
  NumberInput,
  NumberInputField,
  Textarea,
  Select,
  Text,
  Heading, Box, Flex,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  IconButton
} from "@chakra-ui/react"
import { AddIcon } from '@chakra-ui/icons'
import { mutate } from 'swr'
import moment from 'moment';

export default function AddSplitTransactionsModal({ parent, isModalOpen, onModalClose }) {
  const { user } = useContext(UserContext)
  const [remainingAmount, setRemainingAmount] = useState('')
  const [tabIndex, setTabIndex] = useState(1)
  const [splits, setSplits] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const { areas, isAreasError } = useAreas();

  useEffect(() => {
    setRemainingAmount(parent.amount)
    setSplits([getBlankSplit()])
    setTabIndex(0)
  }, [parent, isModalOpen])

  function getBlankSplit() {
    return {
      name: '',
      amount: '',
      area_id: '',
      memo: ''
    }
  }

  const handleTabsChange = (index) => {
    setTabIndex(index)
  }

  function addSplit() {
    setSplits(splits.concat([
      getBlankSplit()
    ]))
    setTabIndex(splits.length)
  }

  function removeSplit(index) {
    setSplits(splits.filter((_, idx) => index !== idx))
    if (index >= splits.length - 1) 
      setTabIndex(index - 1)
  }

  const updateFieldChanged = index => e => {
    const newSplits = splits.map((split, idx) => {
      if (idx !== index) return split;
      return { ...split, [e.target.name]: e.target.value };
    });

    setSplits(newSplits);
  }

  async function submitHandler(e) {
    console.log(splits)
    setSubmitting(true)
    e.preventDefault()
    try {
      // const res = await fetch('/api/cash/create', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     user_id: user.id,
      //     name,
      //     area_id: area,
      //     amount,
      //     date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
      //     memo
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

  const initialRef = React.useRef()

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isModalOpen}
        onClose={onModalClose}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={submitHandler}>
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
                    <Heading fontSize="2xl" pl={1}>${remainingAmount}</Heading>
                  </Flex>

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
                            ref={initialRef}
                            placeholder={`Split #${idx + 1} Name`}
                            value={s.name}
                            name="name"
                            onChange={updateFieldChanged(idx)}
                          />
                        </FormControl>
                        <FormControl mb="4">
                          <FormLabel>Amount</FormLabel>
                          <NumberInput precision={2}>
                            <NumberInputField
                              placeholder={`Split #${idx + 1} Amount`}
                              value={s.amount}
                              name="amount"
                              onChange={updateFieldChanged(idx)}
                            />
                          </NumberInput>
                        </FormControl>
                        {
                          !!areas &&
                          <FormControl mb="4">
                            <FormLabel>Area</FormLabel>
                            <Select
                              placeholder={`Split #${idx + 1} Area`}
                              value={s.area_id}
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
              <Button disabled={submitting} colorScheme="blue" mr={3} type="submit">
                {submitting ? 'Creating ...' : 'Create Splits'}
              </Button>
              <Button onClick={onModalClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}