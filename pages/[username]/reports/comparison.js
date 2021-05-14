import { useContext, useState } from 'react'
import { FaRegMoneyBillAlt } from "react-icons/fa";
import axios from 'axios'
import moment from 'moment'
import { UserContext, PrimaryChartContext } from "../../../context"
import Nav from '../../../components/Nav'
import DatePicker from '../../../components/DatePicker'
import BarChart from '../../../components/BarChart'
import {
  Box,
  Flex,
  Spacer,
  Heading,
  Button,
  Table, Thead, Tbody, Tr, Th, Td,
  Icon,
  Text,
  StatArrow
} from "@chakra-ui/react"
import Link from 'next/link'
import utilStyles from '../../../styles/utils.module.scss'

export default function Comparison() {
  const [periodOneStartDate, setPeriodOneStartDate] = useState(
    moment().subtract(1, "M").toDate()
  )
  const [periodOneEndDate, setPeriodOneEndDate] = useState(new Date())
  const [periodTwoStartDate, setPeriodTwoStartDate] = useState(
    moment().subtract(3, "M").toDate()
  )
  const [periodTwoEndDate, setPeriodTwoEndDate] = useState(
    moment().subtract(2, "M").toDate()
  )
  const [barChartData, setBarChartData] = useState([])
  const [tableData, setTableData] = useState([])
  const { user } = useContext(UserContext)
  const { setPrimaryChart } = useContext(PrimaryChartContext)
  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` },
    { name: "reports", path: `/${user.name}/reports` },
    { name: "comparison", path: `/${user.name}/reports/comparison` }
  ]

  async function generateReport() {
    const period_one_start_date = formatMySQLDate(periodOneStartDate)
    const period_one_end_date = formatMySQLDate(periodOneEndDate)
    const period_two_start_date = formatMySQLDate(periodTwoStartDate)
    const period_two_end_date = formatMySQLDate(periodTwoEndDate)
    const res = await axios.post(`http://localhost:3000/api/report/comparison`, {
      user_id: user.id,
      period_one_start_date,
      period_one_end_date,
      period_two_start_date,
      period_two_end_date
    });
    const comparison_data = res.data
    setBarChartData(comparison_data.filter(c => !c.input))
    setTableData(comparison_data)
  }

  function handleClick(a) {
    // setPrimaryChart({
    //   area: a,
    //   from: moment(fromDate).format('YYYY-MM-DD'),
    //   to: moment(toDate).format('YYYY-MM-DD')
    // })
  }

  function formatMySQLDate(d) {
    return moment(d).format('YYYY-MM-DD')
  }

  function formatDisplayDate(d) {
    return moment(d).format("MMM DD, YYYY")
  }

  function getDelta(a, b) {
    if (b == 0) return 'N/A'
    let percentage = ((a - b) * 100 / b)
    let color = (percentage < 0) ? '#9d0208' : '#2d6a4f'
    let type = (percentage < 0) ? 'decrease' : 'increase'
    return <Text color={color} fontWeight="extrabold">
      <StatArrow type={type} mr={1} />
      {percentage.toFixed(2)}%
    </Text>
  }

  function ComparisonReportTable() {
    return (
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Area</Th>
            <Th isNumeric>Period 1 Total</Th>
            <Th isNumeric>Period 2 Total</Th>
            <Th isNumeric>Absolute Difference</Th>
            <Th isNumeric>Relative Difference</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.filter(t => !t.input)
            .map((a) => (
              <Tr
                key={a.area}
                onClick={() => handleClick(a.area)}
              >
                <Td alignItems="center">
                  <Icon
                    as={FaRegMoneyBillAlt}
                    color="#FFC527"
                    mr={1}
                    width={17}
                  />
                  {a.area}
                </Td>

                <Td isNumeric >
                  <Link href={`/${user.name}/reports/breakdown`}>
                    <Text className={utilStyles.hover_underline_animation}
                      lineHeight={1.5}
                      fontWeight="bold"
                    >
                      ${a.period_one}
                    </Text>
                  </Link>
                </Td>

                <Td isNumeric >
                  <Link href={`/${user.name}/reports/breakdown`}>
                    <Text className={utilStyles.hover_underline_animation}
                      lineHeight={1.5}
                      fontWeight="bold"
                    >
                      ${a.period_two}
                    </Text>
                  </Link>
                </Td>

                <Td isNumeric fontWeight="bold">{a.period_one - a.period_two}</Td>

                <Td isNumeric>{getDelta(a.period_one, a.period_two)}</Td>
              </Tr>
            ))}
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
          <Box height="80%">
            <BarChart
              data={barChartData}
            />
          </Box>
          <Box height="20%">
            <ComparisonReportTable />
          </Box>
        </Box>
      }
    </Box>
  )
}