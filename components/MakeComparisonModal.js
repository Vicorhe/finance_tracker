import { useState } from 'react'
import moment from 'moment';
import DatePicker from './DatePicker'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  Heading,
  Flex,
  Box
} from "@chakra-ui/react"

export default function MakeComparisonModal({ primaryFromDate, primaryToDate }) {
  const { isOpen, onOpen, onClose } = useDisclosure(
    {
      onClose: () => {
        setSecondaryFromDate(new Date())
        setSecondaryToDate(new Date())
      }
    }
  )
  const [secondaryFromDate, setSecondaryFromDate] = useState(new Date())
  const [secondaryToDate, setSecondaryToDate] = useState(new Date())
  const [submitting, setSubmitting] = useState(false)

  async function submitHandler(e) {
    setSubmitting(true)
    e.preventDefault()
    try {
      // const res = await fetch('/api/user/create', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     name
      //   }),
      // })
      setSubmitting(false)
      onClose()
      // const json = await res.json()
      // if (!res.ok) throw Error(json.message)
    } catch (e) {
      throw Error(e.message)
    }
  }


  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme="messenger"
      >
        Make a Comparison
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={submitHandler}>
            <ModalCloseButton />
            <ModalBody pt={9} pb={6} >
              <Flex flexDirection="column" alignItems="center">
                <Heading fontSize="lg" fontWeight="extrabold">COMPARE</Heading>
                <Text fontSize="x-large" py="3">
                  {moment(primaryFromDate).format('MM/DD/YYYY ')}
                --
                {moment(primaryToDate).format(' MM/DD/YYYY')}
                </Text>
                <Heading fontSize="lg" fontWeight="extrabold">TO</Heading>

                <Flex alignItems="center" pt="3">
                  <Box width="167px">
                    <DatePicker
                      id="fromDate"
                      selectedDate={secondaryFromDate}
                      onChange={d => setSecondaryFromDate(d)}
                      showPopperArrow={true}
                    />
                  </Box>
                  <Heading fontSize="lg" px="3" fontWeight="extrabold">--</Heading>
                  <Box width="167px">
                    <DatePicker
                      id="toDate"
                      selectedDate={secondaryToDate}
                      onChange={d => setSecondaryToDate(d)}
                      showPopperArrow={true}
                    />
                  </Box>
                </Flex>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button disabled={submitting} colorScheme="blue" mr={3} type="submit">
                {submitting ? 'Making Comparison ...' : 'Compare'}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}