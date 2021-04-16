import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserContext } from "../../context"
import { mutate } from 'swr'
import { useAreas, useTransactions } from "../../lib/swr-hooks"
import Nav from '../../components/Nav'
import { Box, Button, Heading, Text, Flex, Select } from "@chakra-ui/react"
import LoadingError from '../../components/LoadingError'
import LoadingList from '../../components/LoadingList'
import utilStyles from '../../styles/utils.module.scss'

export default function Transactions() {
  const { user } = useContext(UserContext)
  const { areas, isAreasError } = useAreas();
  const { transactions, isTransactionsError } = useTransactions(user.id)
  const [syncing, setSyncing] = useState(false)

  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` },
    { name: "transactions", path: `/${user.name}/transactions` }
  ]

  useEffect(() => {
    //syncTransactions() // commented out during development
  }, []);

  async function syncTransactions() {
    setSyncing(true)
    await axios.post('http://localhost:3000/api/transaction/sync', { user_id: user.id });
    mutate(`/api/transaction/get-all?user_id=${user.id}`)
    setSyncing(false)
  }

  function TransactionsTable() {
    return (
      <Box>
        <Flex alignItems="center" p="3">
          <Heading fontSize="lg" mr="3" fontWeight="extrabold">SHOWING</Heading>
          <Select size="md" maxWidth="225px">
            <option value="option1">Unassigned</option>
            <option value="option2">Hidden</option>
            <option value="option3">Cash Transactions</option>
            <option value="option4">Splits</option>
          </Select>
        </Flex>

        {/* {transactions.map(t => (
          <Box key={t.id}>
            <Text flex="1" textAlign="left" fontSize="3xl">{`uid:${t.user_id}-${t.name}`}</Text>
          </Box>
        ))} */}
      </Box>
    )
  }

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
        <Button disabled={syncing} size="lg" onClick={syncTransactions}>
          {syncing ? 'Syncing ...' : 'Sync'}
        </Button>
      </Nav>
      {
        (isTransactionsError || isAreasError)
          ? LoadingError()
          : (!transactions || !areas)
            ? LoadingList()
            : TransactionsTable()
      }
    </Box>
  )
}