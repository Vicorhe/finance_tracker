import { useContext, useState } from 'react'
import { FaRegMoneyBillAlt } from "react-icons/fa";
import axios from 'axios'
import moment from 'moment'
import { UserContext, PrimaryChartContext } from "../../../context"
import Nav from '../../../components/Nav'
import DatePicker from '../../../components/DatePicker'
import BarChart from '../../../components/BarChart'
import MakeComparisonModal from '../../../components/MakeComparisonModal'
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
  TabPanel,
  Table, Thead, Tbody, Tr, Th, Td,
  Icon,
  Text
} from "@chakra-ui/react"
import Link from 'next/link'
import utilStyles from '../../../styles/utils.module.scss'

export default function Comparison() {
  const [primaryFromDate, setPrimaryFromDate] = useState(new Date())
  const [primaryToDate, setPrimaryToDate] = useState(new Date())
  const [secondaryFromDate, setSecondaryFromDate] = useState(new Date())
  const [secondaryToDate, setSecondaryToDate] = useState(new Date())
  const { user } = useContext(UserContext)
  const { setPrimaryChart } = useContext(PrimaryChartContext)
  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` },
    { name: "reports", path: `/${user.name}/reports` },
    { name: "comparison", path: `/${user.name}/reports/comparison` }
  ]

  async function generateReport() {
    // const formattedFromDate = moment(fromDate).format('YYYY-MM-DD')
    // const formattedToDate = moment(toDate).format('YYYY-MM-DD')
    // const res = await axios.post(`http://localhost:3000/api/report/areas`, {
    //   user_id: user.id,
    //   start_date: formattedFromDate,
    //   end_date: formattedToDate
    // });
    // const areas_aggregate = res.data
    // setPieChartData(areas_aggregate.filter(a => !a.input))
    // setAreasAggregate(areas_aggregate)
    // var sumInput = areas_aggregate.reduce(
    //   (a, c) => {
    //     if (!!c.input)
    //       return a + parseFloat(c.value)
    //     return a
    //   }, 0)
    // setTotalInput(sumInput)
  }

  function handleClick(a) {
    // setPrimaryChart({
    //   area: a,
    //   from: moment(fromDate).format('YYYY-MM-DD'),
    //   to: moment(toDate).format('YYYY-MM-DD')
    // })
  }

  function ComparisonReportTable() {
    // return (
    //   <Table variant="simple" size="md">
    //     <Thead>
    //       <Tr>
    //         <Th>Area</Th>
    //         <Th isNumeric># Transactions</Th>
    //         <Th isNumeric>Amount</Th>
    //         <Th isNumeric>Percentage</Th>
    //       </Tr>
    //     </Thead>
    //     <Tbody>
    //       {areasAggregate.filter((a) => !!a.input)
    //         .map((a) => (
    //           <Tr
    //             key={a.label}
    //             onClick={() => handleClick(a.label)}
    //           >
    //             <Td alignItems="center">
    //               <Icon
    //                 as={FaRegMoneyBillAlt}
    //                 color="#FFC527"
    //                 mr={1}
    //                 width={17}
    //               />
    //               <Link href={`/${user.name}/reports/breakdown`}>
    //                 <Text className={utilStyles.hover_underline_animation}
    //                   lineHeight={1.5}
    //                   fontWeight="bold"
    //                 >
    //                   {a.id}
    //                 </Text>
    //               </Link>
    //             </Td>

    //             <Td isNumeric >
    //               <Link href={`/${user.name}/reports/breakdown`}>
    //                 <Text className={utilStyles.hover_underline_animation}
    //                   lineHeight={1.5}
    //                   fontWeight="bold"
    //                 >
    //                   {a.count}
    //                 </Text>
    //               </Link>
    //             </Td>

    //             <Td isNumeric textColor="#2d6a4f" fontWeight="bold">${-a.value}</Td>

    //             <Td isNumeric textColor="#2d6a4f" fontWeight="extrabold">{getPercentage(a.value)}</Td>
    //           </Tr>
    //         ))}
    //       {areasAggregate.filter((a) => !a.input)
    //         .map((a) => (
    //           <Tr
    //             key={a.label}
    //             onClick={() => handleClick(a.label)}
    //           >
    //             <Td>
    //               <Link href={`/${user.name}/reports/breakdown`}>
    //                 <Text className={utilStyles.hover_underline_animation}
    //                   lineHeight={1.5}
    //                   fontWeight="bold"
    //                 >
    //                   {a.id}
    //                 </Text>
    //               </Link>
    //             </Td>

    //             <Td isNumeric >
    //               <Link href={`/${user.name}/reports/breakdown`}>
    //                 <Text className={utilStyles.hover_underline_animation}
    //                   lineHeight={1.5}
    //                   fontWeight="bold"
    //                 >
    //                   {a.count}
    //                 </Text>
    //               </Link>
    //             </Td>

    //             <Td isNumeric textColor="#9d0208" fontWeight="bold">${a.value}</Td>

    //             <Td isNumeric textColor="#9d0208" fontWeight="extrabold">{getPercentage(-a.value)}</Td>
    //           </Tr>
    //         ))}
    //     </Tbody>
    //   </Table>
    // )
  }

  const datatmp = [
    {
      "area": "1",
      "primary": 63,
      "primaryColor": "hsl(343, 70%, 50%)",
      "secondary": 87,
      "secondaryColor": "hsl(158, 70%, 50%)",
    },
    {
      "area": "2",
      "primary": 94,
      "primaryColor": "hsl(337, 70%, 50%)",
      "secondary": 54,
      "secondaryColor": "hsl(296, 70%, 50%)",     
    },
    {
      "area": "3",
      "primary": 63,
      "primaryColor": "hsl(343, 70%, 50%)",
      "secondary": 87,
      "secondaryColor": "hsl(158, 70%, 50%)",
    },
    {
      "area": "4",
      "primary": 94,
      "primaryColor": "hsl(337, 70%, 50%)",
      "secondary": 54,
      "secondaryColor": "hsl(296, 70%, 50%)",     
    },
    {
      "area": "5",
      "primary": 63,
      "primaryColor": "hsl(343, 70%, 50%)",
      "secondary": 87,
      "secondaryColor": "hsl(158, 70%, 50%)",
    },
    {
      "area": "6",
      "primary": 94,
      "primaryColor": "hsl(337, 70%, 50%)",
      "secondary": 54,
      "secondaryColor": "hsl(296, 70%, 50%)",     
    },
    {
      "area": "7",
      "primary": 63,
      "primaryColor": "hsl(343, 70%, 50%)",
      "secondary": 87,
      "secondaryColor": "hsl(158, 70%, 50%)",
    },
    {
      "area": "8",
      "primary": 94,
      "primaryColor": "hsl(337, 70%, 50%)",
      "secondary": 54,
      "secondaryColor": "hsl(296, 70%, 50%)",     
    },
    {
      "area": "9",
      "primary": 63,
      "primaryColor": "hsl(343, 70%, 50%)",
      "secondary": 87,
      "secondaryColor": "hsl(158, 70%, 50%)",
    },
    {
      "area": "10",
      "primary": 94,
      "primaryColor": "hsl(337, 70%, 50%)",
      "secondary": 54,
      "secondaryColor": "hsl(296, 70%, 50%)",     
    },
    {
      "area": "11",
      "primary": 63,
      "primaryColor": "hsl(343, 70%, 50%)",
      "secondary": 87,
      "secondaryColor": "hsl(158, 70%, 50%)",
    },
    {
      "area": "12",
      "primary": 94,
      "primaryColor": "hsl(337, 70%, 50%)",
      "secondary": 54,
      "secondaryColor": "hsl(296, 70%, 50%)",     
    },
    {
      "area": "13",
      "primary": 63,
      "primaryColor": "hsl(343, 70%, 50%)",
      "secondary": 87,
      "secondaryColor": "hsl(158, 70%, 50%)",
    },
    {
      "area": "14",
      "primary": 94,
      "primaryColor": "hsl(337, 70%, 50%)",
      "secondary": 54,
      "secondaryColor": "hsl(296, 70%, 50%)",     
    },
    {
      "area": "15",
      "primary": 63,
      "primaryColor": "hsl(343, 70%, 50%)",
      "secondary": 87,
      "secondaryColor": "hsl(158, 70%, 50%)",
    },
    {
      "area": "16",
      "primary": 94,
      "primaryColor": "hsl(337, 70%, 50%)",
      "secondary": 54,
      "secondaryColor": "hsl(296, 70%, 50%)",     
    },
    {
      "area": "17",
      "primary": 63,
      "primaryColor": "hsl(343, 70%, 50%)",
      "secondary": 87,
      "secondaryColor": "hsl(158, 70%, 50%)",
    },
    {
      "area": "18",
      "primary": 94,
      "primaryColor": "hsl(337, 70%, 50%)",
      "secondary": 54,
      "secondaryColor": "hsl(296, 70%, 50%)",     
    }
    ,
    {
      "area": "19",
      "primary": 94,
      "primaryColor": "hsl(337, 70%, 50%)",
      "secondary": 54,
      "secondaryColor": "hsl(296, 70%, 50%)",     
    },
    {
      "area": "20",
      "primary": 94,
      "primaryColor": "hsl(337, 70%, 50%)",
      "secondary": 54,
      "secondaryColor": "hsl(296, 70%, 50%)",     
    },
    {
      "area": "self development",
      "primary": 94,
      "primaryColor": "hsl(337, 70%, 50%)",
      "secondary": 54,
      "secondaryColor": "hsl(296, 70%, 50%)",     
    },
    {
      "area": "business expense",
      "primary": 94,
      "primaryColor": "hsl(337, 70%, 50%)",
      "secondary": 54,
      "secondaryColor": "hsl(296, 70%, 50%)",     
    }
  ]

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
      </Nav>
      <Flex alignItems="center" pt="3">
        <Box width="117px">
          <DatePicker
            id="primaryFromDate"
            selectedDate={primaryFromDate}
            onChange={d => setPrimaryFromDate(d)}
            showPopperArrow={true}
          />
        </Box>
        <Heading fontSize="lg" px="1" fontWeight="extrabold">-</Heading>
        <Box width="117px">
          <DatePicker
            id="primaryToDate"
            selectedDate={primaryToDate}
            onChange={d => setPrimaryToDate(d)}
            showPopperArrow={true}
          />
        </Box>
        <Heading fontSize="lg" px="3" fontWeight="extrabold">VS</Heading>
        <Box width="117px">
          <DatePicker
            id="secondaryFromDate"
            selectedDate={secondaryFromDate}
            onChange={d => setSecondaryFromDate(d)}
            showPopperArrow={true}
          />
        </Box>
        <Heading fontSize="lg" px="1" fontWeight="extrabold">-</Heading>
        <Box width="117px">
          <DatePicker
            id="secondaryToDate"
            selectedDate={secondaryToDate}
            onChange={d => setSecondaryToDate(d)}
            showPopperArrow={true}
          />
        </Box>
        <Spacer />
        <Button
          ml={3}
          onClick={generateReport}
        >
          Compare
        </Button>
      </Flex>
      <BarChart
      data={datatmp}
      />
      {/* {
        areasAggregate.length > 0 &&
        <Tabs
          size="md"
          variant="line"
          align="center"
          py={4}
        >
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Details</Tab>
          </TabList>
          <TabPanels
            height="67vh"
            overflow="scroll"
          >
            <TabPanel height="67vh">
              <PieChart
                data={pieChartData}
                fromDate={moment(fromDate).format('YYYY-MM-DD')}
                toDate={moment(toDate).format('YYYY-MM-DD')}
              />
            </TabPanel>
            <TabPanel>
              <SpendingReportTable />
            </TabPanel>
          </TabPanels>
        </Tabs>
      } */}

    </Box>
  )
}