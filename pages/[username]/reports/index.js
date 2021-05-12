import { useContext, useState } from 'react'
import { FaRegMoneyBillAlt } from "react-icons/fa";
import axios from 'axios'
import moment from 'moment'
import { UserContext, PrimaryChartContext } from "../../../context"
import Nav from '../../../components/Nav'
import DatePicker from '../../../components/DatePicker'
import PieChart from '../../../components/PieChart'
import MakeComparisonModal from '../../../components/MakeComparisonModal'
import {
  Box,
  Flex,
  Spacer,
  Heading,
  Button,
  Table, Thead, Tbody, Tr, Th, Td,
  Icon,
  Text
} from "@chakra-ui/react"
import Link from 'next/link'
import utilStyles from '../../../styles/utils.module.scss'

export default function Reports() {
  const [areasAggregate, setAreasAggregate] = useState([])
  const [totalInput, setTotalInput] = useState(0)
  const [pieChartData, setPieChartData] = useState([])
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const { user } = useContext(UserContext)
  const { setPrimaryChart } = useContext(PrimaryChartContext)
  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` },
    { name: "reports", path: `/${user.name}/reports` }
  ]

  async function generateReport() {
    const formattedFromDate = moment(fromDate).format('YYYY-MM-DD')
    const formattedToDate = moment(toDate).format('YYYY-MM-DD')
    const res = await axios.post(`http://localhost:3000/api/report/areas`, {
      user_id: user.id,
      start_date: formattedFromDate,
      end_date: formattedToDate
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

  function handleClick(a) {
    setPrimaryChart({
      area: a,
      from: moment(fromDate).format('YYYY-MM-DD'),
      to: moment(toDate).format('YYYY-MM-DD')
    })
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
            .map((a) => (
              <Tr
                key={a.label}
                onClick={() => handleClick(a.label)}
              >
                <Td alignItems="center">
                  <Icon
                    as={FaRegMoneyBillAlt}
                    color="#FFC527"
                    mr={1}
                    width={17}
                  />
                  <Link href={`/${user.name}/reports/breakdown`}>
                    <Text className={utilStyles.hover_underline_animation}
                      lineHeight={1.5}
                      fontWeight="bold"
                    >
                      {a.id}
                    </Text>
                  </Link>
                </Td>

                <Td isNumeric >
                  <Link href={`/${user.name}/reports/breakdown`}>
                    <Text className={utilStyles.hover_underline_animation}
                      lineHeight={1.5}
                      fontWeight="bold"
                    >
                      {a.count}
                    </Text>
                  </Link>
                </Td>

                <Td isNumeric textColor="#2d6a4f" fontWeight="bold">${-a.value}</Td>

                <Td isNumeric textColor="#2d6a4f" fontWeight="extrabold">{getPercentage(a.value)}</Td>
              </Tr>
            ))}
          {areasAggregate.filter((a) => !a.input)
            .map((a) => (
              <Tr
                key={a.label}
                onClick={() => handleClick(a.label)}
              >
                <Td>
                  <Link href={`/${user.name}/reports/breakdown`}>
                    <Text className={utilStyles.hover_underline_animation}
                      lineHeight={1.5}
                      fontWeight="bold"
                    >
                      {a.id}
                    </Text>
                  </Link>
                </Td>

                <Td isNumeric >
                  <Link href={`/${user.name}/reports/breakdown`}>
                    <Text className={utilStyles.hover_underline_animation}
                      lineHeight={1.5}
                      fontWeight="bold"
                    >
                      {a.count}
                    </Text>
                  </Link>
                </Td>

                <Td isNumeric textColor="#9d0208" fontWeight="bold">${a.value}</Td>

                <Td isNumeric textColor="#9d0208" fontWeight="extrabold">{getPercentage(-a.value)}</Td>
              </Tr>
            ))}
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
            selectedDate={fromDate}
            onChange={d => setFromDate(d)}
            showPopperArrow={true}
          />
        </Box>
        <Heading fontSize="lg" px="3" fontWeight="extrabold">TO</Heading>
        <Box width="117px">
          <DatePicker
            id="toDate"
            selectedDate={toDate}
            onChange={d => setToDate(d)}
            showPopperArrow={true}
          />
        </Box>
        <Spacer />
        <MakeComparisonModal primaryFromDate={fromDate} primaryToDate={toDate} />
        <Button
          ml={4}
          onClick={generateReport}
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
              fromDate={moment(fromDate).format('YYYY-MM-DD')}
              toDate={moment(toDate).format('YYYY-MM-DD')}
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