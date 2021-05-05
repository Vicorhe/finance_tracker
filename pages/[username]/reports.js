import { useContext, useState } from 'react'
import { UserContext } from "../../context"
import { ResponsivePie } from '@nivo/pie'
import Nav from '../../components/Nav'
import DatePicker from '../../components/DatePicker'
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
    [
      {
        "id": "java",
        "label": "java",
        "value": 33,
        "color": "hsl(326, 70%, 50%)"
      },
      {
        "id": "php",
        "label": "php",
        "value": 444,
        "color": "hsl(66, 70%, 50%)"
      },
      {
        "id": "lisp",
        "label": "lisp",
        "value": 573,
        "color": "hsl(139, 70%, 50%)"
      },
      {
        "id": "rust",
        "label": "rust",
        "value": 532,
        "color": "hsl(50, 70%, 50%)"
      },
      {
        "id": "stylus",
        "label": "stylus",
        "value": 384,
        "color": "hsl(106, 70%, 50%)"
      }
    ]
  )
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const { user } = useContext(UserContext)
  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` },
    { name: "reports", path: `/${user.name}/reports` }
  ]
  const theme = {
    "fontSize": 17,
    "tooltip": {
      "container": {
        "background": '#333',
      },
    },
  };
  const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    let total = 0
    dataWithArc.forEach(datum => {
      total += datum.value
    })

    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: '27px',
          fontWeight: '400',
        }}
      >
        ${total}
      </text>
    )
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
        <MakeComparisonModal primaryFromDate={fromDate} primaryToDate={toDate} />
      </Flex>



      <ResponsivePie
        width={611}
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 70 }}
        innerRadius={0.3}
        padAngle={1}
        cornerRadius={3}
        activeInnerRadiusOffset={11}
        activeOuterRadiusOffset={7}
        borderWidth={2}
        borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
        arcLinkLabelsSkipAngle={1}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsDiagonalLength={16}
        arcLabelsSkipAngle={15}
        arcLinkLabelsColor={{ from: 'color' }}
        colors={{ datum: 'data.color' }}
        arcLabel={function (e) { return "$" + e.value }}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        theme={theme}
        layers={['arcs', 'arcLabels', 'arcLinkLabels', CenteredMetric]}
        onClick={(n, e) => { console.log(n) }}
        tooltip={({ datum: { id, value, color } }) => (
          <div
            style={{
              padding: 12,
              color,
              background: '#222222',
            }}
          >
            <span>See Details</span>
            <br />
            <strong>
              {id}: ${value}
            </strong>
          </div>
        )}
      />
    </Box>
  )
}