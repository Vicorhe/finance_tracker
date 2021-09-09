import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import moment from 'moment'
import Nav from '../../components/Nav'
import DatePicker from '../../components/DatePicker'
import PieChart from '../../components/PieChart'
import {
  Box,
  Flex,
  Spacer,
  Heading,
  Button,
  Table, Thead, Tbody, Tr, Th, Td,
  Text
} from "@chakra-ui/react"
import Link from 'next/link'
import utilStyles from '../../styles/utils.module.scss'
import { formatMySQLDate } from '../../utils/date-formatter'
import { setBreakdownState } from '../../utils/persistance'
const NEXT_PUBLIC_USER_ID = process.env.NEXT_PUBLIC_USER_ID;

export default function Reports() {
  const [areasAggregate, setAreasAggregate] = useState([])
  const [totalInput, setTotalInput] = useState(0)
  const [pieChartData, setPieChartData] = useState([])
  const [startDate, setStartDate] = useState(moment().subtract(1, "M").toDate())
  const [endDate, setEndDate] = useState(new Date())
  const breadcrumbs = [
    { name: "reports", path: "/reports" }
  ]
  const router = useRouter()

  useEffect(() => {
    const startDateA = localStorage.getItem("start-date-a")
    const endDateA = localStorage.getItem("end-date-a")
    if (!!startDateA && !!endDateA) {
      setStartDate(moment(startDateA).toDate())
      setEndDate(moment(endDateA).toDate())
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("start-date-a", formatMySQLDate(startDate))
    localStorage.setItem("end-date-a", formatMySQLDate(endDate))
  })

  useEffect(() => { generateReport() }, [startDate, endDate])

  async function generateReport() {
    const res = await axios.post(`http://localhost:3000/api/report/areas`, {
      user_id: NEXT_PUBLIC_USER_ID,
      start_date: formatMySQLDate(startDate),
      end_date: formatMySQLDate(endDate)
    });
    const areas_aggregate = res.data
    setPieChartData(areas_aggregate.filter(a => !a.input))
    setAreasAggregate(areas_aggregate)
    var sumInput = areas_aggregate.reduce(
      (a, c) => {
        if (!!c.input)
          return a + parseFloat(c.value)
        return a
      }, 0)
    setTotalInput(sumInput)
  }

  function onClick(a) {
    setBreakdownState(a, startDate, endDate);
    router.push('/breakdown')
  }

  function AreaRow(a) {
    return (
      <Tr key={a.label}>
        <Td alignItems="center">
          <Text className={utilStyles.hover_underline_animation}
            lineHeight={1.5}
            onClick={() => onClick(a.label)}
          >
            {a.id}
          </Text>
        </Td>

        <Td isNumeric >
          <Text className={utilStyles.hover_underline_animation}
            lineHeight={1.5}
            onClick={() => onClick(a.label)}
          >
            {a.count}
          </Text>
        </Td>

        <Td isNumeric>${a.value}</Td>

        <Td isNumeric>{getPercentage(a.value)}</Td>
      </Tr>
    )
  }

  function SpendingReportTable() {
    return (
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Area</Th>
            <Th isNumeric># Transactions</Th>
            <Th isNumeric>Amount</Th>
            <Th isNumeric>Percentage</Th>
          </Tr>
        </Thead>
        <Tbody>
          {areasAggregate.filter((a) => !!a.input)
            .map((a) => AreaRow(a))
          }
          {areasAggregate.filter((a) => !a.input)
            .map((a) => AreaRow(a))
          }
        </Tbody>
      </Table>
    )
  }

  function getPercentage(partial) {
    if (totalInput === 0 || isNaN(totalInput))
      return 'N/A'
    return ((partial / totalInput) * 100).toFixed(1) + '%'
  }

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
      </Nav>
      <Flex alignItems="center" pt="3">
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
        <Link href={"/reports/comparison"}>
          <Button>
            Make a Comparison
          </Button>
        </Link>
        <Button
          ml={4}
          onClick={generateReport}
          colorScheme="messenger"
        >
          Generate Spending Report
        </Button>
      </Flex>
      {
        areasAggregate.length > 0 &&
        <Box height="76vh">
          <Box height="95%">
            <PieChart
              data={pieChartData}
              onClick={onClick}
            />
          </Box>
          <Box height="5%" mt={3}>
            <SpendingReportTable />
          </Box>
        </Box>
      }
    </Box>
  )
}