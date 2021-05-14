import { useContext } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { useRouter } from 'next/router'
import { UserContext, PrimaryChartContext } from "../context"
import { Box, Text } from '@chakra-ui/react'
import moment from 'moment'

export default function BarChart({
  data,
  periodOneStartDate,
  periodOneEndDate,
  periodTwoStartDate,
  periodTwoEndDate
}) {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { setPrimaryChart } = useContext(PrimaryChartContext)

  function handleClick(e) {
    let start_date = e.id === 'period_one' ? periodOneStartDate : periodTwoStartDate
    let end_date = e.id === 'period_one' ? periodOneEndDate : periodTwoEndDate
    setPrimaryChart({
      area: e.data.id,
      start: moment(start_date).format('YYYY-MM-DD'),
      end: moment(end_date).format('YYYY-MM-DD')
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
    keys={['period_one', 'period_two']}
    indexBy="area"
    margin={{ top: 56, right: 40, bottom: 130, left: 40 }}
    innerPadding={1}
    padding={0.3}
    groupMode="grouped"
    layout="vertical"
    valueScale={{ type: 'linear' }}
    indexScale={{ type: 'band', round: true }}
    colors={["#6785d0", "#b75fb3"]}
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
    labelSkipWidth={40}
    labelTextColor="#f7f7ff"
    legends={[
      {
        dataFrom: 'keys',
        anchor: 'top-left',
        direction: 'row',
        justify: false,
        translateX: -29,
        translateY: -36,
        itemWidth: 77,
        itemHeight: 16,
        itemsSpacing: 17,
        symbolSize: 21,
        itemDirection: 'left-to-right'
      }
    ]}
    onClick={handleClick}
    tooltip={ToolTip}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
  />
}