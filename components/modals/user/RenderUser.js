import { useRef } from 'react'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spacer,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react"
import { onlyLowerCaseAlphaNumeric } from '../../../utils/regular-expressions'

export default function RenderUser({
  header,
  submitButtonLabel,
  isOpen,
  onClose,
  handleSubmit,
  handleDelete,
  name,
  handleNameChange
}) {

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose
  } = useDisclosure()

  const cancelRef = useRef()

  function closeAlertAfterDelete(e) {
    handleDelete(e)
    onAlertClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            {
              !!header &&
              <ModalHeader pb={0}>{header}</ModalHeader>
            }
            <ModalCloseButton />
            <ModalBody
              pt={!!header ? 0 : 3}
              pb={6}
            >
              <FormControl
                my="1.15rem"
                isInvalid={!onlyLowerCaseAlphaNumeric(name)}
              >
                <FormLabel>User name</FormLabel>
                <Input
                  placeholder="User name"
                  value={name}
                  onChange={handleNameChange}
                />
                <FormErrorMessage>
                  Must be 2 - 17 characters, lower case alphanumeric
                </FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              {
                !!handleDelete &&
                <Button
                  mr={3}
                  colorScheme="red"
                  onClick={onAlertOpen}
                >
                  Delete
              </Button>
              }
              <Spacer />
              <Button
                disabled={!onlyLowerCaseAlphaNumeric(name)}
                colorScheme="blue"
                mr={3}
                type="submit"
              >
                {submitButtonLabel}
              </Button>
              <Button onClick={onClose}>
                Cancel
                </Button>
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
                Delete User
            </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={onAlertClose}
                >
                  Cancel
              </Button>
                <Button
                  ml={3}
                  colorScheme="red"
                  onClick={closeAlertAfterDelete}
                >
                  Delete
              </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      }
    </>
  )
}