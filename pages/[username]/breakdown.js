import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized'
import { Box, Heading, Text, Flex, Select, Badge, Spacer } from "@chakra-ui/react"
import useAreas from '../../hooks/areas'
import Nav from '../../components/Nav'
import DatePicker from '../../components/DatePicker'
import ColorShard from '../../components/ColorShard'
import LoadingError from '../../components/LoadingError'
import LoadingList from '../../components/LoadingList'
import utilStyles from '../../styles/utils.module.scss'
const moment = require('moment')

export default function SpendingReportBreakdown() {
  const router = useRouter()
  const { username, area, start, end } = router.query
  const { areas, isAreasError } = useAreas();
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [transactions, setTransactions] = useState([])
  const [displayedTransactions, setDisplayedTransactions] = useState([])
  const [remoteRowCount, setRemoteRowCount] = useState(0)
  const [filterBy, setFilterBy] = useState(1)

  const breadcrumbs = [
    { name: username, path: `/${username}` },
    { name: "breakdown", path: `/${username}/breakdown` }
  ]

  useEffect(() => {
    if (!!area && !!start && !!end) {
      setFilterBy(parseInt(area))
      setStartDate(moment(start).toDate())
      setEndDate(moment(end).toDate())
    }
  }, [area, start, end])

  useEffect(() => {
    getTransactions()   
  }, [startDate, endDate, username])

  useEffect(() => {
    setRemoteRowCount(displayedTransactions.length)
  }, [displayedTransactions])

  useEffect(() => {
    filterTransactions()
  }, [filterBy, transactions])

  async function getTransactions() {
    if (!username || !startDate || !endDate) return
    // console.log(`fetching transactions of user ${username} between ${startDate} and ${endDate}`)
    const res = await axios.post(`http://localhost:3000/api/report/transactions`, {
      user_name: username,
      start_date: moment(startDate).format('YYYY-MM-DD'),
      end_date: moment(endDate).format('YYYY-MM-DD')
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
          <Text fontSize="xl" width="16%">{moment(t.date).format("MMM DD, YYYY")}</Text>
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
      <Nav breadcrumbs={breadcrumbs} />
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