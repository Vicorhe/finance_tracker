import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import moment from 'moment'
import Nav from '../../components/Nav'
import DatePicker from '../../components/DatePicker'
import BarChart from '../../components/BarChart'
import {
  Box, Flex, Spacer, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, Text,
} from "@chakra-ui/react"
import utilStyles from '../../styles/utils.module.scss'
import { formatMySQLDate, formatDisplayDate } from '../../utils/date-formatter'
import { fetchDate, setBreakdownState } from '../../utils/persistance'
const NEXT_PUBLIC_USER_ID = process.env.NEXT_PUBLIC_USER_ID;
const periodOneStartDateKey = 'start-date-a'
const periodOneEndDateKey = 'end-date-a'
const periodTwoStartDateKey = 'start-date-b'
const periodTwoEndDateKey = 'end-date-b'

export default function Comparison() {
  const [periodOneStartDate, setPeriodOneStartDate] = useState(
    fetchDate(periodOneStartDateKey, moment().subtract(1, "M").toDate())
  )
  const [periodOneEndDate, setPeriodOneEndDate] = useState(
    fetchDate(periodOneEndDateKey, new Date())
  )
  const [periodTwoStartDate, setPeriodTwoStartDate] = useState(
    fetchDate(periodTwoStartDateKey, moment().subtract(2, "M").toDate())
  )
  const [periodTwoEndDate, setPeriodTwoEndDate] = useState(
    fetchDate(periodTwoEndDateKey, moment().subtract(1, "M").subtract(1, "d").toDate())
  )
  const [barChartData, setBarChartData] = useState([])
  const [tableData, setTableData] = useState([])
  const breadcrumbs = [
    { name: "report", path: "/report" },
    { name: "comparison", path: "/report/comparison" }
  ]
  const router = useRouter()

  useEffect(() => {
    localStorage.setItem("start-date-a", formatMySQLDate(periodOneStartDate))
    localStorage.setItem("end-date-a", formatMySQLDate(periodOneEndDate))
    localStorage.setItem("start-date-b", formatMySQLDate(periodTwoStartDate))
    localStorage.setItem("end-date-b", formatMySQLDate(periodTwoEndDate))
  })

  useEffect(() => { generateReport() }, [periodOneStartDate, periodOneEndDate, periodTwoStartDate, periodTwoEndDate])

  async function generateReport() {
    const period_one_start_date = formatMySQLDate(periodOneStartDate)
    const period_one_end_date = formatMySQLDate(periodOneEndDate)
    const period_two_start_date = formatMySQLDate(periodTwoStartDate)
    const period_two_end_date = formatMySQLDate(periodTwoEndDate)
    const res = await axios.post(`http://localhost:3000/api/report/comparison`, {
      user_id: NEXT_PUBLIC_USER_ID,
      period_one_start_date,
      period_one_end_date,
      period_two_start_date,
      period_two_end_date
    });
    const comparison_data = res.data
    setBarChartData(comparison_data.filter(c => !c.input))
    setTableData(comparison_data)
  }

  function AreaRow(a) {
    return (
      <Tr key={a.area} >
        <Td alignItems="center">{a.area}</Td>
        <Td isNumeric>
          <Text className={utilStyles.hover_underline_animation}
            lineHeight={1.5}
            onClick={() => onClick(a.id, true)}
          >
            ${a.period_one}
          </Text>
        </Td>

        <Td isNumeric>
          <Text className={utilStyles.hover_underline_animation}
            lineHeight={1.5}
            onClick={() => onClick(a.id, false)}
          >
            ${a.period_two}
          </Text>
        </Td>

        <Td isNumeric fontWeight="bold">{(a.period_one - a.period_two).toFixed(2)}</Td>

        <Td isNumeric>{getDelta(a.period_one, a.period_two)}</Td>
      </Tr>
    )
  }

  function getDelta(a, b) {
    if (b == 0) return <Text>N/A</Text>
    let percentage = ((a - b) * 100 / b)
    return <Text>{percentage.toFixed(2)}%</Text>
  }

  function onClick(a, period_one) {
    let start_date = period_one ? periodOneStartDate : periodTwoStartDate
    let end_date = period_one ? periodOneEndDate : periodTwoEndDate
    setBreakdownState(a, start_date, end_date)
    router.push('/breakdown')
  }

  function ComparisonReportTable() {
    return (
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th> <br />Area</Th>
            <Th isNumeric>
              {formatDisplayDate(periodOneStartDate)}<br />{formatDisplayDate(periodOneEndDate)}
            </Th>
            <Th isNumeric>
              {formatDisplayDate(periodTwoStartDate)}<br />{formatDisplayDate(periodTwoEndDate)}
            </Th>
            <Th isNumeric>Absolute<br />Difference</Th>
            <Th isNumeric>Relative<br />Difference</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.filter(t => !!t.input)
            .map((a) => AreaRow(a))
          }
          {tableData.filter(t => !t.input)
            .map((a) => AreaRow(a))
          }
        </Tbody>
      </Table>
    )
  }

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
      </Nav>
      <Flex alignItems="center" pt="3">
        <Box width="117px">
          <DatePicker
            id="primaryFromDate"
            selectedDate={periodOneStartDate}
            onChange={d => setPeriodOneStartDate(d)}
            showPopperArrow={true}
          />
        </Box>
        <Heading fontSize="lg" px="1" fontWeight="extrabold">-</Heading>
        <Box width="117px">
          <DatePicker
            id="primaryToDate"
            selectedDate={periodOneEndDate}
            onChange={d => setPeriodOneEndDate(d)}
            showPopperArrow={true}
          />
        </Box>
        <Heading fontSize="lg" px="3" fontWeight="extrabold">VS</Heading>
        <Box width="117px">
          <DatePicker
            id="secondaryFromDate"
            selectedDate={periodTwoStartDate}
            onChange={d => setPeriodTwoStartDate(d)}
            showPopperArrow={true}
          />
        </Box>
        <Heading fontSize="lg" px="1" fontWeight="extrabold">-</Heading>
        <Box width="117px">
          <DatePicker
            id="secondaryToDate"
            selectedDate={periodTwoEndDate}
            onChange={d => setPeriodTwoEndDate(d)}
            showPopperArrow={true}
          />
        </Box>
        <Spacer />
        <Button
          ml={3}
          colorScheme="messenger"
          onClick={generateReport}
        >
          Compare
        </Button>
      </Flex>
      {
        barChartData.length > 0 &&
        <Box height="76vh">
          <Box height="95%">
            <BarChart
              data={barChartData}
              onClick={onClick}
            />
          </Box>
          <Box>
            <ComparisonReportTable />
          </Box>
        </Box>
      }
    </Box>
  )
}