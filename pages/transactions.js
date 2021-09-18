import { useEffect, useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { mutate } from 'swr'
import useAreas from "../hooks/areas"
import Nav from '../components/Nav'
import AddManualTransaction from '../components/modals/transaction/AddManualTransaction'
import TransactionsTable from '../components/TransactionsTable'
import LoadingError from '../components/LoadingError'
import LoadingList from '../components/LoadingList'
import { Box, Button, Heading, Flex, Select } from "@chakra-ui/react"
import utilStyles from '../styles/utils.module.scss'
import fetcher from '../utils/fetcher'

const NEXT_PUBLIC_USER_ID = process.env.NEXT_PUBLIC_USER_ID;

function useTransactions() {
  const { data, error } = useSWR(
    `/api/transaction/get-all?user_id=${NEXT_PUBLIC_USER_ID}`,
    fetcher
  );
  return {
    transactions: data,
    isTransactionsLoading: !error && !data,
    isTransactionsError: error,
  }
}

export default function Transactions() {
  const { areas, isAreasError } = useAreas();
  const { transactions, isTransactionsError } = useTransactions()
  const [displayedTransactions, setDisplayedTransactions] = useState([])
  const [filterBy, setFilterBy] = useState('all')
  const [syncing, setSyncing] = useState(false)

  const breadcrumbs = [
    { name: "transactions", path: "/transactions" }
  ]

  useEffect(() => {
    if (transactions) {
      filterTransactions()
    }
  }, [transactions])

  useEffect(() => {
    filterTransactions()
  }, [filterBy])

  function filterTransactions() {
    if (!transactions)
      return
    switch (filterBy) {
      case 'unassigned':
        setDisplayedTransactions(transactions.filter(t => (t.area_id === null) && !t.hidden))
        break
      case 'hidden':
        setDisplayedTransactions(transactions.filter(t => !!t.hidden))
        break
      case 'manual':
        setDisplayedTransactions(transactions.filter(t => !!t.manual))
        break
      case 'split':
        setDisplayedTransactions(transactions.filter(t => !!t.split))
        break
      default:
        setDisplayedTransactions(transactions ? transactions : [])
        break
    }
  }

  async function syncTransactions() {
    setSyncing(true)
    try {
      await axios.post(
        '/api/transaction/sync',
        { user_id: NEXT_PUBLIC_USER_ID }
      )
      mutate(`/api/transaction/get-all?user_id=${NEXT_PUBLIC_USER_ID}`)
    } catch (e) {
      throw Error(e.message)
    }
    setSyncing(false)
  }

  function FilterDropdown() {
    return (
      <Flex alignItems="center" p="3">
        <Heading fontSize="lg" mr="3" fontWeight="extrabold">SHOWING</Heading>
        <Select
          size="md"
          maxWidth="225px"
          disabled={!transactions}
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        >
          <option value="all">All</option>
          <option value="unassigned">Unassigned</option>
          <option value="hidden">Hidden</option>
          <option value="manual">Manual Transactions</option>
          <option value="split">Splits</option>
        </Select>
      </Flex>
    )
  }

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
        <Button disabled={syncing} size="lg" mr="3" onClick={syncTransactions}>
          {syncing ? 'Syncing ...' : 'Sync'}
        </Button>
        <AddManualTransaction />
      </Nav>
      {
        (isTransactionsError || isAreasError)
          ? LoadingError()
          : (!transactions || !areas)
            ? LoadingList()
            : <>
              {FilterDropdown()}
              <TransactionsTable displayedTransactions={displayedTransactions} />
            </>
      }
    </Box>
  )
}