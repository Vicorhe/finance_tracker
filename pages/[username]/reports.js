import { useContext, useState } from 'react'
import { UserContext } from "../../context"
import Nav from '../../components/Nav'
import DatePicker from '../../components/DatePicker'
import PieChart from '../../components/PieChart'
import MakeComparisonModal from '../../components/MakeComparisonModal'
import {
  Box,
  Flex,
  Spacer,
  Heading
} from "@chakra-ui/react"
import utilStyles from '../../styles/utils.module.scss'

export default function Reports() {
  const [data, setData] = useState(
    []
  )
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const { user } = useContext(UserContext)
  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` },
    { name: "reports", path: `/${user.name}/reports` }
  ]
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
        <MakeComparisonModal primaryFromDate={fromDate} primaryToDate={toDate} />
      </Flex>
      {
        data.length > 0 &&
        <PieChart data={data} />
      }
    </Box>
  )
}