import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserContext } from '../../context'
import { mutate } from 'swr'
import { useAccounts, useItems } from '../../lib/swr-hooks'
import {
  Box, Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon,
  Button
} from "@chakra-ui/react"
import Nav from '../../components/Nav'
import PlaidLink from "../../components/PlaidLink"
import utilStyles from '../../styles/utils.module.scss'
import LoadingError from '../../components/LoadingError'
import LoadingList from '../../components/LoadingList'

export default function Account() {
  const { accounts, isAccountsError } = useAccounts();
  const { items, isItemsError } = useItems();

  const [token, setToken] = useState(null)
  const [access_token, setAccessToken] = useState(null)
  const { user } = useContext(UserContext)
  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` },
    { name: "sources", path: `/${user.name}/sources` }
  ]

  useEffect(() => {
    createLinkToken()
  }, []);

  async function createLinkToken() {
    const res = await axios.post('http://localhost:3000/api/item/create-link-token');
    const data = res.data.link_token
    setToken(data)
  }

  async function createItem(publicToken) {
    console.log("client side public token", publicToken)
    const res = await axios.post('http://localhost:3000/api/item/create', { publicToken: publicToken, user_id: user.id });
    const data = res.data.access_token;
    setAccessToken(data)
    mutate('/api/item/get-all')
    mutate('/api/account/get-all')
  }

  function SourcesTable() {
    return (
      <Accordion allowMultiple>
        {items.filter(i => i.user_id == user.id).map(i => (
          <AccordionItem key={i.id}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">{i.institution_name}</Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel flex flexDirection="column" pb={4}>
              {accounts.filter(a => a.item_id == i.id).map(a => (
                <p key={a.id}>{a.name}</p>
              ))}
              <Button ml="auto" colorScheme="red">Delete</Button>
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
    </Box>
  )
}