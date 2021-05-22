import { useEffect, useRef, useState } from 'react'
import useAreas from '../../../hooks/areas'
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
import { remainingAmount } from '../../../utils/split-utils'

export default function RenderSplitTransactions({
  header,
  submitButtonLabel,
  isOpen,
  onClose,
  handleSubmit,
  handleDelete,
  parent,
  splits,
  setSplits,
  errorMessage, 
  setErrorMessage
}) {
  const [tabIndex, setTabIndex] = useState(1)
  const { areas, isAreasError } = useAreas();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose
  } = useDisclosure()
  const cancelRef = useRef()
  
    useEffect(() => {
      setErrorMessage('')
      setTabIndex(0)
    }, [isOpen])

  function closeAlertAfterDelete(e) {
    handleDelete(e)
    onAlertClose()
  }

  function getBlankSplit() {
    return {
      name: '',
      amount: '',
      area_id: '',
      memo: ''
    }
  }

  const handleTabsChange = (index) => {
    setErrorMessage('')
    setTabIndex(index)
  }

  function addSplit() {
    setErrorMessage('')
    setSplits(splits.concat([
      getBlankSplit()
    ]))
    setTabIndex(splits.length)
  }

  function removeSplit(index) {
    setErrorMessage('')
    setSplits(splits.filter((_, idx) => index !== idx))
    if (index >= splits.length - 1)
      setTabIndex(index - 1)
  }

  const updateFieldChanged = index => e => {
    setErrorMessage('')
    const newSplits = splits.map((split, idx) => {
      if (idx !== index) return split;
      return { ...split, [e.target.name]: e.target.value };
    });

    setSplits(newSplits);
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={handleSubmit}
          >
            {
              !!header &&
              <ModalHeader pb={0}>{header}</ModalHeader>
            }
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
                      color={remainingAmount(parent, splits) === '0.00' ? "black" : "red"}
                      pl={1}>
                      ${remainingAmount(parent, splits)}
                    </Heading>
                  </Flex>
                  {
                    !!errorMessage &&
                    <Box p="3" mb="2" border="2px red solid">
                      <Text color="red">{errorMessage}</Text>
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
              {
                !!handleDelete &&
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={onAlertOpen}>
                  Delete All Splits
                </Button>
              }
              <Spacer />
              <Button
                colorScheme="blue"
                type="submit"
                mr={3}
              >
                {submitButtonLabel}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      {
        !!handleDelete &&
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
                <Button colorScheme="red" onClick={closeAlertAfterDelete} ml={3}>
                  Delete All Splits
              </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      }
    </>
  )
}