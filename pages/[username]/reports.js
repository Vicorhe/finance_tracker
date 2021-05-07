import { useContext, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import { UserContext } from "../../context"
import Nav from '../../components/Nav'
import DatePicker from '../../components/DatePicker'
import PieChart from '../../components/PieChart'
import MakeComparisonModal from '../../components/MakeComparisonModal'
import {
  Box,
  Flex,
  Spacer,
  Heading,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from "@chakra-ui/react"
import utilStyles from '../../styles/utils.module.scss'

export default function Reports() {
  const [areasAggregate, setAreasAggregate] = useState([])
  const [pieChartData, setPieChartData] = useState([])
  const [transactions, setTransactions] = useState([])
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const { user } = useContext(UserContext)
  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` },
    { name: "reports", path: `/${user.name}/reports` }
  ]

  async function generateReport() {
    const formattedFromDate = moment(fromDate).format('YYYY-MM-DD')
    const formattedToDate = moment(toDate).format('YYYY-MM-DD')
    console.log(formattedFromDate, formattedToDate)
    const res = await axios.post(`http://localhost:3000/api/report/generate`, {
      user_id: user.id,
      start_date: formattedFromDate,
      end_date: formattedToDate
    });
    const { areas_aggregate, transactions } = res.data
    setPieChartData(areas_aggregate.filter(a => !a.input))
    setAreasAggregate(areas_aggregate)
    setTransactions(transactions)
  }

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
      </Nav>
      <Flex alignItems="center" pt="3">
        <Heading fontSize="lg" pr="3" fontWeight="extrabold">FROM</Heading>
        <Box width="167px">
          <DatePicker
            id="fromDate"
            selectedDate={fromDate}
            onChange={d => setFromDate(d)}
            showPopperArrow={true}
          />
        </Box>
        <Heading fontSize="lg" px="3" fontWeight="extrabold">TO</Heading>
        <Box width="167px">
          <DatePicker
            id="toDate"
            selectedDate={toDate}
            onChange={d => setToDate(d)}
            showPopperArrow={true}
          />
        </Box>
        <Spacer />
        <Button
          ml={3}
          onClick={generateReport}
        >
          Generate Report
        </Button>
      </Flex>
      {
        pieChartData.length > 0 &&
        <Tabs size="md" variant="line" align="center" flex={1} pt={4}>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Details</Tab>
          </TabList>
          <TabPanels>
            <TabPanel height="67vh">
              <PieChart data={pieChartData} />
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      }
      {
        areasAggregate.length > 0 &&
        <MakeComparisonModal primaryFromDate={fromDate} primaryToDate={toDate} />
      }

    </Box>
  )
}