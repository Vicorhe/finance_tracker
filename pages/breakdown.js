import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized'
import { useDisclosure, Box, Heading, Text, Flex, Select, Badge, Spacer, IconButton } from "@chakra-ui/react"
import { EditIcon } from '@chakra-ui/icons'
import useAreas from '../hooks/areas'
import Nav from '../components/Nav'
import DatePicker from '../components/DatePicker'
import EditTransaction from '../components/modals/transaction/EditTransaction'
import AddSplitTransactions from '../components/modals/transaction/AddSplitTransactions'
import EditSplitTransactions from '../components/modals/transaction/EditSplitTransactions'
import ColorShard from '../components/ColorShard'
import LoadingError from '../components/LoadingError'
import LoadingList from '../components/LoadingList'
import utilStyles from '../styles/utils.module.scss'
import { formatDisplayDate, formatMySQLDate } from '../utils/date-formatter'
import { getBlankSplit } from '../utils/split-utils'
import { fetchArea, fetchDate } from '../utils/persistance'
import { breakdownStartDateKey, breakdownEndDateKey, areaKey } from '../static/constants'

const moment = require('moment')
const NEXT_PUBLIC_USER_ID = process.env.NEXT_PUBLIC_USER_ID;


export default function SpendingReportBreakdown() {
  const router = useRouter();
  const { area } = router.query
  const { areas, isAreasError } = useAreas();
  const [startDate, setStartDate] = useState(fetchDate(breakdownStartDateKey, moment().subtract(1, "M").toDate()))
  const [endDate, setEndDate] = useState(fetchDate(breakdownEndDateKey, new Date()))
  const [transactions, setTransactions] = useState([])
  const [displayedTransactions, setDisplayedTransactions] = useState([])
  const [remoteRowCount, setRemoteRowCount] = useState(0)
  const [filterBy, setFilterBy] = useState(fetchArea())
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
    { name: "breakdown", path: "/breakdown" }
  ]

  useEffect(() => {
    localStorage.setItem(breakdownStartDateKey, formatMySQLDate(startDate))
    localStorage.setItem(breakdownEndDateKey, formatMySQLDate(endDate))
    localStorage.setItem(areaKey, JSON.stringify(filterBy))
  })

  useEffect(() => {
    if (!!area) {
      setFilterBy(parseInt(area))
    }
  }, [area])

  useEffect(() => {
    getTransactions()
  }, [startDate, endDate])

  useEffect(() => {
    setRemoteRowCount(displayedTransactions.length)
  }, [displayedTransactions])

  useEffect(() => {
    filterTransactions()
  }, [filterBy, transactions])

  async function getTransactions() {
    if (!startDate || !endDate) return
    // console.log(`fetching transactions of user ${username} between ${startDate} and ${endDate}`)
    const res = await axios.post(`http://localhost:3000/api/report/transactions`, {
      user_id: NEXT_PUBLIC_USER_ID,
      start_date: formatMySQLDate(startDate),
      end_date: formatMySQLDate(endDate)
    });
    setTransactions(res.data)
  }

  function filterTransactions() {
    if (transactions.length === 0) return
    // console.log(`filtering tranactions arr of length ${transactions.length} by area id ${filterBy}`)
    setDisplayedTransactions(transactions.filter(t => t.area_id === filterBy))
  }

  function isRowLoaded({ index }) {
    return !!displayedTransactions[index];
  }

  function loadMoreRows({ startIndex, stopIndex }) {
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
    getTransactions();
  }

  async function getTransaction(id) {
    await axios.get(
      `http://localhost:3000/api/transaction/get?id=${id}`
    ).then(res =>
      setTransaction(res.data)
    ).catch(e => {
      throw Error(e.message)
    });
  }

  async function getSplits(parent_id) {
    await axios.get(
      `http://localhost:3000/api/split/get-all?parent_id=${parent_id}`
    ).then(res =>
      setSplits(res.data)
    ).catch(e => {
      throw Error(e.message)
    });
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
          <Text fontSize="xl" fontWeight="bold" textAlign="right" width="11%">${Math.abs(t.amount)}</Text>
        </Flex>
        <Box py="3" pl="3" >
          <Flex alignItems="center" mb="1">
            <Heading fontSize="md" fontWeight="extrabold" mr="2">MEMO</Heading>
            {(!!t.split && !!t.parent_id) && <Badge variant="subtle" colorScheme="purple" mr="2">Split</Badge>}
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
      <Box>
        <Flex alignItems="center" p="3">
          <Heading fontSize="lg" pr="3" fontWeight="extrabold">FROM</Heading>
          <Box width="117px">
            <DatePicker
              id="fromDate"
              selectedDate={startDate}
              onChange={d => setStartDate(d)}
              showPopperArrow={true}
            />
          </Box>
          <Heading fontSize="lg" px="3" fontWeight="extrabold">TO</Heading>
          <Box width="117px">
            <DatePicker
              id="toDate"
              selectedDate={endDate}
              onChange={d => setEndDate(d)}
              showPopperArrow={true}
            />
          </Box>
          <Spacer />
          <Heading fontSize="lg" mr="3" fontWeight="extrabold">SHOWING</Heading>
          <Select
            size="md"
            maxWidth="225px"
            disabled={!transactions}
            value={filterBy}
            onChange={(e) => setFilterBy(parseInt(e.target.value))}
          >
            {
              areas.map((a) =>
                <option key={a.id}
                  value={a.id}>{a.name}
                </option>
              )
            }
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
        isAreasError
          ? LoadingError()
          : !areas
            ? LoadingList()
            : TransactionsTable()
      }
    </Box>
  );
}