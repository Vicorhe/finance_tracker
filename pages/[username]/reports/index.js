import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { UserContext } from "../../../context"
import { FaRegMoneyBillAlt } from "react-icons/fa";
import moment from 'moment'
import Nav from '../../../components/Nav'
import DatePicker from '../../../components/DatePicker'
import PieChart from '../../../components/PieChart'
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
  const { user, setUser } = useContext(UserContext)
  const router = useRouter()
  const { username } = router.query
  const [areasAggregate, setAreasAggregate] = useState([])
  const [totalInput, setTotalInput] = useState(0)
  const [pieChartData, setPieChartData] = useState([])
  const [startDate, setStartDate] = useState(moment().subtract(1, "M").toDate())
  const [endDate, setEndDate] = useState(new Date())
  const breadcrumbs = [
    { name: username, path: `/${username}` },
    { name: "reports", path: `/${username}/reports` }
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

  async function generateReport() {
    const res = await axios.post(`http://localhost:3000/api/report/areas`, {
      user_id: user.id,
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

  function formatMySQLDate(d) {
    return moment(d).format('YYYY-MM-DD')
  }

  function getBreakdownURLObject(a) {
    return {
      pathname: '/[username]/breakdown',
      query: {
        username: username,
        area: a.label,
        start: formatMySQLDate(startDate),
        end: formatMySQLDate(endDate)
      }
    }
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
              <Tr key={a.label}>
                <Td alignItems="center">
                  <Icon
                    as={FaRegMoneyBillAlt}
                    color="#FFC527"
                    mr={1}
                    width={17}
                  />
                  <Link href={getBreakdownURLObject(a)}>
                    <Text className={utilStyles.hover_underline_animation}
                      lineHeight={1.5}
                      fontWeight="bold"
                    >
                      {a.id}
                    </Text>
                  </Link>
                </Td>

                <Td isNumeric >
                  <Link href={getBreakdownURLObject(a)}>
                    <Text className={utilStyles.hover_underline_animation}
                      lineHeight={1.5}
                      fontWeight="bold"
                    >
                      {a.count}
                    </Text>
                  </Link>
                </Td>

                <Td isNumeric textColor="#2d6a4f" fontWeight="bold">${a.value}</Td>

                <Td isNumeric textColor="#2d6a4f" fontWeight="extrabold">{getPercentage(a.value)}</Td>
              </Tr>
            ))}
          {areasAggregate.filter((a) => !a.input)
            .map((a) => (
              <Tr key={a.label}>
                <Td>
                  <Link href={getBreakdownURLObject(a)}>
                    <Text className={utilStyles.hover_underline_animation}
                      lineHeight={1.5}
                      fontWeight="bold"
                    >
                      {a.id}
                    </Text>
                  </Link>
                </Td>

                <Td isNumeric >
                  <Link href={getBreakdownURLObject(a)}>
                    <Text className={utilStyles.hover_underline_animation}
                      lineHeight={1.5}
                      fontWeight="bold"
                    >
                      {a.count}
                    </Text>
                  </Link>
                </Td>

                <Td isNumeric textColor="#9d0208" fontWeight="bold">${a.value}</Td>

                <Td isNumeric textColor="#9d0208" fontWeight="extrabold">{getPercentage(a.value)}</Td>
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
        <Link href={`/${user.name}/reports/comparison`}>
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
              startDate={formatMySQLDate(startDate)}
              endDate={formatMySQLDate(endDate)}
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