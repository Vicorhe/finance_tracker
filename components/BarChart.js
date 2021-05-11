import { useContext } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { useRouter } from 'next/router'
import { UserContext, PrimaryChartContext } from "../context"
import { Box, Text } from '@chakra-ui/react'

export default function BarChart({ data, fromDate, toDate }) {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { setPrimaryChart } = useContext(PrimaryChartContext)

  const theme = {
    "fontSize": 17,
    "tooltip": {
      "container": {
        "background": '#333',
      },
    },
  };

  function handleClick(e) {
    setPrimaryChart({
      area: e.label,
      from: fromDate,
      to: toDate
    })
    router.push(`/${user.name}/reports/breakdown`)
  }

  function ToolTip({ id, value, color }) {
    return (
      <Box p={3}>
        <Text fontSize="xl">
          {id}: ${value}
        </Text>
        <Text fontSize="xs">
          Click for Breakdown
        </Text>
      </Box>
    );
  }

  return <ResponsiveBar
    data={data}
    keys={['primary', 'secondary']}
    indexBy="area"
    margin={{ top: 56, right: 30, bottom: 150, left: 30 }}
    innerPadding={1}
    padding={0.3}
    groupMode="grouped"
    layout="vertical"
    valueScale={{ type: 'linear' }}
    indexScale={{ type: 'band', round: true }}
    colors={["#2d2d34", "#949d6a"]}
    axisRight={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: '', legendOffset: 0 }}
    axisBottom={{
      tickSize: 11,
      tickPadding: 7,
      tickRotation: 90,
      legend: '',
      legendPosition: 'middle',
      legendOffset: 32
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: '',
      legendPosition: 'middle',
      legendOffset: -40
    }}
    enableGridY={true}
    labelSkipWidth={20}
    labelTextColor="#f7f7ff"
    legends={[
      {
        dataFrom: 'keys',
        anchor: 'top-left',
        direction: 'row',
        justify: false,
        translateX: -22,
        translateY: -36,
        itemWidth: 77,
        itemHeight: 16,
        itemsSpacing: 6,
        symbolSize: 21,
        itemDirection: 'left-to-right'
      }
    ]}
    tooltip={ToolTip}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
  />
}