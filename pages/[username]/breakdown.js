import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized'
import { UserContext, PrimaryChartContext } from '../../context'
import { Box, Heading, Text, Flex, Select, Badge } from "@chakra-ui/react"
import { useAreas } from '../../lib/swr-hooks'
import Nav from '../../components/Nav'
import ColorShard from '../../components/ColorShard'
import LoadingError from '../../components/LoadingError'
import LoadingList from '../../components/LoadingList'
import utilStyles from '../../styles/utils.module.scss'
const moment = require('moment')

export default function SpendingReportBreakdown() {
  const { user, setUser } = useContext(UserContext)
  const { primaryChart } = useContext(PrimaryChartContext)
  const router = useRouter()
  const { username } = router.query
  const { areas, isAreasError } = useAreas();
  const [transactions, setTransactions] = useState([])
  const [displayedTransactions, setDisplayedTransactions] = useState([])
  const [remoteRowCount, setRemoteRowCount] = useState(0)
  const [filterBy, setFilterBy] = useState(0)

  const breadcrumbs = [
    { name: username, path: `/${username}` },
    { name: "breakdown", path: `/${username}/breakdown` }
  ]

  useEffect(() => {
    pullUser()
  }, [router])

  async function pullUser() {
    if (Object.keys(user).length === 0) {
      const res = await axios.get(`http://localhost:3000/api/user/get?name=${username}`);
      setUser(res.data)
    }
  }

  // useEffect(() => {
  //   getTransactions()
  // }, [primaryChart])

  useEffect(() => {
    setRemoteRowCount(displayedTransactions.length)
  }, [displayedTransactions])

  useEffect(() => {
    filterTransactions()
  }, [filterBy])

  async function getTransactions() {
    const res = await axios.post(`http://localhost:3000/api/report/transactions`, {
      user_id: user.id,
      start_date: primaryChart.start,
      end_date: primaryChart.end
    });
    setTransactions(res.data)
    setFilterBy(primaryChart.area)
  }

  function filterTransactions() {
    setDisplayedTransactions(transactions.filter(t => t.area_id === parseInt(filterBy)))
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
          <Heading fontSize="lg" mr="3" fontWeight="extrabold">SHOWING</Heading>
          <Select
            size="md"
            maxWidth="225px"
            disabled={!transactions}
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
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