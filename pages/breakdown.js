import { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Heading, Flex, Select, Spacer } from "@chakra-ui/react"
import useAreas from '../hooks/areas'
import Nav from '../components/Nav'
import DatePicker from '../components/DatePicker'
import TransactionsTable from '../components/TransactionsTable'
import LoadingError from '../components/LoadingError'
import LoadingList from '../components/LoadingList'
import utilStyles from '../styles/utils.module.scss'
import { formatMySQLDate } from '../utils/date-formatter'
import { fetchArea, fetchDate } from '../utils/persistance'
import { breakdownStartDateKey, breakdownEndDateKey, areaKey } from '../static/constants'

const moment = require('moment')
const NEXT_PUBLIC_USER_ID = process.env.NEXT_PUBLIC_USER_ID;

export default function SpendingReportBreakdown() {
  const { areas, isAreasError } = useAreas();
  const [startDate, setStartDate] = useState(fetchDate(breakdownStartDateKey, moment().subtract(1, "M").toDate()))
  const [endDate, setEndDate] = useState(fetchDate(breakdownEndDateKey, new Date()))
  const [transactions, setTransactions] = useState([])
  const [displayedTransactions, setDisplayedTransactions] = useState([])
  const [filterBy, setFilterBy] = useState(fetchArea())

  const breadcrumbs = [
    { name: "breakdown", path: "/breakdown" }
  ]

  useEffect(() => {
    localStorage.setItem(breakdownStartDateKey, formatMySQLDate(startDate))
    localStorage.setItem(breakdownEndDateKey, formatMySQLDate(endDate))
    localStorage.setItem(areaKey, JSON.stringify(filterBy))
  })

  useEffect(() => {
    getTransactions()
  }, [startDate, endDate])

  useEffect(() => {
    filterTransactions()
  }, [filterBy, transactions])

  async function getTransactions() {
    if (!startDate || !endDate) return
    try {
      const res = await axios.post("/api/report/transactions", {
        user_id: NEXT_PUBLIC_USER_ID,
        start_date: formatMySQLDate(startDate),
        end_date: formatMySQLDate(endDate)
      });
      setTransactions(res.data)
    } catch (e) {
      throw Error(e.message)
    }
  }

  function filterTransactions() {
    if (transactions.length === 0) return
    setDisplayedTransactions(transactions.filter(t => t.area_id === filterBy))
  }

  function ToolBar() {
    return (
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
            : <>
              {ToolBar()}
              <TransactionsTable
                displayedTransactions={displayedTransactions}
                refresh={getTransactions} />
            </>
      }
    </Box>
  );
}