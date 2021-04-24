import { useContext, useEffect, useState } from 'react'
import { useAreas } from '../lib/swr-hooks'
import { UserContext } from '../context'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
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
  const [splits, setSplits] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [area, setArea] = useState('')
  const [memo, setMemo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { areas, isAreasError } = useAreas();

  useEffect(() => {
    setRemainingAmount(parent.amount)
    setSplits([getBlankSplit()])
  }, [parent])

  function getBlankSplit() {
    return {
      name: '',
      amount: '',
      area_id: '',
      memo: ''
    }
  }

  function addSplit() {
    setSplits([...splits, getBlankSplit()])
  }

  const updateFieldChanged = index => e => {

    console.log('index: ' + index);
    console.log('property name: '+ e.target.name);
    let newSplits = [...splits]; // copying the old datas array
    newSplits[index] = e.target.value; // replace e.target.value with whatever you want to change it to

    setSplits(newSplits); // ??
}

  async function submitHandler(e) {
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
      onClose()
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
            <ModalBody py={6}>
              <Tabs>
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
                      <TabPanel key={idx}>
                        <FormControl mb="4">
                          <FormLabel>Name</FormLabel>
                          <Input
                            ref={initialRef}
                            placeholder="Paradise Zoanthids"
                            value={s.name}
                            name="name"
                            onChange={updateFieldChanged(idx)}
                          />
                        </FormControl>
                        <FormControl mb="4">
                          <FormLabel>Amount</FormLabel>
                          <NumberInput precision={2}>
                            <NumberInputField
                              placeholder="6.17"
                              value={amount}
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
                              placeholder='Unassigned'
                              value={area}
                              name="area"
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
                            placeholder="Rewarding myself"
                            value={memo}
                            name="memo"
                            onChange={updateFieldChanged(idx)}
                          />
                        </FormControl>
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