import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized'
import { UserContext } from "../../context"
import { mutate } from 'swr'
import { useAreas, useTransactions } from "../../lib/swr-hooks"
import Nav from '../../components/Nav'
import AddCashTransactionModal from '../../components/AddCashTransactionModal'
import EditTransactionModal from '../../components/EditTransactionModal'
import AddSplitTransactionsModal from '../../components/AddSplitTransactionsModal'
import EditSplitTransactionsModal from '../../components/EditSplitTransactionsModal'
import ColorShard from '../../components/ColorShard'
import LoadingError from '../../components/LoadingError'
import LoadingList from '../../components/LoadingList'
import { useDisclosure, Box, Button, Heading, Text, Flex, Select, IconButton, Badge } from "@chakra-ui/react"
import { EditIcon } from '@chakra-ui/icons'
import utilStyles from '../../styles/utils.module.scss'
const moment = require('moment')

export default function Transactions() {
  const { user } = useContext(UserContext)
  const { areas, isAreasError } = useAreas();
  const { transactions, isTransactionsError } = useTransactions(user.id)
  const [displayedTransactions, setDisplayedTransactions] = useState([])
  const [remoteRowCount, setRemoteRowCount] = useState(0)
  const [filterBy, setFilterBy] = useState('all')
  const [syncing, setSyncing] = useState(false)
  const [transaction, setTransaction] = useState({})
  const [activeSplits, setActiveSplits] = useState([])
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
    { name: user.name, path: `/${user.name}` },
    { name: "transactions", path: `/${user.name}/transactions` }
  ]

  // useEffect(() => {
  //   syncTransactions() // commented out during development
  // }, []);

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
      case 'cash':
        setDisplayedTransactions(transactions.filter(t => !!t.cash))
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
    const res = await axios.get(`http://localhost:3000/api/transaction/get?id=${id}`);
    setTransaction(res.data[0])
  }

  async function getSplits(parent_id) {
    const res = await axios.get(`http://localhost:3000/api/split/get-all?parent_id=${parent_id}`);
    setActiveSplits(res.data)
  }

  function handleCreateSplit() {
    onEditModalClose()
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
    await axios.post('http://localhost:3000/api/transaction/sync', { user_id: user.id });
    mutate(`/api/transaction/get-all?user_id=${user.id}`)
    setSyncing(false)
  }


  function isRowLoaded({ index }) {
    return !!transactions[index];
  }

  function loadMoreRows({ startIndex, stopIndex }) {
    // return fetch(`path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`)
    //   .then(response => {
    //     // Store response data in list...
    //   })
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
          <Text fontSize="xl" width="16%">{moment(t.date).format("MMM DD, YYYY")}</Text>
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
            {!!t.cash && <Badge variant="subtle" colorScheme="green">Cash</Badge>}
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
      <Box>
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
            <option value="cash">Cash Transactions</option>
            <option value="split">Splits</option>
          </Select>
        </Flex>
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
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
      </Box >
    )
  }

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
        <Button disabled={syncing} size="lg" mr="3" onClick={syncTransactions}>
          {syncing ? 'Syncing ...' : 'Sync'}
        </Button>
        <AddCashTransactionModal />
      </Nav>
      {
        (isTransactionsError || isAreasError)
          ? LoadingError()
          : (!transactions || !areas)
            ? LoadingList()
            : TransactionsTable()
      }
      <AddSplitTransactionsModal
        parent={transaction}
        isModalOpen={isAddSplitsModalOpen}
        onModalClose={onAddSplitsModalClose} />
      <EditSplitTransactionsModal
        parent={transaction}
        activeSplits={activeSplits}
        isModalOpen={isEditSplitsModalOpen}
        onModalClose={onEditSplitsModalClose} />
      <EditTransactionModal
        transaction={transaction}
        isModalOpen={isEditModalOpen}
        onModalClose={onEditModalClose}
        handleSplit={handleCreateSplit} />
    </Box>
  )
}