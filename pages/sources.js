import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { mutate } from 'swr'
import {
  Box, Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon,
  Button, Text, Flex, AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure
} from "@chakra-ui/react"
import Nav from '../components/Nav'
import PlaidLink from "../components/PlaidLink"
import LoadingError from '../components/LoadingError'
import LoadingList from '../components/LoadingList'
import fetcher from '../utils/fetcher'
import utilStyles from '../styles/utils.module.scss'

const NEXT_PUBLIC_USER_ID = process.env.NEXT_PUBLIC_USER_ID;

function useAccounts() {
  const { data, error } = useSWR(
    "/api/account/get-all",
    fetcher
  );
  return {
    accounts: data,
    isAccountsLoading: !error && !data,
    isAccountsError: error,
  }
}

function useItems() {
  const { data, error } = useSWR(
    "/api/item/get-all",
    fetcher
  );
  return {
    items: data,
    isItemsLoading: !error && !data,
    isItemsError: error,
  }
}

export default function Sources() {
  const { accounts, isAccountsError } = useAccounts();
  const { items, isItemsError } = useItems();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef()
  const [token, setToken] = useState(null)
  const [access_token, setAccessToken] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const breadcrumbs = [
    { name: "sources", path: "/sources" }
  ]

  useEffect(() => {
    createLinkToken()
  }, []);

  function selectItem(itemId) {
    setSelectedItem(itemId)
    onOpen()
  }

  async function createLinkToken() {
    try {
      const res = await axios.post('/api/item/create-link-token');
      const data = res.data.link_token
      setToken(data)
    } catch (e) {
      throw Error(e.message)
    }
  }

  async function createItem(publicToken) {
    try {
      const res = await axios.post('/api/item/create', { publicToken: publicToken, user_id: NEXT_PUBLIC_USER_ID });
      const data = res.data.access_token;
      setAccessToken(data)
      mutate('/api/item/get-all')
      mutate('/api/account/get-all')
      await axios.post('/api/transaction/sync', { user_id: NEXT_PUBLIC_USER_ID });
    } catch (e) {
      throw Error(e.message)
    }
  }

  async function handleDelete(e) {
    e.preventDefault()
    try {
      const res = await axios.post(`/api/item/delete?id=${selectedItem}`, {})
      onClose()
      mutate('/api/item/get-all')
      mutate('/api/account/get-all')
    } catch (e) {
      throw Error(e.message)
    }
  }

  function SourcesTable() {
    return (
      <Accordion allowMultiple>
        {items.filter(i => i.user_id == NEXT_PUBLIC_USER_ID).map(i => (
          <AccordionItem key={i.id}>
            <AccordionButton py="4" px="5">
              <Text flex="1" textAlign="left" fontSize="3xl">{i.institution_name}</Text>
              <AccordionIcon w="7" h="7" />
            </AccordionButton>
            <AccordionPanel pb={4}>
              {accounts.filter(a => a.item_id == i.id).map(a => (
                <Text key={a.id} fontSize="xl" pl="9" pb="1">{a.name}</Text>
              ))}
              <Flex>
                <Button ml="auto" size="lg" colorScheme="red" onClick={() => selectItem(i.id)}>Delete</Button>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
        {token &&
          <PlaidLink
            token={token}
            accessToken={access_token}
            createItem={createItem}
          />}
      </Nav>
      {
        (isAccountsError || isItemsError)
          ? LoadingError()
          : (!accounts || !items)
            ? LoadingList()
            : SourcesTable()
      }
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        size="sm"
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Institution
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}