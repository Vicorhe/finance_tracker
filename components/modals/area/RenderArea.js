import { useRef } from 'react'
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
  Switch,
  Textarea,
  Spacer,
  Center,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react"
import { SwatchesPicker } from 'react-color';

export default function EditArea({
  header,
  submitButtonLabel,
  isOpen,
  onClose,
  handleSubmit,
  handleDelete,
  name,
  handleNameChange,
  input,
  handleInputChange,
  description,
  handleDescriptionChange,
  color,
  handleColorChange
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

  function handleChangeComplete(color) {
    handleColorChange(color.hex);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            {
              !!header &&
              <ModalHeader pb={0}>{header}</ModalHeader>
            }
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl my="1.15rem">
                <FormLabel>Name</FormLabel>
                <Input
                  value={name}
                  onChange={handleNameChange}
                />
              </FormControl>
              <FormControl mb="1.5rem">
                <FormLabel>Input</FormLabel>
                <Switch
                  isChecked={input}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mb="1.15rem">
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Color</FormLabel>
                <Center>
                  <SwatchesPicker
                    width="422px"
                    height="200px"
                    color={color}
                    onChangeComplete={handleChangeComplete} />
                </Center>
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
                Delete Area
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