import { useEffect, useState } from 'react'
import axios from 'axios'
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized'
import { mutate } from 'swr'
import useAreas from "../hooks/areas"
import Nav from '../components/Nav'
import AddManualTransaction from '../components/modals/transaction/AddManualTransaction'
import EditTransaction from '../components/modals/transaction/EditTransaction'
import AddSplitTransactions from '../components/modals/transaction/AddSplitTransactions'
import EditSplitTransactions from '../components/modals/transaction/EditSplitTransactions'
import ColorShard from '../components/ColorShard'
import LoadingError from '../components/LoadingError'
import LoadingList from '../components/LoadingList'
import { useDisclosure, Box, Button, Heading, Text, Flex, Select, IconButton, Badge } from "@chakra-ui/react"
import { EditIcon } from '@chakra-ui/icons'
import utilStyles from '../styles/utils.module.scss'
import useSWR from 'swr'
import fetcher from '../utils/fetcher'
import { formatDisplayDate } from '../utils/date-formatter'
import { getBlankSplit } from '../utils/split-utils'

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
  const [remoteRowCount, setRemoteRowCount] = useState(0)
  const [filterBy, setFilterBy] = useState('all')
  const [syncing, setSyncing] = useState(false)
  const [transaction, setTransaction] = useState({})
  const [splits, setSplits] = useState([])

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose
  } = useDisclosure()

  const {
    isOpen: isAddSplitsModalOpen,
    onOpen: onAddSplitsModalOpen,
    onClose: onAddSplitsModalClose
  } = useDisclosure()

  const {
    isOpen: isEditSplitsModalOpen,
    onOpen: onEditSplitsModalOpen,
    onClose: onEditSplitsModalClose
  } = useDisclosure()

  const breadcrumbs = [
    { name: "transactions", path: "/transactions" }
  ]

  useEffect(() => {
    if (transactions) {
      filterTransactions()
    }
  }, [transactions])

  useEffect(() => {
    setRemoteRowCount(displayedTransactions.length)
  }, [displayedTransactions])

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

  function editTransaction(transaction) {
    setTransaction(transaction)
    if (transaction.split) {
      if (!transaction.parent_id) {
        getSplits(transaction.id)
      } else {
        getTransaction(transaction.parent_id)
        getSplits(transaction.parent_id)
      }
      onEditSplitsModalOpen()
    }
    else {
      onEditModalOpen()
    }
  }

  async function getTransaction(id) {
    try {


      const res = await axios.get(
        `/api/transaction/get?id=${id}`
      )
      setTransaction(res.data)

    } catch (e) {
      throw Error(e.message)

    }
  }

  async function getSplits(parent_id) {
    try {
      const res = await axios.get(
        `/api/split/get-all?parent_id=${parent_id}`
      )
      setSplits(res.data)
    } catch (e) {
      throw Error(e.message)
    }
  }

  function handleSplit() {
    onEditModalClose()
    setSplits([getBlankSplit()])
    onAddSplitsModalOpen()
  }

  function getColorShard(area_id) {
    var color = '#EDEDED'
    if (area_id)
      color = areas.filter(a => a.id == area_id)[0].color
    return <ColorShard color={color} />
  }

  function areaName(area_id) {
    if (!area_id) return 'Unassigned'
    return areas.filter(a => a.id == area_id)[0].name
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

  function isRowLoaded({ index }) {
    return !!displayedTransactions[index];
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

  function rowRenderer({ key, index, style }) {
    const displayedRowCount = displayedTransactions.length
    if (index >= displayedRowCount)
      return
    const t = displayedTransactions[index]
    return (
      <Box
        key={key}
        pt="2"
        pr="20px"
        style={style}
      >
        <Flex alignItems="center" pt="3" borderTop="2px solid">
          <Text fontSize="xl" width="16%">{formatDisplayDate(t.date)}</Text>
          <Text fontSize="xl" width="54%" noOfLines={1}>{t.name}</Text>
          <Flex alignItems="center" width="19%" pl={1}>
            {getColorShard(t.area_id)}
            <Text fontSize="lg" pl="3">
              {areaName(t.area_id)}
            </Text>
          </Flex>
          <Text fontSize="xl" fontWeight="bold" textAlign="right" width="11%">${t.amount}</Text>
        </Flex>
        <Box py="3" pl="3" >
          <Flex alignItems="center" mb="1">
            <Heading fontSize="md" fontWeight="extrabold" mr="2">MEMO</Heading>
            {(!!t.split && !!t.parent_id) && <Badge variant="subtle" colorScheme="purple" mr="2">Split Child</Badge>}
            {(!!t.split && !t.parent_id) && <Badge variant="subtle" colorScheme="purple" mr="2">Split Parent</Badge>}
            {!!t.hidden && <Badge variant="subtle" colorScheme="gray" mr="2">Hidden</Badge>}
            {!!t.manual && <Badge variant="subtle" colorScheme="green">Manual</Badge>}
          </Flex>
          <Flex alignItems="center">
            <Box flex="1">
              {
                !!t.memo
                  ? <Text fontSize="xl"> {t.memo}</Text>
                  : <Text fontSize="xl" color="#D3D3D3">Edit to add memo...</Text>
              }
            </Box>
            <IconButton
              icon={<EditIcon />}
              size="sm"
              variant="outline"
              onClick={() => editTransaction(t)} />
          </Flex>
        </Box>
      </Box>
    )
  }

  function TransactionsTable() {
    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={() => { }}
        rowCount={remoteRowCount}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer disableHeight>
            {
              ({ width }) => (
                <List
                  height={800}
                  width={width + 20}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  rowCount={remoteRowCount}
                  rowHeight={130}
                  rowRenderer={rowRenderer}
                />
              )
            }
          </AutoSizer>
        )}
      </InfiniteLoader>
    )
  }

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
        <Button disabled={syncing} size="lg" mr="3" onClick={syncTransactions}>
          {syncing ? 'Syncing ...' : 'Sync'}
        </Button>
        <AddManualTransaction />
        <EditTransaction
          transaction={transaction}
          isModalOpen={isEditModalOpen}
          onModalClose={onEditModalClose}
          handleSplit={handleSplit} />
        <AddSplitTransactions
          parent={transaction}
          splits={splits}
          setSplits={setSplits}
          isOpen={isAddSplitsModalOpen}
          onClose={onAddSplitsModalClose} />
        <EditSplitTransactions
          parent={transaction}
          splits={splits}
          setSplits={setSplits}
          isOpen={isEditSplitsModalOpen}
          onClose={onEditSplitsModalClose} />
      </Nav>
      {
        (isTransactionsError || isAreasError)
          ? LoadingError()
          : (!transactions || !areas)
            ? LoadingList()
            : <>
              {FilterDropdown()}
              {TransactionsTable()}
            </>
      }
    </Box>
  )
}